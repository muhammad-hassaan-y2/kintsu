export interface User {
  id: string;
  name: string;
  email: string;
  role: 'instructor' | 'psychologist' | 'admin';
  facility: string;
  avatarInitials: string;
}

export interface SessionStep {
  stepNumber: number;
  type: 'video' | 'story' | 'discussion' | 'activity' | 'reflection' | 'closing';
  title: string;
  durationMinutes: number;
  content: string;
  mediaUrl?: string;
  questions?: string[];
}

export interface RehabilitationSession {
  id: string;
  title: string;
  subtitle: string;
  category: 'Anger Management' | 'Emotional Intelligence' | 'Respect & Society' | 'Life After Prison' | 'Addiction Recovery' | 'Family & Relationships';
  scheduledDate: string;
  scheduledTime: string;
  block: string;
  targetCount: number;
  completedCount: number;
  instructorId: string;
  instructorName: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  description: string;
  steps: SessionStep[];
  createdAt: string;
  updatedAt: string;
}

export interface Story {
  id: string;
  title: string;
  category: 'Hope' | 'Discipline' | 'Respect' | 'Family' | 'Overcoming Failure' | 'Second Chances';
  summary: string;
  fullText: string;
  authorOrSource: string;
  tags: string[];
  moral: string;
  estimatedReadTime: string;
  featured: boolean;
  createdAt: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  description: string;
  tags: string[];
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  category: 'Self-improvement' | 'Motivation' | 'Psychology' | 'Biography' | 'Discipline' | 'Philosophy';
  description: string;
  summaryText: string;
  audiobookAvailable: boolean;
  recommendedForStage: string;
  incentiveEligible: boolean;
}

export interface Participant {
  id: string;
  nameIdentifier: string; // e.g. Inmate ID or Pseudonym
  block: string;
  rehabilitationStage: 'Orientation' | 'Active Healing' | 'Skills & Growth' | 'Re-entry Prep' | 'Graduation';
  deEscalationScore: number; // 0 - 100
  empathyScore: number;
  sessionsAttended: number;
  booksCompleted: number;
  caseWorkerNotes: string[];
  lastActiveDate: string;
}

export interface DiscussionGuide {
  id: string;
  topic: string;
  suggestedQuestions: string[];
  instructorTips: string[];
  targetOutcome: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'Government Standard' | 'NGO Guide' | 'Psychology Module' | 'Tech & Digital Re-entry';
  description: string;
  downloadUrl?: string;
  content: string;
}
