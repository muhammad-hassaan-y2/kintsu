import { Router } from 'express';
import {
  listScenarios,
  startSession,
  submitTurn,
  completeSession,
  getHistory
} from '../controllers/roleplay.controller.js';

const router = Router();

router.get('/scenarios', listScenarios);
router.post('/start', startSession);
router.post('/turn', submitTurn);
router.post('/complete', completeSession);
router.get('/history', getHistory);

export default router;
