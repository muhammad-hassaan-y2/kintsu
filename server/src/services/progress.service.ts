import { db } from '../db/jsonDb.js';

export interface ProgressEntry {
  entryId: string;
  participantId: string;
  participantName: string;
  date: string;
  milestoneTitle: string;
  type: 'Session Attendance' | 'Book Completed' | 'Roleplay Benchmark' | 'Stage Advancement' | 'Casework Note';
  deEscalationScore?: number;
  empathyScore?: number;
  notes: string;
}

export interface ProgressReport {
  participantId: string;
  participantName: string;
  block: string;
  rehabilitationStage: string;
  overallDeEscalationScore: number;
  overallEmpathyScore: number;
  sessionsAttended: number;
  booksCompleted: number;
  totalRehabilitationHours: number;
  timeline: ProgressEntry[];
  certificates: { certificateId: string; title: string; issuedDate: string; issuer: string }[];
}

export const getParticipantProgressReport = (participantId: string): ProgressReport => {
  const participants = db.getCollection('participants');
  const p = participants.find(item => item.id === participantId) || {
    id: participantId,
    nameIdentifier: `Participant #${participantId}`,
    block: 'Block C',
    rehabilitationStage: 'Active Healing',
    deEscalationScore: 84,
    empathyScore: 78,
    sessionsAttended: 14,
    booksCompleted: 3,
    caseWorkerNotes: [],
    lastActiveDate: '2026-08-20'
  };

  const allEntries: ProgressEntry[] = db.getCollection('progressEntries');
  const participantTimeline = allEntries.filter(entry => entry.participantId === participantId);

  const certificates = [];
  if (p.booksCompleted >= 3) {
    certificates.push({
      certificateId: `cert-read-${p.id}`,
      title: 'Reading Initiative Achievement Certificate',
      issuedDate: '2026-08-15',
      issuer: 'Kintsu ReStart Library'
    });
  }

  if (p.deEscalationScore >= 80) {
    certificates.push({
      certificateId: `cert-deesc-${p.id}`,
      title: 'De-escalation & Emotional Control Mastery',
      issuedDate: '2026-08-18',
      issuer: 'Rehabilitation Counseling Dept'
    });
  }

  return {
    participantId: p.id,
    participantName: p.nameIdentifier,
    block: p.block,
    rehabilitationStage: p.rehabilitationStage,
    overallDeEscalationScore: p.deEscalationScore,
    overallEmpathyScore: p.empathyScore,
    sessionsAttended: p.sessionsAttended,
    booksCompleted: p.booksCompleted,
    totalRehabilitationHours: p.sessionsAttended * 2.5,
    timeline: participantTimeline,
    certificates
  };
};

export const addProgressEntry = (participantId: string, entryData: Partial<ProgressEntry>): ProgressEntry => {
  const participants = db.getCollection('participants');
  const p = participants.find(item => item.id === participantId);
  const pName = p ? p.nameIdentifier : `Participant #${participantId}`;

  const newEntry: ProgressEntry = {
    entryId: `prg-${Date.now()}`,
    participantId,
    participantName: pName,
    date: entryData.date || new Date().toISOString().split('T')[0],
    milestoneTitle: entryData.milestoneTitle || 'Milestone Recorded',
    type: entryData.type || 'Session Attendance',
    deEscalationScore: entryData.deEscalationScore,
    empathyScore: entryData.empathyScore,
    notes: entryData.notes || ''
  };

  db.insert('progressEntries', newEntry);

  if (p) {
    if (entryData.deEscalationScore) p.deEscalationScore = Math.round((p.deEscalationScore + entryData.deEscalationScore) / 2);
    if (entryData.empathyScore) p.empathyScore = Math.round((p.empathyScore + entryData.empathyScore) / 2);
    if (entryData.type === 'Session Attendance') p.sessionsAttended += 1;
    if (entryData.type === 'Book Completed') p.booksCompleted += 1;
    p.lastActiveDate = new Date().toISOString().split('T')[0];
    db.update('participants', p.id, p);
  }

  return newEntry;
};

export const updateParticipantStage = (participantId: string, stage: string) => {
  const updated = db.update('participants', participantId, { rehabilitationStage: stage });
  return updated;
};

export const getFacilityProgressSummary = () => {
  const participants = db.getCollection('participants');
  const total = participants.length || 1;

  const avgDeEscalation = Math.round(participants.reduce((acc, p) => acc + (p.deEscalationScore || 75), 0) / total);
  const avgEmpathy = Math.round(participants.reduce((acc, p) => acc + (p.empathyScore || 70), 0) / total);
  const totalBooks = participants.reduce((acc, p) => acc + (p.booksCompleted || 0), 0);

  return {
    totalActiveParticipants: total,
    facilityAvgDeEscalation: `${avgDeEscalation}%`,
    facilityAvgEmpathy: `${avgEmpathy}%`,
    totalBooksCompleted: totalBooks,
    rehabilitationStagesDistribution: {
      Orientation: participants.filter(p => p.rehabilitationStage === 'Orientation').length,
      ActiveHealing: participants.filter(p => p.rehabilitationStage === 'Active Healing').length,
      SkillsAndGrowth: participants.filter(p => p.rehabilitationStage === 'Skills & Growth').length,
      ReentryPrep: participants.filter(p => p.rehabilitationStage === 'Re-entry Prep').length,
      Graduation: participants.filter(p => p.rehabilitationStage === 'Graduation').length
    }
  };
};
