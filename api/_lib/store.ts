import { LearnerProfile, SessionState, LeaderboardItem, ClientQuestion } from '../../src/types';
import { verifyAnswer, getSanitizedQuestions } from './questions';

export interface ProcessedTransaction {
  transactionId: string;
  studentId: string;
  sessionId: string;
  type: string;
  timestamp: string;
  result: any;
}

export interface QuestionAttemptRecord {
  questionId: string;
  attemptsCount: number;
  isSolved: boolean;
  pointsEarned: number;
  lastAttemptAt: string;
}

class MemoryStore {
  public students: Map<string, LearnerProfile> = new Map();
  public sessions: Map<string, SessionState & { attempts: Map<string, QuestionAttemptRecord> }> = new Map();
  public transactions: Map<string, ProcessedTransaction> = new Map();

  constructor() {
    // Only real registered students from live learning sessions
  }

  private seedInitialBenchmark() {
    // Kept empty to display only genuine participating students
  }

  // Create safe display name from full name & school
  createPublicDisplayName(fullName: string, schoolName: string): string {
    const parts = fullName.trim().split(/\s+/);
    let abbreviated = fullName;
    if (parts.length >= 2) {
      const ho = parts[0];
      const ten = parts[parts.length - 1];
      const lot = parts.slice(1, -1).map((p) => p[0].toUpperCase() + '.').join(' ');
      abbreviated = lot ? `${ho} ${lot} ${ten}` : `${ho} ${ten}`;
    }
    const shortSchool = schoolName.replace(/Trường Tiểu học/i, 'TH').replace(/Trường TH/i, 'TH');
    return `${abbreviated} (${shortSchool})`;
  }

  // Register learner
  register(fullName: string, schoolName: string, className: string): { student: LearnerProfile; session: SessionState } {
    const cleanFull = fullName.trim();
    const cleanSchool = schoolName.trim();
    const cleanClass = className.trim();

    const studentId = `STU_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const sessionId = `SES_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const publicDisplayName = this.createPublicDisplayName(cleanFull, cleanSchool);

    const student: LearnerProfile = {
      studentId,
      fullName: cleanFull,
      schoolName: cleanSchool,
      className: cleanClass,
      publicDisplayName,
      createdAt: now
    };

    const session: SessionState & { attempts: Map<string, QuestionAttemptRecord> } = {
      sessionId,
      studentId,
      startedAt: now,
      lastSeenAt: now,
      activeSeconds: 0,
      completedModules: [],
      totalScore: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      attempts: new Map()
    };

    this.students.set(studentId, student);
    this.sessions.set(sessionId, session);

    return { student, session };
  }

