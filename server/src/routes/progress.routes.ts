import { Router } from 'express';
import {
  getReport,
  logEntry,
  updateStage,
  getFacilitySummary
} from '../controllers/progress.controller.js';

const router = Router();

router.get('/summary', getFacilitySummary);
router.get('/participants/:id', getReport);
router.post('/participants/:id/log', logEntry);
router.patch('/participants/:id/stage', updateStage);

export default router;
