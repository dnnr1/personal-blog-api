import { z } from 'zod';

type ErrorResponse = {
  ok: boolean;
  status: number;
  message?: string;
  errors?: unknown;
};

const handleError = (error: unknown): ErrorResponse => {
  if (error instanceof z.ZodError) {
    return { ok: false, status: 400, errors: error.errors };
  }
  return {
    ok: false,
    status: 500,
    message: 'Internal server error',
  };
};

export default handleError;