  // Heartbeat record
  heartbeat(sessionId: string, additionalSeconds: number = 30): { success: boolean; activeSeconds: number } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, activeSeconds: 0 };
    }

    // Guard reasonable heartbeat increments (max 60 seconds per ping)
    const validSec = Math.min(Math.max(additionalSeconds, 0), 60);
    session.activeSeconds += validSec;
    session.lastSeenAt = new Date().toISOString();

    return { success: true, activeSeconds: session.activeSeconds };
  }

  // Record Answer Attempt
  recordAnswer(
    sessionId: string,
    studentId: string,
    questionId: string,
    attemptNumber: number,
    userAnswer: any,
    transactionId: string
  ): {
    isCorrect: boolean;
    pointsAwarded: number;
    attemptNumber: number;
    explanation: string;
    correctAnswer?: any;
    currentScore: number;
    totalCorrect: number;
    accuracy: number;
  } {
    // Check transaction deduplication
    if (this.transactions.has(transactionId)) {
      return this.transactions.get(transactionId)!.result;
    }

    const session = this.sessions.get(sessionId);
    if (!session || session.studentId !== studentId) {
      throw new Error('Phiên học không hợp lệ hoặc đã hết hạn.');
    }

    let attemptRecord = session.attempts.get(questionId);
    if (!attemptRecord) {
      attemptRecord = {
        questionId,
        attemptsCount: 0,
        isSolved: false,
        pointsEarned: 0,
        lastAttemptAt: new Date().toISOString()
      };
      session.attempts.set(questionId, attemptRecord);
    }

    // Verify if already solved or max attempts exceeded
    if (attemptRecord.isSolved) {
      const verification = verifyAnswer(questionId, userAnswer, 1);
      return {
        isCorrect: true,
        pointsAwarded: 0,
        attemptNumber: attemptRecord.attemptsCount,
        explanation: verification.explanation,
        correctAnswer: verification.correctAnswer,
        currentScore: session.totalScore,
        totalCorrect: session.totalCorrect,
        accuracy: session.totalQuestions > 0 ? Math.round((session.totalCorrect / session.totalQuestions) * 100) : 0
      };
    }

    attemptRecord.attemptsCount += 1;
    attemptRecord.lastAttemptAt = new Date().toISOString();

    // Verify on server
    const verification = verifyAnswer(questionId, userAnswer, attemptRecord.attemptsCount);

    let pointsAwarded = 0;
    if (verification.isCorrect) {
      attemptRecord.isSolved = true;
      if (attemptRecord.attemptsCount === 1) {
        pointsAwarded = 10;
      } else if (attemptRecord.attemptsCount === 2) {
        pointsAwarded = 5;
      }
      attemptRecord.pointsEarned = pointsAwarded;
      session.totalScore += pointsAwarded;
      session.totalCorrect += 1;
      session.totalQuestions += 1;
    } else {
      if (attemptRecord.attemptsCount >= 2) {
        // failed both
        session.totalQuestions += 1;
      }
    }

    const accuracy = session.totalQuestions > 0 ? Math.round((session.totalCorrect / session.totalQuestions) * 100) : 0;

    const result = {
      isCorrect: verification.isCorrect,
      pointsAwarded,
      attemptNumber: attemptRecord.attemptsCount,
      explanation: verification.explanation,
      correctAnswer: verification.correctAnswer,
      currentScore: session.totalScore,
      totalCorrect: session.totalCorrect,
      accuracy
    };

    // Store transaction for idempotency
    this.transactions.set(transactionId, {
      transactionId,
      studentId,
      sessionId,
      type: 'ANSWER_ATTEMPT',
      timestamp: new Date().toISOString(),
      result
    });

    return result;
  }

  // Record Activity (topic complete, 360 tour, arena round)
  recordActivity(
    sessionId: string,
    studentId: string,
    activityId: string,
    activityType: 'TOPIC_COMPLETE' | 'TOUR_360_COMPLETE' | 'ARENA_ROUND_COMPLETE' | 'ARENA_COMPLETE',
    transactionId: string
  ): {
    success: boolean;
    pointsAwarded: number;
    totalScore: number;
    completedModules: string[];
    message: string;
  } {
    if (this.transactions.has(transactionId)) {
      return this.transactions.get(transactionId)!.result;
    }

    const session = this.sessions.get(sessionId);
    if (!session || session.studentId !== studentId) {
      throw new Error('Phiên học không tồn tại.');
    }

    let pointsAwarded = 0;
    let message = 'Hoạt động đã được ghi nhận.';

    const alreadyDone = session.completedModules.includes(activityId);

    if (!alreadyDone) {
      if (activityType === 'TOPIC_COMPLETE') {
        pointsAwarded = 2; // +2 points per topic as per specifications
        message = 'Hoàn thành chủ đề tìm hiểu! (+2 điểm)';
      } else if (activityType === 'TOUR_360_COMPLETE') {
        pointsAwarded = 3; // +3 points for 360 tour
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
    } else {
      message = 'Hoạt động này đã được ghi nhận điểm trước đó.';
    }

    const result = {
      success: true,
      pointsAwarded,
      totalScore: session.totalScore,
      completedModules: session.completedModules,
      message
    };

    this.transactions.set(transactionId, {
      transactionId,
      studentId,
      sessionId,
      type: activityType,
      timestamp: new Date().toISOString(),
      result
    });

    return result;
  }

  // End session
  endSession(sessionId: string): { success: boolean; activeSeconds: number; totalScore: number } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, activeSeconds: 0, totalScore: 0 };
    }
    session.lastSeenAt = new Date().toISOString();
    return {
      success: true,
      activeSeconds: session.activeSeconds,
      totalScore: session.totalScore
    };
  }

  // Get Leaderboard
  getLeaderboard(currentStudentId?: string): LeaderboardItem[] {
    const items: LeaderboardItem[] = [];

    // Map each student to their highest/aggregated scores across sessions
    this.students.forEach((student, studentId) => {
      // Find sessions for this student
      let totalScore = 0;
      let totalCorrect = 0;
      let totalQuestions = 0;
      let activeSeconds = 0;
      let badgeCount = 0;

      for (const [, s] of this.sessions) {
        if (s.studentId === studentId) {
          totalScore += s.totalScore;
          totalCorrect += s.totalCorrect;
          totalQuestions += s.totalQuestions;
          activeSeconds += s.activeSeconds;
          badgeCount = Math.max(badgeCount, s.completedModules.length);
        }
      }

      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      items.push({
        studentId,
        publicDisplayName: student.publicDisplayName,
        schoolName: student.schoolName,
        totalScore,
        totalCorrect,
        totalQuestions,
        accuracy,
        activeSeconds,
        badgeCount,
        isCurrent: currentStudentId === studentId
      });
    });

    // Sort according to prompt rules:
    // 1. Total score DESC
    // 2. Accuracy DESC
    // 3. Questions completed DESC
    // 4. Active seconds ASC
    items.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      if (b.accuracy !== a.accuracy) {
        return b.accuracy - a.accuracy;
      }
      if (b.totalCorrect !== a.totalCorrect) {
        return b.totalCorrect - a.totalCorrect;
      }
      return a.activeSeconds - b.activeSeconds;
    });

    // Assign 1-indexed ranks
    return items.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
  }
}

export const globalStore = new MemoryStore();
export { getSanitizedQuestions };
