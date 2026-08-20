import { Request, Response } from 'express';
import { mockVideos } from '../data/mockData.js';

export const getVideos = (req: Request, res: Response): void => {
  const { category, search } = req.query;
  let filtered = [...mockVideos];

  if (category) {
    filtered = filtered.filter(v => v.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(v => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q));
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
};
