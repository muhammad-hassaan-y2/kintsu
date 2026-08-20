import { Router } from 'express';
import { login, getProfile } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', login);
router.get('/me', getProfile);

export default router;
