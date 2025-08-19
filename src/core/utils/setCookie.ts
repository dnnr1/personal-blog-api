import { Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { JWT_SECRET, NODE_ENV } = process.env;

type Cookie = {
  name: string;
  data: object;
  res: Response;
};

const setCookie = ({ name, data, res }: Cookie) => {
  const token = jwt.sign(data, JWT_SECRET as string, { expiresIn: '3d' });
  res.cookie(name, token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });
  return token;
};

export default setCookie;
