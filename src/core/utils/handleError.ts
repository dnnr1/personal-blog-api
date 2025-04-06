import { z } from 'zod';
import 'dotenv/config';

type ErrorResponse = {
  ok: boolean;
  status: number;
  message?: string;
  errors?: unknown;
};

const env = process.env.NODE_ENV || 'development';

const handleError = (error: unknown): ErrorResponse => {
  if (error instanceof z.ZodError) {
    return { ok: false, status: 400, errors: error.errors };
  }
  return {
    ok: false,
    status: 500,
    message: 'Internal server error',
    errors: env === 'production' ? undefined : error,
  };
};

export default handleError;
