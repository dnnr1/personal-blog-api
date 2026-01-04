import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { AppError } from '../utils/AppError';
import { code } from '../utils/constants';

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
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader) {
    return next(new AppError('UNAUTHORIZED', code.UNAUTHORIZED));
  }
  const [scheme, token] = authHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return next(new AppError('UNAUTHORIZED', code.UNAUTHORIZED));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as TokenPayload;
    return next();
  } catch {
    return next(new AppError('UNAUTHORIZED', code.UNAUTHORIZED));
  }
};
