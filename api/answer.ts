import { globalStore } from './_lib/store';
import { forwardToGoogleAppsScript } from './_lib/googleSheetsService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, data: null, message: 'Chỉ chấp nhận phương thức POST.' });
  }

  try {
    const { sessionId, studentId, questionId, attemptNumber, answer, transactionId } = req.body || {};

    if (!sessionId || !studentId || !questionId || !transactionId) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Dữ liệu nộp bài không đầy đủ (thiếu mã phiên, mã câu hỏi hoặc mã giao dịch).'
      });
    }

    const result = globalStore.recordAnswer(
      sessionId,
      studentId,
      questionId,
      Number(attemptNumber) || 1,
      answer,
      transactionId
    );

    // Forward to Google Apps Script Sheet 3 (Attempts) and Sheet 5 (Scores)
    forwardToGoogleAppsScript('recordAnswerAttempt', {
      attemptId: transactionId,
      sessionId,
      studentId,
      questionId,
      submittedAnswer: typeof answer === 'object' ? JSON.stringify(answer) : String(answer),
      isCorrect: result.isCorrect,
      attemptNumber: result.attemptNumber,
      pointsAwarded: result.pointsAwarded,
      currentScore: result.currentScore,
      totalCorrect: result.totalCorrect,
      accuracy: result.accuracy,
      createdAt: new Date().toISOString()
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      data: result,
      message: result.isCorrect
        ? `Tuyệt vời! Bạn nhận được +${result.pointsAwarded} điểm.`
        : result.attemptNumber === 1
        ? 'Chưa chính xác. Bạn còn 1 cơ hội thử lại!'
        : 'Rất tiếc chưa đúng. Hãy quan sát đáp án chuẩn và lời giải thích nhé.'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error?.message || 'Có lỗi xảy ra khi chấm điểm câu hỏi.'
    });
  }
}
