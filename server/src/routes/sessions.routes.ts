import { Router } from 'express';
import {
  getSessions,
  getTodaySessions,
  getSessionById,
  createSession,
  updateSessionStatus,
  deleteSession
} from '../controllers/sessions.controller.js';

const router = Router();

router.get('/', getSessions);
router.get('/today', getTodaySessions);
router.get('/:id', getSessionById);
router.post('/', createSession);
router.patch('/:id/status', updateSessionStatus);
router.delete('/:id', deleteSession);

export default router;
