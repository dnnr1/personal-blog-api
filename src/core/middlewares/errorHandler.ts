import { AppError } from '../utils/AppError';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const errorHandler = (
  err: Error | z.ZodError | unknown,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: NextFunction,
) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({
      ok: false,
      status: 400,
      errors: err.errors,
    });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.status).json({
      ok: false,
      status: err.status,
      message: err.message,
    });
    return;
  }
  res.status(500).json({
    ok: false,
    status: 500,
    message: 'Internal server error',
  });
};

export default errorHandler;
