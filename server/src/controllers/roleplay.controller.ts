import { Request, Response } from 'express';
import {
  getScenarios,
  startRoleplaySession,
  processRoleplayTurnAI,
  completeRoleplaySession,
  getRoleplayHistory
} from '../services/roleplay.service.js';

export const listScenarios = (req: Request, res: Response): void => {
  res.json({
    success: true,
    data: getScenarios()
  });
};

export const startSession = (req: Request, res: Response): void => {
  const { scenarioId, participantName, instructorName } = req.body;

  if (!participantName) {
    res.status(400).json({ success: false, message: 'Participant name or identifier is required' });
    return;
  }

  const sessionLog = startRoleplaySession(scenarioId || 'scen-101', participantName, instructorName);

  res.status(201).json({
    success: true,
    message: 'Roleplay simulation session started successfully',
    data: sessionLog
  });
};

export const submitTurn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { logId, userInput } = req.body;

    if (!logId || !userInput) {
      res.status(400).json({ success: false, message: 'logId and userInput are required' });
      return;
    }

    const result = await processRoleplayTurnAI(logId, userInput);

    res.json({
      success: true,
      message: 'Roleplay turn processed with Gemini AI feedback',
      data: result
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to process turn' });
  }
};

export const completeSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { logId } = req.body;

    if (!logId) {
      res.status(400).json({ success: false, message: 'logId is required' });
      return;
    }

    const completedLog = await completeRoleplaySession(logId);

    res.json({
      success: true,
      message: 'Roleplay session completed and analyzed',
      data: completedLog
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to complete session' });
  }
};

export const getHistory = (req: Request, res: Response): void => {
  res.json({
    success: true,
    data: getRoleplayHistory()
  });
};
