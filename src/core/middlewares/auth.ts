import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { JWT_SECRET } = process.env;

type TokenPayload = {
  id: number;
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({
      ok: false,
      status: 401,
      message: 'UNAUTHORIZED',
    });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    req.user = decoded as TokenPayload;
    next();
  } catch (error) {
    res.status(401).json({
      ok: false,
      status: 401,
      message: 'UNAUTHORIZED',
    });
  }
};
