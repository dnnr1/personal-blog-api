import * as userController from './core/controllers/user';
import * as postController from './core/controllers/post';
import * as uploadController from './core/controllers/upload';
import { authenticate } from './core/middlewares/authenticate';
import upload from './core/middlewares/upload';
import asyncHandler from './core/utils/asyncHandler';
import { Router } from 'express';

const router = Router();

router.post('/register', asyncHandler(userController.register));
router.post('/login', asyncHandler(userController.login));
router.get('/posts', asyncHandler(postController.list));
router.get('/posts/:id', asyncHandler(postController.get));

router.use(authenticate);
router.post('/posts', asyncHandler(postController.create));
router.put('/posts/:id', asyncHandler(postController.update));
router.delete('/posts/:id', asyncHandler(postController.remove));

router.post(
  '/upload',
  upload.array('image'),
  asyncHandler(uploadController.uploadPostImages),
);

export default router;
