import { Router } from 'express';
import { getStatus, generateSession, analyzeParticipant, generateStory } from '../controllers/ai.controller.js';

const router = Router();

router.get('/status', getStatus);
router.post('/generate-session', generateSession);
router.post('/analyze-participant', analyzeParticipant);
router.post('/generate-story', generateStory);

export default router;
