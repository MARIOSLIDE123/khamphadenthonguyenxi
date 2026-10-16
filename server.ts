import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { globalStore } from './api/_lib/store';
import { forwardToGoogleAppsScript } from './api/_lib/googleSheetsService';
import { getSanitizedQuestions } from './api/_lib/questions';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '1mb' }));

  // ==========================================
  // BACKEND API ROUTES
  // ==========================================

  // 1. /api/register
  app.post('/api/register', async (req: Request, res: Response) => {
    try {
      const { fullName, schoolName, className } = req.body || {};

      if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
        return res.status(400).json({ success: false, data: null, message: 'Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự).' });
      }

      if (!schoolName || typeof schoolName !== 'string' || schoolName.trim().length < 2) {
        return res.status(400).json({ success: false, data: null, message: 'Vui lòng nhập tên trường học hợp lệ.' });
      }

      if (!className || typeof className !== 'string' || className.trim().length < 1) {
        return res.status(400).json({ success: false, data: null, message: 'Vui lòng nhập lớp học.' });
      }

      if (/[<>{}$]/.test(fullName) || /[<>{}$]/.test(schoolName)) {
        return res.status(400).json({ success: false, data: null, message: 'Thông tin chứa ký tự không hợp lệ.' });
      }

      const { student, session } = globalStore.register(fullName, schoolName, className);

      // Async forward to Google Apps Script
      forwardToGoogleAppsScript('registerStudent', {
        studentId: student.studentId,
        createdAt: student.createdAt,
        fullName: student.fullName,
        schoolName: student.schoolName,
        className: student.className,
        publicDisplayName: student.publicDisplayName,
        sessionId: session.sessionId
      }).catch(() => {});

      return res.status(200).json({
        success: true,
        data: { student, session },
        message: 'Đăng ký thành công! Bắt đầu hành trình khám phá di sản.'
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, data: null, message: error?.message || 'Có lỗi xảy ra.' });
    }
  });

  // 2. /api/heartbeat
  app.post('/api/heartbeat', async (req: Request, res: Response) => {
    try {
      const { sessionId, studentId, seconds = 30 } = req.body || {};
      if (!sessionId || !studentId) {
        return res.status(400).json({ success: false, data: null, message: 'Thiếu thông tin phiên làm việc.' });
      }

      const result = globalStore.heartbeat(sessionId, Number(seconds) || 30);
      if (!result.success) {
        return res.status(404).json({ success: false, data: null, message: 'Phiên học không tồn tại.' });
      }

      forwardToGoogleAppsScript('recordHeartbeat', {
        sessionId,
        studentId,
        activeSeconds: result.activeSeconds,
        timestamp: new Date().toISOString()
      }).catch(() => {});

      return res.status(200).json({ success: true, data: { activeSeconds: result.activeSeconds }, message: 'OK' });
    } catch (error: any) {
      return res.status(500).json({ success: false, data: null, message: error?.message || 'Lỗi heartbeat.' });
    }
  });

  // 3. /api/answer
  app.post('/api/answer', async (req: Request, res: Response) => {
    try {
      const { sessionId, studentId, questionId, attemptNumber, answer, transactionId } = req.body || {};

      if (!sessionId || !studentId || !questionId || !transactionId) {
        return res.status(400).json({ success: false, data: null, message: 'Thiếu dữ liệu nộp câu hỏi.' });
      }

      const result = globalStore.recordAnswer(
        sessionId,
        studentId,
        questionId,
        Number(attemptNumber) || 1,
        answer,
        transactionId
      );

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
          : 'Chưa chính xác sau 2 lần thử. Hãy quan sát lời giải thích nhé.'
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, data: null, message: error?.message || 'Lỗi chấm điểm.' });
    }
  });

  // 4. /api/activity
  app.post('/api/activity', async (req: Request, res: Response) => {
    try {
      const { sessionId, studentId, activityId, activityType, transactionId } = req.body || {};

      if (!sessionId || !studentId || !activityId || !activityType || !transactionId) {
        return res.status(400).json({ success: false, data: null, message: 'Thiếu thông tin hoạt động.' });
      }

      const result = globalStore.recordActivity(sessionId, studentId, activityId, activityType, transactionId);

      forwardToGoogleAppsScript('recordActivity', {
        eventId: transactionId,
        sessionId,
        studentId,
        activityId,
        activityType,
        pointsAwarded: result.pointsAwarded,
        totalScore: result.totalScore,
        createdAt: new Date().toISOString()
      }).catch(() => {});

      return res.status(200).json({ success: true, data: result, message: result.message });
    } catch (error: any) {
      return res.status(500).json({ success: false, data: null, message: error?.message || 'Lỗi ghi nhận hoạt động.' });
    }
  });

  // 5. /api/leaderboard
  app.get('/api/leaderboard', async (req: Request, res: Response) => {
    try {
      const studentId = (req.query?.studentId as string) || '';
      const schoolFilter = (req.query?.school as string) || '';

      let leaderboard = globalStore.getLeaderboard(studentId);

      if (schoolFilter.trim()) {
        const q = schoolFilter.trim().toLowerCase();
        leaderboard = leaderboard.filter((item) => item.schoolName.toLowerCase().includes(q));
      }

      return res.status(200).json({
        success: true,
        data: {
          leaderboard,
          totalLearners: leaderboard.length,
          updatedAt: new Date().toISOString()
        },
        message: 'Tải bảng xếp hạng thành công.'
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, data: null, message: error?.message || 'Lỗi bảng xếp hạng.' });
    }
  });

  // 6. /api/session/end
  app.post('/api/session/end', async (req: Request, res: Response) => {
    try {
      const { sessionId, studentId } = req.body || {};
      if (!sessionId) {
        return res.status(400).json({ success: false, data: null, message: 'Thiếu mã phiên.' });
      }

      const result = globalStore.endSession(sessionId);

      forwardToGoogleAppsScript('endSession', {
        sessionId,
        studentId,
        endedAt: new Date().toISOString(),
        activeSeconds: result.activeSeconds,
        totalScore: result.totalScore
      }).catch(() => {});

      return res.status(200).json({ success: true, data: result, message: 'Phiên học đã kết thúc.' });
    } catch (error: any) {
      return res.status(500).json({ success: false, data: null, message: error?.message || 'Lỗi kết thúc phiên.' });
    }
  });

  // 7. /api/questions (Sanitized)
  app.get('/api/questions', (_req: Request, res: Response) => {
    const questions = getSanitizedQuestions();
    return res.status(200).json({ success: true, data: { questions, total: questions.length }, message: 'OK' });
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Đền thờ Nguyễn Xí đang chạy tại: http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Không thể khởi động máy chủ:', err);
  process.exit(1);
});
