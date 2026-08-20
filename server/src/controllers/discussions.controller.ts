import { Request, Response } from 'express';
import { mockDiscussionGuides } from '../data/mockData.js';

export const getDiscussionGuides = (req: Request, res: Response): void => {
  res.json({
    success: true,
    count: mockDiscussionGuides.length,
    data: mockDiscussionGuides
  });
};
