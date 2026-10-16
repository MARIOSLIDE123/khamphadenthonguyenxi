import {
  LearnerProfile,
  SessionState,
  AnswerPayload,
  AnswerResult,
  ActivityPayload,
  ActivityResult,
  LeaderboardItem
} from '../types';
import {
  localRegister,
  localSubmitAnswer,
  localRecordActivity,
  localGetLeaderboard,
  localHeartbeat,
  localEndSession
} from './localStore';

export function generateTransactionId(prefix: string = 'TXN'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

async function request<T>(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 4000
): Promise<{ success: boolean; data: T; message: string }> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(body?.message || `Lỗi kết nối máy chủ (Mã: ${res.status})`);
    }

    return body;
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export const apiClient = {
  // 1. Register with instant local fallback
  async register(
    fullName: string,
    schoolName: string,
    className: string
  ): Promise<{ student: LearnerProfile; session: SessionState }> {
    try {
      const res = await request<{ student: LearnerProfile; session: SessionState }>('/api/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, schoolName, className })
      });
      if (res && res.data && res.data.student && res.data.session) {
        return res.data;
      }
    } catch (err: any) {
      console.warn('[Hệ thống di sản] Máy chủ phản hồi chậm hoặc đang bảo trì, chuyển sang chế độ lưu trữ cục bộ:', err.message);
    }

    // Seamless resilient local fallback: always succeeds so student is NEVER blocked!
    return localRegister(fullName, schoolName, className);
  },

  // 2. Heartbeat with local fallback
  async heartbeat(sessionId: string, studentId: string, seconds: number = 30): Promise<{ activeSeconds: number }> {
    try {
      const res = await request<{ activeSeconds: number }>('/api/heartbeat', {
        method: 'POST',
        body: JSON.stringify({ sessionId, studentId, seconds })
      }, 3000);
      if (res && res.data) {
        return res.data;
      }
    } catch {}

    return localHeartbeat(sessionId, studentId, seconds);
  },

  // 3. Submit Answer with local fallback
  async submitAnswer(payload: AnswerPayload): Promise<AnswerResult> {
    try {
      const res = await request<AnswerResult>('/api/answer', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res && res.data) {
        return res.data;
      }
    } catch (err: any) {
      console.warn('[Hệ thống di sản] Chấm điểm qua chế độ ngoại tuyến chuẩn xác:', err.message);
    }

    return localSubmitAnswer(
      payload.sessionId,
      payload.studentId,
      payload.questionId,
      payload.attemptNumber,
      payload.answer,
      payload.transactionId
    );
  },

  // 4. Record Activity with local fallback
  async recordActivity(payload: ActivityPayload): Promise<ActivityResult> {
    try {
      const res = await request<ActivityResult>('/api/activity', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res && res.data) {
        return res.data;
      }
    } catch {}

    return localRecordActivity(
      payload.sessionId,
      payload.studentId,
      payload.activityId,
      payload.activityType,
      payload.transactionId
    );
  },

  // 5. Get Leaderboard with local fallback
  async getLeaderboard(
    studentId?: string,
    school?: string
  ): Promise<{ leaderboard: LeaderboardItem[]; totalLearners: number }> {
    try {
      const query = new URLSearchParams();
      if (studentId) query.set('studentId', studentId);
      if (school) query.set('school', school);

      const res = await request<{ leaderboard: LeaderboardItem[]; totalLearners: number }>(
        `/api/leaderboard?${query.toString()}`
      );
      if (res && res.data && Array.isArray(res.data.leaderboard)) {
        return res.data;
      }
    } catch {}

    return localGetLeaderboard(studentId, school);
  },

  // 6. End Session with local fallback
  async endSession(sessionId: string, studentId: string): Promise<{ activeSeconds: number; totalScore: number }> {
    try {
      const res = await request<{ activeSeconds: number; totalScore: number }>('/api/session/end', {
        method: 'POST',
        body: JSON.stringify({ sessionId, studentId })
      });
      if (res && res.data) {
        return res.data;
      }
    } catch {}

    return localEndSession(sessionId, studentId);
  }
};
