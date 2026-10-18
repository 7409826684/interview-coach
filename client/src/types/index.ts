export interface User {
  _id: string;
  name: string;
  email: string;
  streak: number;
  weakAreas: string[];
  token?: string;
}

export interface InterviewQuestion {
  question: string;
  category: string;
  hint?: string;
}

export interface AnswerEvaluation {
  score: number;
  strengths: string[];
  mistakes: string[];
  feedback: string;
  sampleAnswer: string;
  followUpQuestion?: string;
}

export interface SpeakingEvaluation {
  grammarScore: number;
  vocabularyScore: number;
  fluencyScore: number;
  confidenceScore: number;
  overallScore: number;
  mistakes: string[];
  correctedVersion: string;
  tips: string[];
}

export interface ResumeQuestion {
  question: string;
  category: string;
  rationale: string;
}

export interface ResumeAnalysis {
  summary: string;
  questions: ResumeQuestion[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SessionRecord {
  _id: string;
  type: 'mock' | 'speaking' | 'hr' | 'technical' | 'resume';
  role?: string;
  difficulty?: string;
  topic?: string;
  score: number;
  summaryFeedback?: string;
  createdAt: string;
}

export interface DashboardStats {
  streak: number;
  totalSessions: number;
  averageScore: number;
  weakAreas: string[];
  typeBreakdown: {
    mock: number;
    speaking: number;
    hr: number;
    technical: number;
    resume: number;
  };
  recentSessions: SessionRecord[];
}
