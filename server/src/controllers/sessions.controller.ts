import { Request, Response } from 'express';
import { mockSessions } from '../data/mockData.js';
import { RehabilitationSession } from '../types/index.js';

let sessionsStore: RehabilitationSession[] = [...mockSessions];

export const getSessions = (req: Request, res: Response): void => {
  const { status, block, category } = req.query;

  let filtered = [...sessionsStore];

  if (status) {
    filtered = filtered.filter(s => s.status === status);
  }
  if (block) {
    filtered = filtered.filter(s => s.block.toLowerCase().includes((block as string).toLowerCase()));
  }
  if (category) {
    filtered = filtered.filter(s => s.category.toLowerCase() === (category as string).toLowerCase());
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
};

export const getTodaySessions = (req: Request, res: Response): void => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessionsStore.filter(s => s.scheduledDate === todayStr || s.status === 'in-progress' || s.status === 'upcoming');
  res.json({
    success: true,
    count: todaySessions.length,
    data: todaySessions
  });
};

export const getSessionById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const session = sessionsStore.find(s => s.id === id);

  if (!session) {
    res.status(404).json({ success: false, message: 'Session not found' });
    return;
  }

  res.json({
    success: true,
    data: session
  });
};

export const createSession = (req: Request, res: Response): void => {
  const { title, subtitle, category, scheduledDate, scheduledTime, block, targetCount, description, steps } = req.body;

  if (!title || !category) {
    res.status(400).json({ success: false, message: 'Title and category are required' });
    return;
  }

  const newSession: RehabilitationSession = {
    id: `sess-${Date.now()}`,
    title,
    subtitle: subtitle || '',
    category,
    scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
    scheduledTime: scheduledTime || '10:00 AM',
    block: block || 'Block C',
    targetCount: Number(targetCount) || 15,
    completedCount: 0,
    instructorId: (req as any).user?.id || 'usr-1',
    instructorName: (req as any).user?.name || 'Priya Rajan',
    status: 'upcoming',
    description: description || '',
    steps: steps || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  sessionsStore.unshift(newSession);

  res.status(201).json({
    success: true,
    message: 'Rehabilitation session created successfully',
    data: newSession
  });
};

export const updateSessionStatus = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status, completedCount } = req.body;

  const session = sessionsStore.find(s => s.id === id);

  if (!session) {
    res.status(404).json({ success: false, message: 'Session not found' });
    return;
  }

  if (status) session.status = status;
  if (completedCount !== undefined) session.completedCount = Number(completedCount);
  session.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Session updated successfully',
    data: session
  });
};

export const deleteSession = (req: Request, res: Response): void => {
  const { id } = req.params;
  const index = sessionsStore.findIndex(s => s.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Session not found' });
    return;
  }

  sessionsStore.splice(index, 1);

  res.json({
    success: true,
    message: 'Session deleted successfully'
  });
};
