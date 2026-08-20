import { Request, Response } from 'express';
import {
  getSessionTemplates,
  saveSessionDraft,
  getDrafts,
  getDraftById,
  validateSessionStructure,
  publishSession
} from '../services/sessionBuilder.service.js';
import { generateSessionAI } from '../services/ai.service.js';

export const getTemplates = (req: Request, res: Response): void => {
  res.json({
    success: true,
    data: getSessionTemplates()
  });
};

export const getSessionDrafts = (req: Request, res: Response): void => {
  res.json({
    success: true,
    data: getDrafts()
  });
};

export const saveDraft = (req: Request, res: Response): void => {
  try {
    const draftData = req.body;
    const savedDraft = saveSessionDraft(draftData);
    res.json({
      success: true,
      message: 'Session draft saved successfully',
      data: savedDraft
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || 'Failed to save draft' });
  }
};

export const generateWithAI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic, category, block } = req.body;

    if (!topic || !category) {
      res.status(400).json({ success: false, message: 'Topic and category are required' });
      return;
    }

    const aiBuiltSession = await generateSessionAI(topic, category, block);

    res.json({
      success: true,
      message: 'Session generated via Gemini AI',
      data: aiBuiltSession
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'AI generation failed' });
  }
};

export const validateSession = (req: Request, res: Response): void => {
  const sessionData = req.body;
  const result = validateSessionStructure(sessionData);

  res.json({
    success: true,
    validation: result
  });
};

export const publishNewSession = (req: Request, res: Response): void => {
  try {
    const sessionData = req.body;
    const published = publishSession(sessionData);

    res.status(201).json({
      success: true,
      message: 'Session built and published to Today\'s Sessions schedule successfully',
      data: published
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to publish session'
    });
  }
};
