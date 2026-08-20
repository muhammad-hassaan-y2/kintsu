import { RehabilitationSession, SessionStep } from '../types/index.js';
import { generateSessionAI } from './ai.service.js';
import { mockSessions } from '../data/mockData.js';

export interface SessionDraft {
  draftId: string;
  title: string;
  subtitle: string;
  category: 'Anger Management' | 'Emotional Intelligence' | 'Respect & Society' | 'Life After Prison' | 'Addiction Recovery' | 'Family & Relationships';
  block: string;
  scheduledDate: string;
  scheduledTime: string;
  targetCount: number;
  description: string;
  steps: SessionStep[];
  updatedAt: string;
}

const sessionDraftsStore: Map<string, SessionDraft> = new Map();

export const getSessionTemplates = () => [
  {
    templateId: 'tmpl-deescalation',
    title: 'De-escalation & Emotional Control',
    category: 'Anger Management',
    recommendedBlock: 'Block C',
    defaultDurationMinutes: 55,
    description: 'Structured 6-step module teaching impulse control, 5-4-3-2-1 sensory grounding, and non-violent communication.',
    suggestedStepsCount: 6
  },
  {
    templateId: 'tmpl-reentry',
    title: 'Re-entry & Modern World Readiness',
    category: 'Life After Prison',
    recommendedBlock: 'Block A & B',
    defaultDurationMinutes: 60,
    description: 'Preparing participants for release: digital payments, modern workplaces, online services, and social integration.',
    suggestedStepsCount: 5
  },
  {
    templateId: 'tmpl-family',
    title: 'Restoring Family Trust & Communication',
    category: 'Family & Relationships',
    recommendedBlock: 'All Blocks',
    defaultDurationMinutes: 50,
    description: 'Navigating post-release family dynamics, rebuild trust through action, and effective parenting.',
    suggestedStepsCount: 5
  }
];

export const saveSessionDraft = (draft: Partial<SessionDraft>): SessionDraft => {
  const draftId = draft.draftId || `draft-${Date.now()}`;
  const updatedDraft: SessionDraft = {
    draftId,
    title: draft.title || 'Untitled Session Draft',
    subtitle: draft.subtitle || '',
    category: draft.category || 'Anger Management',
    block: draft.block || 'Block C',
    scheduledDate: draft.scheduledDate || new Date().toISOString().split('T')[0],
    scheduledTime: draft.scheduledTime || '10:00 AM',
    targetCount: draft.targetCount || 15,
    description: draft.description || '',
    steps: draft.steps || [],
    updatedAt: new Date().toISOString()
  };

  sessionDraftsStore.set(draftId, updatedDraft);
  return updatedDraft;
};

export const getDrafts = (): SessionDraft[] => {
  return Array.from(sessionDraftsStore.values());
};

export const getDraftById = (draftId: string): SessionDraft | undefined => {
  return sessionDraftsStore.get(draftId);
};

export const validateSessionStructure = (session: Partial<SessionDraft>) => {
  const errors: string[] = [];

  if (!session.title || session.title.trim() === '') {
    errors.push('Session title is required.');
  }

  if (!session.category) {
    errors.push('Category selection is required.');
  }

  if (!session.steps || session.steps.length === 0) {
    errors.push('At least one classroom step is required.');
  } else {
    const totalMinutes = session.steps.reduce((acc, step) => acc + (step.durationMinutes || 0), 0);
    if (totalMinutes > 120) {
      errors.push('Total session duration exceeds maximum 120 minutes limit.');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    totalMinutes: (session.steps || []).reduce((acc, s) => acc + (s.durationMinutes || 0), 0)
  };
};

export const publishSession = (draft: Partial<SessionDraft>): RehabilitationSession => {
  const validation = validateSessionStructure(draft);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(' ')}`);
  }

  const newSession: RehabilitationSession = {
    id: `sess-${Date.now()}`,
    title: draft.title!,
    subtitle: draft.subtitle || '',
    category: draft.category as any,
    scheduledDate: draft.scheduledDate || new Date().toISOString().split('T')[0],
    scheduledTime: draft.scheduledTime || '10:00 AM',
    block: draft.block || 'Block C',
    targetCount: Number(draft.targetCount) || 15,
    completedCount: 0,
    instructorId: 'usr-1',
    instructorName: 'Priya Rajan',
    status: 'upcoming',
    description: draft.description || '',
    steps: draft.steps || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockSessions.unshift(newSession);

  if (draft.draftId) {
    sessionDraftsStore.delete(draft.draftId);
  }

  return newSession;
};
