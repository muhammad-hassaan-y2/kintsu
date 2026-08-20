import { Request, Response } from 'express';
import { mockStories } from '../data/mockData.js';
import { Story } from '../types/index.js';

let storiesStore: Story[] = [...mockStories];

export const getStories = (req: Request, res: Response): void => {
  const { category, search, featured } = req.query;

  let filtered = [...storiesStore];

  if (category) {
    filtered = filtered.filter(s => s.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (featured !== undefined) {
    filtered = filtered.filter(s => s.featured === (featured === 'true'));
  }

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
};

export const getStoryById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const story = storiesStore.find(s => s.id === id);

  if (!story) {
    res.status(404).json({ success: false, message: 'Story not found' });
    return;
  }

  res.json({
    success: true,
    data: story
  });
};

export const createStory = (req: Request, res: Response): void => {
  const { title, category, summary, fullText, moral, authorOrSource, tags, estimatedReadTime, featured } = req.body;

  if (!title || !category || !fullText) {
    res.status(400).json({ success: false, message: 'Title, category, and fullText are required' });
    return;
  }

  const newStory: Story = {
    id: `story-${Date.now()}`,
    title,
    category,
    summary: summary || fullText.substring(0, 120) + '...',
    fullText,
    authorOrSource: authorOrSource || 'ReStart Library',
    tags: tags || ['Rehabilitation'],
    moral: moral || '',
    estimatedReadTime: estimatedReadTime || '5 mins',
    featured: Boolean(featured),
    createdAt: new Date().toISOString()
  };

  storiesStore.unshift(newStory);

  res.status(201).json({
    success: true,
    message: 'Story created successfully',
    data: newStory
  });
};
