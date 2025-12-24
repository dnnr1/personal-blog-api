import express from 'express';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import router from './routes';
import errorHandler from './core/middlewares/errorHandler';
import { init as initMinio } from './core/storage/minio';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;
const baseUrl = '/blog-api';

const corsOptions: CorsOptions = {
  origin: process.env.ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get(`${baseUrl}/health`, (_req, res) => {
  res.json({ ok: true, status: 200, message: 'OK' });
});
app.use(baseUrl, router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
  try {
    initMinio();
  } catch (error) {
    console.error('Error initializing MinIO:', error);
  }
});
