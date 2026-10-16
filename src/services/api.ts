import {
  LearnerProfile,
  SessionState,
  AnswerPayload,
  AnswerResult,
  ActivityPayload,
  ActivityResult,
  LeaderboardItem
} from '../types';

export function generateTransactionId(prefix: string = 'TXN'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<{ success: boolean; data: T; message: string }> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(body?.message || `Lỗi kết nối máy chủ (Mã: ${res.status})`);
    }

    return body;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Yêu cầu bị quá hạn thời gian xử lý. Vui lòng thử lại.');
    }
    throw new Error(err.message || 'Mất kết nối với máy chủ. Vui lòng kiểm tra đường truyền.');
  }
}

export const apiClient = {
  // 1. Register
  async register(fullName: string, schoolName: string, className: string): Promise<{ student: LearnerProfile; session: SessionState }> {
    const res = await request<{ student: LearnerProfile; session: SessionState }>('/api/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, schoolName, className })
    });
    return res.data;
  },

  // 2. Heartbeat
  async heartbeat(sessionId: string, studentId: string, seconds: number = 30): Promise<{ activeSeconds: number }> {
    const res = await request<{ activeSeconds: number }>('/api/heartbeat', {
      method: 'POST',
      body: JSON.stringify({ sessionId, studentId, seconds })
    });
    return res.data;
  },

  // 3. Submit Answer
  async submitAnswer(payload: AnswerPayload): Promise<AnswerResult> {
    const res = await request<AnswerResult>('/api/answer', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  },

  // 4. Record Activity
  async recordActivity(payload: ActivityPayload): Promise<ActivityResult> {
    const res = await request<ActivityResult>('/api/activity', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  },

  // 5. Get Leaderboard
  async getLeaderboard(studentId?: string, school?: string): Promise<{ leaderboard: LeaderboardItem[]; totalLearners: number }> {
    const query = new URLSearchParams();
    if (studentId) query.set('studentId', studentId);
    if (school) query.set('school', school);

    const res = await request<{ leaderboard: LeaderboardItem[]; totalLearners: number }>(`/api/leaderboard?${query.toString()}`);
    return res.data;
  },

  // 6. End Session
  async endSession(sessionId: string, studentId: string): Promise<{ activeSeconds: number; totalScore: number }> {
    const res = await request<{ activeSeconds: number; totalScore: number }>('/api/session/end', {
      method: 'POST',
      body: JSON.stringify({ sessionId, studentId })
    });
    return res.data;
  }
};
