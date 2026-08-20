import { Request, Response } from 'express';
import { mockBooks } from '../data/mockData.js';
import { BookItem } from '../types/index.js';

let booksStore: BookItem[] = [...mockBooks];

export const getBooks = (req: Request, res: Response): void => {
  const { category, stage, audiobook } = req.query;

  let filtered = [...booksStore];

  if (category) {
    filtered = filtered.filter(b => b.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (stage) {
    filtered = filtered.filter(b => b.recommendedForStage.toLowerCase() === (stage as string).toLowerCase());
  }

  if (audiobook !== undefined) {
    filtered = filtered.filter(b => b.audiobookAvailable === (audiobook === 'true'));
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
};

export const getBookById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const book = booksStore.find(b => b.id === id);

  if (!book) {
    res.status(404).json({ success: false, message: 'Book not found' });
    return;
  }

  res.json({
    success: true,
    data: book
  });
};

export const createBook = (req: Request, res: Response): void => {
  const { title, author, category, description, summaryText, audiobookAvailable, recommendedForStage, incentiveEligible } = req.body;

  if (!title || !author || !category) {
    res.status(400).json({ success: false, message: 'Title, author, and category are required' });
    return;
  }

  const newBook: BookItem = {
    id: `book-${Date.now()}`,
    title,
    author,
    category,
    description: description || '',
    summaryText: summaryText || '',
    audiobookAvailable: Boolean(audiobookAvailable),
    recommendedForStage: recommendedForStage || 'Active Healing',
    incentiveEligible: incentiveEligible !== undefined ? Boolean(incentiveEligible) : true
  };

  booksStore.unshift(newBook);

  res.status(201).json({
    success: true,
    message: 'Book recommendation added successfully',
    data: newBook
  });
};
