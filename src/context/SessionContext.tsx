import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { LearnerProfile, SessionState, Badge } from '../types';
import { apiClient, generateTransactionId } from '../services/api';
import { BADGES_LIST } from '../data/arena';
import { soundEffects } from '../services/soundEffects';

interface SessionContextType {
  learner: LearnerProfile | null;
  session: SessionState | null;
  isLoading: boolean;
  isRegistered: boolean;
  soundEnabled: boolean;
  toggleSound: () => void;
  registerLearner: (fullName: string, schoolName: string, className: string) => Promise<void>;
  switchLearner: () => void;
  recordTopicCompleted: (topicId: string) => Promise<void>;
  recordTour360Completed: () => Promise<void>;
  recordArenaRoundCompleted: (roundNumber: number) => Promise<void>;
  recordArenaCompleted: () => Promise<void>;
  updateScoreFromAnswer: (pointsAwarded: number, isCorrect: boolean, newTotalScore: number, newTotalCorrect: number) => void;
  earnedBadges: Badge[];
  activeSeconds: number;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [learner, setLearner] = useState<LearnerProfile | null>(() => {
    try {
      const saved = localStorage.getItem('nguyen_xi_learner');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [session, setSession] = useState<SessionState | null>(() => {
    try {
      const saved = localStorage.getItem('nguyen_xi_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundEffects.isEnabled());
  const [activeSeconds, setActiveSeconds] = useState<number>(session?.activeSeconds || 0);

  // Sync state with local storage
  useEffect(() => {
    if (learner) {
      localStorage.setItem('nguyen_xi_learner', JSON.stringify(learner));
    } else {
      localStorage.removeItem('nguyen_xi_learner');
    }
  }, [learner]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('nguyen_xi_session', JSON.stringify(session));
      setActiveSeconds(session.activeSeconds);
    } else {
      localStorage.removeItem('nguyen_xi_session');
    }
  }, [session]);

  const toggleSound = () => {
    const next = soundEffects.toggleSound();
    setSoundEnabled(next);
  };

  // Heartbeat tracking: only count time when tab is visible and learner is active
  const lastActiveRef = useRef<number>(Date.now());
  const isTabVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    const handleVisibility = () => {
      isTabVisibleRef.current = !document.hidden;
      if (!document.hidden) {
        lastActiveRef.current = Date.now();
      }
    };

    const handleUserActivity = () => {
      lastActiveRef.current = Date.now();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, []);

  // Interval timer for local active seconds & periodic server heartbeat (every 30 seconds)
  useEffect(() => {
    if (!session || !learner) return;

    const timer = setInterval(() => {
      // If tab is visible and user was active in last 60 seconds
      const isIdle = Date.now() - lastActiveRef.current > 60000;
      if (isTabVisibleRef.current && !isIdle) {
        setActiveSeconds((prev) => prev + 1);
      }
    }, 1000);

    const heartbeatInterval = setInterval(async () => {
      const isIdle = Date.now() - lastActiveRef.current > 60000;
      if (isTabVisibleRef.current && !isIdle && session && learner) {
        try {
          const res = await apiClient.heartbeat(session.sessionId, learner.studentId, 30);
          setSession((prev) => (prev ? { ...prev, activeSeconds: res.activeSeconds } : null));
        } catch {
          // Gracefully ignore temporary network hiccups during heartbeat
        }
      }
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(heartbeatInterval);
    };
  }, [session?.sessionId, learner?.studentId]);

  // Register learner
  const registerLearner = async (fullName: string, schoolName: string, className: string) => {
    setIsLoading(true);
    try {
      const data = await apiClient.register(fullName, schoolName, className);
      setLearner(data.student);
      setSession(data.session);
      setActiveSeconds(data.session.activeSeconds);
      soundEffects.playCorrect();
    } finally {
      setIsLoading(false);
    }
  };

  // Switch learner (reset for shared device)
  const switchLearner = useCallback(async () => {
    if (session && learner) {
      try {
        await apiClient.endSession(session.sessionId, learner.studentId);
      } catch {}
    }
    setLearner(null);
    setSession(null);
    setActiveSeconds(0);
    localStorage.removeItem('nguyen_xi_learner');
    localStorage.removeItem('nguyen_xi_session');
  }, [session, learner]);

  // Record Activity helper
  const recordActivityGeneric = async (activityId: string, activityType: any) => {
    if (!session || !learner) return;
    try {
      const txn = generateTransactionId('ACT');
      const res = await apiClient.recordActivity({
        activityId,
        activityType,
        sessionId: session.sessionId,
        studentId: learner.studentId,
        transactionId: txn
      });

      if (res.success) {
        setSession((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            totalScore: res.totalScore,
            completedModules: res.completedModules
          };
        });
      }
    } catch (err: any) {
      console.warn('Ghi nhận hoạt động không thành công:', err.message);
    }
  };

  const recordTopicCompleted = async (topicId: string) => {
    await recordActivityGeneric(topicId, 'TOPIC_COMPLETE');
  };

  const recordTour360Completed = async () => {
    await recordActivityGeneric('tour-360', 'TOUR_360_COMPLETE');
  };

  const recordArenaRoundCompleted = async (roundNumber: number) => {
    await recordActivityGeneric(`arena-round-${roundNumber}`, 'ARENA_ROUND_COMPLETE');
  };

  const recordArenaCompleted = async () => {
    await recordActivityGeneric('arena-champion', 'ARENA_COMPLETE');
  };

  const updateScoreFromAnswer = (
    _pointsAwarded: number,
    _isCorrect: boolean,
    newTotalScore: number,
    newTotalCorrect: number
  ) => {
    setSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        totalScore: newTotalScore,
        totalCorrect: newTotalCorrect,
        totalQuestions: prev.totalQuestions + 1
      };
    });
  };

  // Calculate earned badges based on progress
  const completedMods = session?.completedModules || [];
  const earnedBadges = BADGES_LIST.filter((badge) => {
    if (badge.id === 'badge-nhap-mon') return true;
    if (badge.id === 'badge-tour-360') return completedMods.includes('tour-360');
    if (badge.id === 'badge-hoc-gia') {
      const topicCount = completedMods.filter((m) => m.startsWith('topic-')).length;
      return topicCount >= 7;
    }
    if (badge.id === 'badge-khoi-dong') return completedMods.includes('arena-round-1');
    if (badge.id === 'badge-kham-pha') return completedMods.includes('arena-round-2');
    if (badge.id === 'badge-giai-ma') return completedMods.includes('arena-round-3');
    if (badge.id === 'badge-thu-thach') return completedMods.includes('arena-round-4');
    if (badge.id === 'badge-chinh-phuc') return completedMods.includes('arena-champion');
    if (badge.id === 'badge-chuyen-can') return activeSeconds >= 900; // 15 mins
    return false;
  });

  return (
    <SessionContext.Provider
      value={{
        learner,
        session,
        isLoading,
        isRegistered: !!learner && !!session,
        soundEnabled,
        toggleSound,
        registerLearner,
        switchLearner,
        recordTopicCompleted,
        recordTour360Completed,
        recordArenaRoundCompleted,
        recordArenaCompleted,
        updateScoreFromAnswer,
        earnedBadges,
        activeSeconds
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return ctx;
};
