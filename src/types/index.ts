export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'drag_sort'
  | 'fill_blank'
  | 'drag_sentence'
  | 'matching';

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface ClientQuestion {
  id: string;
  type: QuestionType;
  topicId: string;
  topicTitle: string;
  title: string;
  instruction: string;
  hint: string;
  options?: string[]; // for single_choice, multiple_choice, drag_sort
  sentenceTemplate?: string; // for drag_sentence e.g. "Năm {blank1}, vua {blank2} ra chiếu chỉ dựng đền."
  wordBank?: string[]; // for drag_sentence
  matchingPairs?: { left: { id: string; text: string }[]; right: { id: string; text: string }[] }; // for matching
  fillPrompt?: string; // for fill_blank
  blankCount?: number;
}

export interface AnswerPayload {
  questionId: string;
  sessionId: string;
  studentId: string;
  attemptNumber: number;
  answer: any; // string | string[] | Record<string, string>
  transactionId: string;
}

export interface AnswerResult {
  isCorrect: boolean;
  pointsAwarded: number;
  attemptNumber: number;
  explanation: string;
  correctAnswer?: any;
  currentScore: number;
  totalCorrect: number;
  accuracy: number;
}

export interface LearnerProfile {
  studentId: string;
  fullName: string;
  schoolName: string;
  className: string;
  publicDisplayName: string;
  createdAt: string;
}

export interface SessionState {
  sessionId: string;
  studentId: string;
  startedAt: string;
  lastSeenAt: string;
  activeSeconds: number;
  completedModules: string[];
  totalScore: number;
  totalCorrect: number;
  totalQuestions: number;
}

export interface ActivityPayload {
  activityId: string;
  activityType: 'TOPIC_COMPLETE' | 'TOUR_360_COMPLETE' | 'ARENA_ROUND_COMPLETE' | 'ARENA_COMPLETE';
  sessionId: string;
  studentId: string;
  transactionId: string;
  metadata?: Record<string, any>;
}

export interface ActivityResult {
  success: boolean;
  pointsAwarded: number;
  totalScore: number;
  completedModules: string[];
  message: string;
}

export interface LeaderboardItem {
  studentId: string;
  publicDisplayName: string;
  schoolName: string;
  totalScore: number;
  totalCorrect: number;
  totalQuestions: number;
  accuracy: number;
  activeSeconds: number;
  badgeCount: number;
  rank?: number;
  isCurrent?: boolean;
}

export interface TopicItem {
  id: string;
  number: number;
  title: string;
  shortDesc: string;
  period: string;
  imageUrl: string;
  imageCaption: string;
  contentParagraphs: string[];
  keyFacts: string[];
  interactivePrompt: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  mindMapKey: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
  requirement: string;
  category: 'historical' | 'arena' | 'exploration' | 'dedication';
}
