import { Request, Response } from 'express';
import { mockResources } from '../data/mockData.js';

export const getResources = (req: Request, res: Response): void => {
  res.json({
    success: true,
    count: mockResources.length,
    data: mockResources
  });
};
