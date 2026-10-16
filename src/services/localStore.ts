import {
  LearnerProfile,
  SessionState,
  LeaderboardItem,
  AnswerResult,
  ActivityResult
} from '../types';
import { SERVER_QUESTIONS, verifyAnswer } from '../data/questionsData';

const LEARNER_KEY = 'nguyen_xi_learner';
const SESSION_KEY = 'nguyen_xi_session';
const TRANSACTIONS_KEY = 'nguyen_xi_txns';
const ATTEMPTS_KEY = 'nguyen_xi_attempts';

const SAMPLE_BENCHMARKS: LeaderboardItem[] = [
  {
    studentId: 'STU_XN001',
    publicDisplayName: 'Nguyễn Đ. Khải (TH Nghi Hợp)',
    schoolName: 'Trường Tiểu học Nghi Hợp',
    totalScore: 135,
    totalCorrect: 14,
    totalQuestions: 15,
    accuracy: 93,
    activeSeconds: 1420,
    badgeCount: 5,
    rank: 1,
    isCurrent: false
  },
  {
    studentId: 'STU_XN002',
    publicDisplayName: 'Trần M. Phương (TH Nguyễn Xí)',
    schoolName: 'Trường Tiểu học Nguyễn Xí',
    totalScore: 125,
    totalCorrect: 13,
    totalQuestions: 15,
    accuracy: 87,
    activeSeconds: 1650,
    badgeCount: 4,
    rank: 2,
    isCurrent: false
  },
  {
    studentId: 'STU_XN003',
    publicDisplayName: 'Lê H. Nam (TH Đông Lộc)',
    schoolName: 'Trường Tiểu học Đông Lộc',
    totalScore: 110,
    totalCorrect: 12,
    totalQuestions: 15,
    accuracy: 80,
    activeSeconds: 1890,
    badgeCount: 4,
    rank: 3,
    isCurrent: false
  }
];

export function createPublicDisplayName(fullName: string, schoolName: string): string {
  const parts = fullName.trim().split(/\s+/);
  let abbreviated = fullName;
  if (parts.length >= 2) {
    const ho = parts[0];
    const ten = parts[parts.length - 1];
    const lot = parts.slice(1, -1).map((p) => p[0].toUpperCase() + '.').join(' ');
    abbreviated = lot ? `${ho} ${lot} ${ten}` : `${ho} ${ten}`;
  }
  const shortSchool = schoolName
    .replace(/Trường Tiểu học/i, 'TH')
    .replace(/Trường TH/i, 'TH')
    .replace(/Tiểu học/i, 'TH');
  return `${abbreviated} (${shortSchool})`;
}

export function localRegister(
  fullName: string,
  schoolName: string,
  className: string
): { student: LearnerProfile; session: SessionState } {
  const cleanFull = fullName.trim();
  const cleanSchool = schoolName.trim();
  const cleanClass = className.trim();

  const studentId = `STU_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const sessionId = `SES_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const publicDisplayName = createPublicDisplayName(cleanFull, cleanSchool);

  const student: LearnerProfile = {
    studentId,
    fullName: cleanFull,
    schoolName: cleanSchool,
    className: cleanClass,
    publicDisplayName,
    createdAt: now
  };

  const session: SessionState = {
    sessionId,
    studentId,
    startedAt: now,
    lastSeenAt: now,
    activeSeconds: 0,
    completedModules: [],
    totalScore: 0,
    totalCorrect: 0,
    totalQuestions: 0
  };

  try {
    localStorage.setItem(LEARNER_KEY, JSON.stringify(student));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}

  return { student, session };
}

