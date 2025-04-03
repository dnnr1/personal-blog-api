import express from 'express';
import cookieParser from 'cookie-parser';
import { register, login } from './core/controllers/users';
import { create, list, del, update } from './core/controllers/posts';
import { authenticate } from './core/middlewares/auth';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.post('/register', register);
app.post('/login', login);

app.use(authenticate);
app.post('/posts', authenticate, create);
app.get('/posts', list);
app.put('/posts/:id', update);
app.delete('/posts/:id', del);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
