import * as userController from './core/controllers/user';
import * as postController from './core/controllers/post';
import { authenticate } from './core/middlewares/authenticate';
import asyncHandler from './core/utils/asyncHandler';
import { Router } from 'express';

const router = Router();

router.post('/register', asyncHandler(userController.register));
router.post('/login', asyncHandler(userController.login));
router.get('/posts', asyncHandler(postController.list));

// private routes
router.use(authenticate);
router.post('/posts', asyncHandler(postController.create));
router.put('/posts/:id', asyncHandler(postController.update));
router.delete('/posts/:id', asyncHandler(postController.remove));

export default router;
