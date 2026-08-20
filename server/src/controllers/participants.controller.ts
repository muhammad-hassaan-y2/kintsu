import { Request, Response } from 'express';
import { mockParticipants } from '../data/mockData.js';
import { Participant } from '../types/index.js';

let participantsStore: Participant[] = [...mockParticipants];

export const getParticipants = (req: Request, res: Response): void => {
  const { block, stage } = req.query;
  let filtered = [...participantsStore];

  if (block) {
    filtered = filtered.filter(p => p.block.toLowerCase().includes((block as string).toLowerCase()));
  }

  if (stage) {
    filtered = filtered.filter(p => p.rehabilitationStage.toLowerCase() === (stage as string).toLowerCase());
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
};

export const getParticipantById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const participant = participantsStore.find(p => p.id === id);

  if (!participant) {
    res.status(404).json({ success: false, message: 'Participant not found' });
    return;
  }

  res.json({
    success: true,
    data: participant
  });
};

export const addCaseworkNote = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { note } = req.body;

  if (!note) {
    res.status(400).json({ success: false, message: 'Note content is required' });
    return;
  }

  const participant = participantsStore.find(p => p.id === id);

  if (!participant) {
    res.status(404).json({ success: false, message: 'Participant not found' });
    return;
  }

  participant.caseWorkerNotes.push(note);
  participant.lastActiveDate = new Date().toISOString().split('T')[0];

  res.json({
    success: true,
    message: 'Case worker note added successfully',
    data: participant
  });
};
