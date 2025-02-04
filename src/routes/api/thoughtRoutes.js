import { Router } from 'express';
import { getThoughts, getSingleThought, createThought, updateThought, deleteThought, addReaction, removeReaction } from '../../controllers/thoughtController.js';

const router = Router();

router.get('/', getThoughts);
router.get('/:thoughtId', getSingleThought);

router.post('/', createThought);
router.post('/:thoughtId/reactions/', addReaction);

router.put('/:thoughtId', updateThought);

router.delete('/:thoughtId', deleteThought);
router.delete('/:thoughtId/reactions/:reactionId', removeReaction);

export default router;