export interface Student {
  id: string;
  username: string;
  display_name: string;
  score: number;
  level: number;
  xp: number;
  created_at: string;
  last_active_at: string;
}

export interface Session {
  id: string;
  student_id: string;
  scenario: ScenarioKey;
  started_at: string;
  ended_at?: string;
  message_count: number;
  score_earned: number;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  feedback?: Feedback;
  created_at: string;
}

export interface Feedback {
  corrections: Correction[];
  suggestions: Suggestion[];
  scoreEarned: number;
}

export interface Correction {
  original: string;
  corrected: string;
  reason: string;
}

export interface Suggestion {
  text: string;
}

export type ScenarioKey = 'interview' | 'friends' | 'workplace';

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  feedback?: Feedback;
  isInterim?: boolean;
}