export function localSubmitAnswer(
  sessionId: string,
  studentId: string,
  questionId: string,
  attemptNumber: number,
  userAnswer: any,
  transactionId: string
): AnswerResult {
  // Idempotency check
  try {
    const rawTxns = localStorage.getItem(TRANSACTIONS_KEY);
    const txns: Record<string, any> = rawTxns ? JSON.parse(rawTxns) : {};
    if (txns[transactionId]) {
      return txns[transactionId];
    }
  } catch {}

  let session: SessionState;
  try {
    const rawSession = localStorage.getItem(SESSION_KEY);
    session = rawSession
      ? JSON.parse(rawSession)
      : {
          sessionId,
          studentId,
          startedAt: new Date().toISOString(),
          lastSeenAt: new Date().toISOString(),
          activeSeconds: 0,
          completedModules: [],
          totalScore: 0,
          totalCorrect: 0,
          totalQuestions: 0
        };
  } catch {
    session = {
      sessionId,
      studentId,
      startedAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      activeSeconds: 0,
      completedModules: [],
      totalScore: 0,
      totalCorrect: 0,
      totalQuestions: 0
    };
  }

  // Attempts tracker
  let attemptsMap: Record<string, { attemptsCount: number; isSolved: boolean }> = {};
  try {
    const rawAttempts = localStorage.getItem(ATTEMPTS_KEY);
    if (rawAttempts) attemptsMap = JSON.parse(rawAttempts);
  } catch {}

  const currentAttempt = attemptsMap[questionId] || { attemptsCount: 0, isSolved: false };

  if (currentAttempt.isSolved) {
    const q = SERVER_QUESTIONS.find((item) => item.id === questionId);
    return {
      isCorrect: true,
      pointsAwarded: 0,
      attemptNumber: currentAttempt.attemptsCount,
      explanation: q?.explanation || 'Bạn đã hoàn thành câu hỏi này.',
      correctAnswer: q?.correctAnswer,
      currentScore: session.totalScore,
      totalCorrect: session.totalCorrect,
      accuracy: session.totalQuestions > 0 ? Math.round((session.totalCorrect / session.totalQuestions) * 100) : 0
    };
  }

  currentAttempt.attemptsCount += 1;
  const verification = verifyAnswer(questionId, userAnswer, currentAttempt.attemptsCount);

  let pointsAwarded = 0;
  if (verification.isCorrect) {
    currentAttempt.isSolved = true;
    pointsAwarded = currentAttempt.attemptsCount === 1 ? 10 : 5;
    session.totalScore += pointsAwarded;
    session.totalCorrect += 1;
    session.totalQuestions += 1;
  } else {
    if (currentAttempt.attemptsCount >= 2) {
      session.totalQuestions += 1;
    }
  }

  attemptsMap[questionId] = currentAttempt;
  try {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attemptsMap));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}

  const accuracy = session.totalQuestions > 0 ? Math.round((session.totalCorrect / session.totalQuestions) * 100) : 0;

  const result: AnswerResult = {
    isCorrect: verification.isCorrect,
    pointsAwarded,
    attemptNumber: currentAttempt.attemptsCount,
    explanation: verification.explanation,
    correctAnswer: verification.correctAnswer,
    currentScore: session.totalScore,
    totalCorrect: session.totalCorrect,
    accuracy
  };

  try {
    const rawTxns = localStorage.getItem(TRANSACTIONS_KEY);
    const txns: Record<string, any> = rawTxns ? JSON.parse(rawTxns) : {};
    txns[transactionId] = result;
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txns));
  } catch {}

  return result;
}

export function localRecordActivity(
  sessionId: string,
  studentId: string,
  activityId: string,
  activityType: 'TOPIC_COMPLETE' | 'TOUR_360_COMPLETE' | 'ARENA_ROUND_COMPLETE' | 'ARENA_COMPLETE',
  transactionId: string
): ActivityResult {
  // Idempotency check
  try {
    const rawTxns = localStorage.getItem(TRANSACTIONS_KEY);
    const txns: Record<string, any> = rawTxns ? JSON.parse(rawTxns) : {};
    if (txns[transactionId]) {
      return txns[transactionId];
    }
  } catch {}

  let session: SessionState;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    session = raw ? JSON.parse(raw) : {
      sessionId,
      studentId,
      startedAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      activeSeconds: 0,
      completedModules: [],
      totalScore: 0,
      totalCorrect: 0,
      totalQuestions: 0
    };
  } catch {
    session = {
      sessionId,
      studentId,
      startedAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      activeSeconds: 0,
      completedModules: [],
      totalScore: 0,
      totalCorrect: 0,
      totalQuestions: 0
    };
  }

  let pointsAwarded = 0;
  let message = 'Hoạt động đã được ghi nhận.';
  const alreadyDone = session.completedModules.includes(activityId);

  if (!alreadyDone) {
    if (activityType === 'TOPIC_COMPLETE') {
      pointsAwarded = 2;
      message = 'Hoàn thành chủ đề tìm hiểu! (+2 điểm)';
    } else if (activityType === 'TOUR_360_COMPLETE') {
      pointsAwarded = 3;
      message = 'Hoàn thành nhiệm vụ tham quan 360°! (+3 điểm)';
    } else if (activityType === 'ARENA_ROUND_COMPLETE') {
      pointsAwarded = 5;
      message = 'Vượt qua vòng thi Đấu trường! (+5 điểm)';
    } else if (activityType === 'ARENA_COMPLETE') {
      pointsAwarded = 10;
      message = 'Xuất sắc hoàn thành toàn bộ Đấu trường trí tuệ! (+10 điểm)';
    }

    session.completedModules.push(activityId);
    session.totalScore += pointsAwarded;

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {}
  } else {
    message = 'Hoạt động này đã được ghi nhận điểm trước đó.';
  }

  const result: ActivityResult = {
    success: true,
    pointsAwarded,
    totalScore: session.totalScore,
    completedModules: session.completedModules,
    message
  };

  try {
    const rawTxns = localStorage.getItem(TRANSACTIONS_KEY);
    const txns: Record<string, any> = rawTxns ? JSON.parse(rawTxns) : {};
    txns[transactionId] = result;
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txns));
  } catch {}

  return result;
}

