import { AppError } from '../utils/AppError';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { code } from '../utils/constants';

const errorHandler = (
  err: Error | z.ZodError | unknown,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: NextFunction,
) => {
  if (err instanceof z.ZodError) {
    res.status(code.BAD_REQUEST).json({
      ok: false,
      status: code.BAD_REQUEST,
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
  res.status(code.INTERNAL_SERVER_ERROR).json({
    ok: false,
    status: code.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
  });
};

export default errorHandler;
