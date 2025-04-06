import { register, login } from './core/controllers/user';
import { create, list, del, update } from './core/controllers/post';
import { authenticate } from './core/middlewares/authenticate';
import { Router } from 'express';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/posts', list);

// private routes
router.use(authenticate);
router.post('/posts', create);
router.put('/posts/:id', update);
router.delete('/posts/:id', del);

export default router;
