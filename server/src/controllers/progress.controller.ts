import { Request, Response } from 'express';
import {
  getParticipantProgressReport,
  addProgressEntry,
  updateParticipantStage,
  getFacilityProgressSummary
} from '../services/progress.service.js';

export const getReport = (req: Request, res: Response): void => {
  const id = req.params.id as string;
  const report = getParticipantProgressReport(id);

  res.json({
    success: true,
    data: report
  });
};

export const logEntry = (req: Request, res: Response): void => {
  const id = req.params.id as string;
  const entryData = req.body;

  const newEntry = addProgressEntry(id, entryData);

  res.status(201).json({
    success: true,
    message: 'Progress entry logged successfully',
    data: newEntry
  });
};

export const updateStage = (req: Request, res: Response): void => {
  const id = req.params.id as string;
  const { stage } = req.body;

  if (!stage) {
    res.status(400).json({ success: false, message: 'Rehabilitation stage is required' });
    return;
  }

  const updated = updateParticipantStage(id, stage);

  res.json({
    success: true,
    message: 'Rehabilitation stage updated successfully',
    data: updated
  });
};

export const getFacilitySummary = (req: Request, res: Response): void => {
  res.json({
    success: true,
    data: getFacilityProgressSummary()
  });
};
