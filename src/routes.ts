import { register, login } from './core/controllers/user';
import { create, list, del, update } from './core/controllers/post';
import { authenticate } from './core/middlewares/authenticate';
import asyncHandler from './core/utils/asyncHandler';
import { Router } from 'express';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/posts', asyncHandler(list));

// private routes
router.use(authenticate);
router.post('/posts', asyncHandler(create));
router.put('/posts/:id', asyncHandler(update));
router.delete('/posts/:id', asyncHandler(del));

export default router;
