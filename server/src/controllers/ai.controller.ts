import { Request, Response } from 'express';
import { getAIStatus, generateSessionAI, analyzeParticipantAI, generateStoryAI } from '../services/ai.service.js';

export const getStatus = (req: Request, res: Response): void => {
  res.json({
    success: true,
    data: getAIStatus()
  });
};

export const generateSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic, category, block } = req.body;

    if (!topic || !category) {
      res.status(400).json({ success: false, message: 'Topic and category are required' });
      return;
    }

    const sessionData = await generateSessionAI(topic, category, block);

    res.json({
      success: true,
      message: 'AI Rehabilitation Session generated successfully',
      data: sessionData
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to generate session' });
  }
};

export const analyzeParticipant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { participantName, caseNotes, recentResponse } = req.body;

    if (!participantName) {
      res.status(400).json({ success: false, message: 'Participant name or identifier is required' });
      return;
    }

    const analysis = await analyzeParticipantAI(participantName, caseNotes || [], recentResponse);

    res.json({
      success: true,
      message: 'Participant behavioral analysis completed',
      data: analysis
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to analyze participant' });
  }
};

export const generateStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { theme, targetAudience } = req.body;

    if (!theme) {
      res.status(400).json({ success: false, message: 'Theme is required' });
      return;
    }

    const story = await generateStoryAI(theme, targetAudience);

    res.json({
      success: true,
      message: 'Transformation story generated successfully',
      data: story
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to generate story' });
  }
};
