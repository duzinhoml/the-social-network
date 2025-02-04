import { Router } from 'express';
import { getUsers, getSingleUser, createUser, updateUser, deleteUser, addFriend, removeFriend } from '../../controllers/userController.js';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getSingleUser);

router.post('/', createUser);
router.post('/:userId/friends/:friendId', addFriend);

router.put('/:userId', updateUser);

router.delete('/:userId', deleteUser);
router.delete('/:userId/friends/:friendId', removeFriend);

export default router;