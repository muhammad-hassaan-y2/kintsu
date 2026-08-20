import { Router } from 'express';
import { getDiscussionGuides } from '../controllers/discussions.controller.js';

const router = Router();

router.get('/', getDiscussionGuides);

export default router;
