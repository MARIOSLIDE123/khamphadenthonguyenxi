/**
 * =========================================================================
 * GOOGLE APPS SCRIPT BACKEND CHO ỨNG DỤNG:
 * HÀNH TRÌNH KHÁM PHÁ ĐỀN THỜ NGUYỄN XÍ
 * Di tích quốc gia đặc biệt – xã Đông Lộc, tỉnh Nghệ An
 * =========================================================================
 * Tệp này được triển khai dưới dạng Google Apps Script Web App.
 * Kết nối đồng bộ an toàn với Google Sheets làm cơ sở dữ liệu.
 */

// Tên 6 trang tính chuẩn theo đặc tả hệ thống
var SHEET_NAMES = {
  STUDENTS: 'Students',
  SESSIONS: 'Sessions',
  ATTEMPTS: 'Attempts',
  ACTIVITY_EVENTS: 'ActivityEvents',
  SCORES: 'Scores',
  CONFIG: 'Config'
};

/**
 * Cấu hình khởi tạo các tiêu đề cột cho 6 trang tính
 */
var SHEET_HEADERS = {
  Students: ['studentId', 'createdAt', 'fullName', 'schoolName', 'className', 'publicDisplayName', 'status'],
  Sessions: ['sessionId', 'studentId', 'startedAt', 'lastSeenAt', 'endedAt', 'activeSeconds', 'completedModules', 'sessionStatus'],
  Attempts: ['attemptId', 'sessionId', 'studentId', 'questionId', 'activityType', 'submittedAnswer', 'isCorrect', 'attemptNumber', 'pointsAwarded', 'createdAt'],
  ActivityEvents: ['eventId', 'sessionId', 'studentId', 'activityId', 'activityType', 'pointsAwarded', 'createdAt'],
  Scores: ['studentId', 'totalScore', 'totalCorrect', 'totalQuestions', 'accuracy', 'activeSeconds', 'completedActivities', 'updatedAt'],
  Config: ['key', 'value', 'updatedAt']
};

/**
 * Hàm lấy đối tượng Spreadsheet đang được liên kết
 */
function getSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty('SPREADSHEET_ID') || '1m2NVC4nfXyAsi1jjQheZcYgP3q8BoHDXp0Za9ijgfa0';
  if (sheetId && sheetId.trim() !== '') {
    return SpreadsheetApp.openById(sheetId);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Endpoint GET: Kiểm tra sức khỏe hệ thống (Health Check)
 */
function doGet(e) {
  var output = {
    success: true,
    message: 'Google Apps Script Backend cho Đền thờ Nguyễn Xí đang hoạt động ổn định.',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  };
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Endpoint POST: Tiếp nhận và định tuyến các tác vụ API từ Vercel / Express
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Khóa đồng bộ trong tối đa 10 giây để chống race condition / ghi trùng
    lock.waitLock(10000);

    var rawData = e.postData ? e.postData.contents : '';
    if (!rawData) {
      return jsonResponse(false, null, 'Không nhận được dữ liệu tải lên.');
    }

    var request = JSON.parse(rawData);
    var action = request.action;
    var secret = request.secret;
    var payload = request.payload || {};

    // Kiểm tra khóa bí mật dùng chung (nếu đã cấu hình trong Script Properties)
    var sharedSecret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
    if (sharedSecret && sharedSecret !== '' && secret !== sharedSecret) {
      return jsonResponse(false, null, 'Xác thực bảo mật không hợp lệ (Invalid Secret).');
    }

    var result = null;

    switch (action) {
      case 'registerStudent':
        result = registerStudent(payload);
        break;

      case 'recordHeartbeat':
        result = recordHeartbeat(payload);
        break;

      case 'recordAnswerAttempt':
        result = recordAnswerAttempt(payload);
        break;

      case 'recordActivity':
        result = recordActivity(payload);
        break;

      case 'getLeaderboard':
        result = getLeaderboard();
        break;

      case 'endSession':
        result = endSession(payload);
        break;

      case 'initSpreadsheet':
        result = initSpreadsheet();
        break;

      default:
        return jsonResponse(false, null, 'Hành động không xác định: ' + action);
    }

    return jsonResponse(true, result, 'Thành công.');
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return jsonResponse(false, null, 'Lỗi xử lý máy chủ Apps Script: ' + error.message);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Trả về JSON chuẩn hóa
 */
function jsonResponse(success, data, message) {
  var output = {
    success: success,
    data: data,
    message: message
  };
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Khởi tạo hoặc cập nhật cấu trúc 6 Sheet trên Google Sheets
 */
function initSpreadsheet() {
  var ss = getSpreadsheet();
  for (var name in SHEET_HEADERS) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    // Ghi hàng tiêu đề nếu chưa có
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(SHEET_HEADERS[name]);
      sheet.getRange(1, 1, 1, SHEET_HEADERS[name].length)
        .setFontWeight('bold')
        .setBackground('#FFF6E5');
      sheet.setFrozenRows(1);
    }
  }
  return { message: 'Đã khởi tạo thành công 6 Sheet dữ liệu.' };
}

/**
 * 1. Đăng ký người học (Lưu vào Sheet Students và khởi tạo Scores)
 */
function registerStudent(payload) {
  var ss = getSpreadsheet();
  var studentsSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  var scoresSheet = ss.getSheetByName(SHEET_NAMES.SCORES);

  var studentId = payload.studentId;
  var createdAt = payload.createdAt || new Date().toISOString();
  var fullName = payload.fullName;
  var schoolName = payload.schoolName;
  var className = payload.className;
  var publicDisplayName = payload.publicDisplayName;
  var status = 'ACTIVE';

  // Thêm vào bảng Students
  studentsSheet.appendRow([studentId, createdAt, fullName, schoolName, className, publicDisplayName, status]);

  // Khởi tạo hàng điểm trong Scores
  scoresSheet.appendRow([studentId, 0, 0, 0, 0, 0, '', createdAt]);

  // Khởi tạo hàng trong Sessions nếu có mã phiên
  if (payload.sessionId) {
    var sessionsSheet = ss.getSheetByName(SHEET_NAMES.SESSIONS);
    sessionsSheet.appendRow([payload.sessionId, studentId, createdAt, createdAt, '', 0, '', 'ACTIVE']);
  }

  return { studentId: studentId, registered: true };
}

/**
 * 2. Ghi nhận thời gian hoạt động học tập (Heartbeat)
 */
function recordHeartbeat(payload) {
  var ss = getSpreadsheet();
  var sessionsSheet = ss.getSheetByName(SHEET_NAMES.SESSIONS);
  var scoresSheet = ss.getSheetByName(SHEET_NAMES.SCORES);

  var sessionId = payload.sessionId;
  var studentId = payload.studentId;
  var activeSeconds = payload.activeSeconds || 0;
  var now = new Date().toISOString();

  // Cập nhật session tương ứng
  var sData = sessionsSheet.getDataRange().getValues();
  for (var i = 1; i < sData.length; i++) {
    if (sData[i][0] === sessionId) {
      sessionsSheet.getRange(i + 1, 4).setValue(now); // lastSeenAt
      sessionsSheet.getRange(i + 1, 6).setValue(activeSeconds); // activeSeconds
      break;
    }
  }

  // Cập nhật tổng thời gian trong Scores
  var scData = scoresSheet.getDataRange().getValues();
  for (var j = 1; j < scData.length; j++) {
    if (scData[j][0] === studentId) {
      scoresSheet.getRange(j + 1, 6).setValue(activeSeconds);
      scoresSheet.getRange(j + 1, 8).setValue(now);
      break;
    }
  }

  return { activeSeconds: activeSeconds };
}

/**
 * 3. Ghi nhận lượt trả lời câu hỏi (Sheet Attempts và cập nhật Scores)
 */
function recordAnswerAttempt(payload) {
  var ss = getSpreadsheet();
  var attemptsSheet = ss.getSheetByName(SHEET_NAMES.ATTEMPTS);
  var scoresSheet = ss.getSheetByName(SHEET_NAMES.SCORES);

  var attemptId = payload.attemptId;
  var sessionId = payload.sessionId;
  var studentId = payload.studentId;
  var questionId = payload.questionId;
  var activityType = 'QUIZ_ANSWER';
  var submittedAnswer = payload.submittedAnswer || '';
  var isCorrect = payload.isCorrect ? true : false;
  var attemptNumber = payload.attemptNumber || 1;
  var pointsAwarded = payload.pointsAwarded || 0;
  var createdAt = payload.createdAt || new Date().toISOString();

  // Kiểm tra trùng mã giao dịch
  var aData = attemptsSheet.getDataRange().getValues();
  for (var i = 1; i < aData.length; i++) {
    if (aData[i][0] === attemptId) {
      return { duplicate: true, attemptId: attemptId };
    }
  }

  // Thêm vào bảng Attempts
  attemptsSheet.appendRow([
    attemptId,
    sessionId,
    studentId,
    questionId,
    activityType,
    submittedAnswer,
    isCorrect,
    attemptNumber,
    pointsAwarded,
    createdAt
  ]);

  // Cập nhật điểm trong bảng Scores
  var scData = scoresSheet.getDataRange().getValues();
  for (var j = 1; j < scData.length; j++) {
    if (scData[j][0] === studentId) {
      if (payload.currentScore !== undefined) {
        scoresSheet.getRange(j + 1, 2).setValue(payload.currentScore);
      }
      if (payload.totalCorrect !== undefined) {
        scoresSheet.getRange(j + 1, 3).setValue(payload.totalCorrect);
      }
      if (payload.accuracy !== undefined) {
        scoresSheet.getRange(j + 1, 5).setValue(payload.accuracy);
      }
      scoresSheet.getRange(j + 1, 8).setValue(createdAt);
      break;
    }
  }

  return { recorded: true, pointsAwarded: pointsAwarded };
}

/**
 * 4. Ghi nhận hoạt động hoàn thành chủ đề / tham quan 360° / đấu trường
 */
function recordActivity(payload) {
  var ss = getSpreadsheet();
  var eventsSheet = ss.getSheetByName(SHEET_NAMES.ACTIVITY_EVENTS);
  var scoresSheet = ss.getSheetByName(SHEET_NAMES.SCORES);

  var eventId = payload.eventId;
  var sessionId = payload.sessionId;
  var studentId = payload.studentId;
  var activityId = payload.activityId;
  var activityType = payload.activityType;
  var pointsAwarded = payload.pointsAwarded || 0;
  var createdAt = payload.createdAt || new Date().toISOString();

  // Kiểm tra trùng
  var eData = eventsSheet.getDataRange().getValues();
  for (var i = 1; i < eData.length; i++) {
    if (eData[i][0] === eventId) {
      return { duplicate: true, eventId: eventId };
    }
  }

  eventsSheet.appendRow([eventId, sessionId, studentId, activityId, activityType, pointsAwarded, createdAt]);

  // Cập nhật điểm trong bảng Scores
  if (payload.totalScore !== undefined) {
    var scData = scoresSheet.getDataRange().getValues();
    for (var j = 1; j < scData.length; j++) {
      if (scData[j][0] === studentId) {
        scoresSheet.getRange(j + 1, 2).setValue(payload.totalScore);
        scoresSheet.getRange(j + 1, 8).setValue(createdAt);
        break;
      }
    }
  }

  return { recorded: true, pointsAwarded: pointsAwarded };
}

/**
 * 5. Kết thúc phiên học
 */
function endSession(payload) {
  var ss = getSpreadsheet();
  var sessionsSheet = ss.getSheetByName(SHEET_NAMES.SESSIONS);

  var sessionId = payload.sessionId;
  var endedAt = payload.endedAt || new Date().toISOString();

  var sData = sessionsSheet.getDataRange().getValues();
  for (var i = 1; i < sData.length; i++) {
    if (sData[i][0] === sessionId) {
      sessionsSheet.getRange(i + 1, 5).setValue(endedAt); // endedAt
      sessionsSheet.getRange(i + 1, 8).setValue('COMPLETED'); // sessionStatus
      break;
    }
  }

  return { sessionEnded: true };
}

/**
 * 6. Truy xuất bảng xếp hạng từ Google Sheets
 */
function getLeaderboard() {
  var ss = getSpreadsheet();
  var studentsSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  var scoresSheet = ss.getSheetByName(SHEET_NAMES.SCORES);

  var stuMap = {};
  var stuData = studentsSheet.getDataRange().getValues();
  for (var i = 1; i < stuData.length; i++) {
    stuMap[stuData[i][0]] = {
      publicDisplayName: stuData[i][5],
      schoolName: stuData[i][3]
    };
  }

  var leaderboard = [];
  var scData = scoresSheet.getDataRange().getValues();
  for (var j = 1; j < scData.length; j++) {
    var stId = scData[j][0];
    var profile = stuMap[stId] || { publicDisplayName: 'Người học di sản', schoolName: '' };

    leaderboard.push({
      studentId: stId,
      publicDisplayName: profile.publicDisplayName,
      schoolName: profile.schoolName,
      totalScore: Number(scData[j][1]) || 0,
      totalCorrect: Number(scData[j][2]) || 0,
      accuracy: Number(scData[j][4]) || 0,
      activeSeconds: Number(scData[j][5]) || 0
    });
  }

  // Sắp xếp theo quy chuẩn: Tổng điểm DESC, Độ chính xác DESC, Thời gian ASC
  leaderboard.sort(function(a, b) {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
    return a.activeSeconds - b.activeSeconds;
  });

  return leaderboard.slice(0, 50);
}
