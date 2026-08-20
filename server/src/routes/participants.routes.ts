import { Router } from 'express';
import { getParticipants, getParticipantById, addCaseworkNote } from '../controllers/participants.controller.js';

const router = Router();

router.get('/', getParticipants);
router.get('/:id', getParticipantById);
router.post('/:id/notes', addCaseworkNote);

export default router;
