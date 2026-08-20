import { Router } from 'express';
import {
  getTemplates,
  getSessionDrafts,
  saveDraft,
  generateWithAI,
  validateSession,
  publishNewSession
} from '../controllers/sessionBuilder.controller.js';

const router = Router();

router.get('/templates', getTemplates);
router.get('/drafts', getSessionDrafts);
router.post('/draft', saveDraft);
router.post('/generate-ai', generateWithAI);
router.post('/validate', validateSession);
router.post('/publish', publishNewSession);

export default router;
