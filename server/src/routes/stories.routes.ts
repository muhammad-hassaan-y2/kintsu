import { Router } from 'express';
import { getStories, getStoryById, createStory } from '../controllers/stories.controller.js';

const router = Router();

router.get('/', getStories);
router.get('/:id', getStoryById);
router.post('/', createStory);

export default router;
