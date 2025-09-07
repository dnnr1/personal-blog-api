import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { AppError } from '../utils/AppError';
import { code } from '../utils/constants';

const { JWT_SECRET } = process.env;

type TokenPayload = {
  id: string;
  username: string;
  email: string;
};

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const cookieToken = req.cookies?.token as string | undefined;
  if (!cookieToken) {
    return next(new AppError('UNAUTHORIZED', code.UNAUTHORIZED));
  }
  try {
    const decoded = jwt.verify(cookieToken, JWT_SECRET as string);
    req.user = decoded as TokenPayload;
    return next();
  } catch {
    return next(new AppError('UNAUTHORIZED', code.UNAUTHORIZED));
  }
};
