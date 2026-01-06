
export type AppView = 'home' | 'sessions' | 'daily' | 'profile' | 'messages' | 'ai-chat';
export type SessionCategory = 'group' | 'siphon' | 'fun' | 'challenges';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isAi?: boolean;
}

export interface Conversation {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isAi: boolean;
}

export interface UserProfile {
  id: string;
  pseudonym: string;
  avatar: string; 
  profilePic?: string;
  coverPic?: string;
  moods: string[];
  preferences: 'talk' | 'listen' | 'both';
  privacy: 'only-me' | 'friends' | 'public';
  level: number;
  xp: number;
  xpToNextLevel: number;
  rankTitle: string;
  isQualified: boolean; // هل اجتاز اختبار التأهيل؟
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likes: number;
  comments: number;
  timestamp: Date;
  isAnonymous: boolean;
}

export interface GroupSession {
  id: string;
  title: string;
  description: string;
  participants: number;
  activeMics: number;
  durationWeeks: number;
  isJoined: boolean;
  isUserCreated?: boolean;
}

export interface CheckIn {
  id: string;
  timestamp: Date;
  type: 'morning' | 'night' | 'diary';
  content: string;
  mediaType: 'voice' | 'text' | 'both';
  audioData?: string; // Base64 encoded audio
  aiFeedback?: string;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// Added SiphonState interface to fix import error in SiphonRoom.tsx
export interface SiphonState {
  step: 'writing' | 'matching' | 'round1' | 'round2' | 'round3';
  myProblem: string;
  partnerProblem: string;
  timer: number;
}

// Added PsychologicalChallenge interface with duration field
export interface PsychologicalChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  isCompleted: boolean;
  category: 'daily' | 'weekly' | 'milestone';
  durationSeconds?: number; // المدة المطلوبة للتحدي بالثواني
}
