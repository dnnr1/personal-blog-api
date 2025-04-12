import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { code } from '../utils/constants';

const { JWT_SECRET } = process.env;

type TokenPayload = {
  id: string;
  username: string;
  email: string;
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(code.UNAUTHORIZED).json({
      ok: false,
      status: code.UNAUTHORIZED,
      message: 'UNAUTHORIZED',
    });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    req.user = decoded as TokenPayload;
    next();
  } catch (error) {
    res.status(code.UNAUTHORIZED).json({
      ok: false,
      status: code.UNAUTHORIZED,
      message: 'UNAUTHORIZED',
    });
  }
};
