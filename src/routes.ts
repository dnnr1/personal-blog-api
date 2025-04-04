import { register, login } from './core/controllers/users';
import { create, list, del, update } from './core/controllers/posts';
import { authenticate } from './core/middlewares/auth';
import { Router } from 'express';

const router = Router();

// public
router.post('/register', register);
router.post('/login', login);
router.get('/posts', list);

// private routes
router.use(authenticate);
router.post('/posts', create);
router.put('/posts/:id', update);
router.delete('/posts/:id', del);

export default router;