export function localGetLeaderboard(
  currentStudentId?: string,
  schoolFilter?: string
): { leaderboard: LeaderboardItem[]; totalLearners: number } {
  let list = [...SAMPLE_BENCHMARKS];

  try {
    const rawLearner = localStorage.getItem(LEARNER_KEY);
    const rawSession = localStorage.getItem(SESSION_KEY);
    if (rawLearner && rawSession) {
      const learner: LearnerProfile = JSON.parse(rawLearner);
      const session: SessionState = JSON.parse(rawSession);

      const existingIdx = list.findIndex((b) => b.studentId === learner.studentId);
      const accuracy = session.totalQuestions > 0 ? Math.round((session.totalCorrect / session.totalQuestions) * 100) : 0;
      const currentItem: LeaderboardItem = {
        studentId: learner.studentId,
        publicDisplayName: learner.publicDisplayName,
        schoolName: learner.schoolName,
        totalScore: session.totalScore,
        totalCorrect: session.totalCorrect,
        totalQuestions: session.totalQuestions,
        accuracy,
        activeSeconds: session.activeSeconds,
        badgeCount: Math.max(1, session.completedModules.length),
        isCurrent: true
      };

      if (existingIdx >= 0) {
        list[existingIdx] = currentItem;
      } else {
        list.push(currentItem);
      }
    }
  } catch {}

  if (schoolFilter && schoolFilter.trim()) {
    const q = schoolFilter.trim().toLowerCase();
    list = list.filter((i) => i.schoolName.toLowerCase().includes(q));
  }

  // Sort: totalScore DESC, accuracy DESC, totalCorrect DESC, activeSeconds ASC
  list.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
    if (b.totalCorrect !== a.totalCorrect) return b.totalCorrect - a.totalCorrect;
    return a.activeSeconds - b.activeSeconds;
  });

  const ranked = list.map((item, idx) => ({
    ...item,
    rank: idx + 1,
    isCurrent: item.studentId === currentStudentId
  }));

  return {
    leaderboard: ranked,
    totalLearners: ranked.length
  };
}

export function localHeartbeat(sessionId: string, studentId: string, seconds: number = 30): { activeSeconds: number } {
  try {
    const rawSession = localStorage.getItem(SESSION_KEY);
    if (rawSession) {
      const session: SessionState = JSON.parse(rawSession);
      session.activeSeconds = (session.activeSeconds || 0) + seconds;
      session.lastSeenAt = new Date().toISOString();
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { activeSeconds: session.activeSeconds };
    }
  } catch {}
  return { activeSeconds: 0 };
}

export function localEndSession(sessionId: string, studentId: string): { activeSeconds: number; totalScore: number } {
  try {
    const rawSession = localStorage.getItem(SESSION_KEY);
    if (rawSession) {
      const session: SessionState = JSON.parse(rawSession);
      session.lastSeenAt = new Date().toISOString();
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { activeSeconds: session.activeSeconds, totalScore: session.totalScore };
    }
  } catch {}
  return { activeSeconds: 0, totalScore: 0 };
}
