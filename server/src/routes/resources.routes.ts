import { Router } from 'express';
import { getResources } from '../controllers/resources.controller.js';

const router = Router();

router.get('/', getResources);

export default router;
