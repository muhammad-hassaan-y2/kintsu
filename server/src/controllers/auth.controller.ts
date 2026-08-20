import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { mockUsers } from '../data/mockData.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kintsu_restart_secret_key_2026';

export const login = (req: Request, res: Response): void => {
  const { email } = req.body;
  const user = mockUsers.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || mockUsers[0];

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    message: 'Authenticated successfully',
    token,
    user
  });
};

export const getProfile = (req: Request, res: Response): void => {
  const user = (req as any).user || mockUsers[0];
  res.json({
    success: true,
    user
  });
};
