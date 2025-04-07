import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const env = process.env.NODE_ENV || 'development';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({ ok: false, status: 400, errors: err.errors });
    return;
  }
  res.status(500).json({
    ok: false,
    status: 500,
    message: 'Internal server error',
    errors: env === 'production' ? undefined : err,
  });
};

export default errorHandler;
