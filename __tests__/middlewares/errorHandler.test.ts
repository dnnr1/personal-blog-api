import { Request, Response, NextFunction } from 'express';
import errorHandler from '../../src/core/middlewares/errorHandler';
import { AppError } from '../../src/core/utils/AppError';
import { z } from 'zod';
import { code } from '../../src/core/utils/constants';

describe('errorHandler middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should handle ZodError with 400 status', () => {
    const schema = z.object({
      email: z.string().email(),
    });

    let zodError: z.ZodError;
    try {
      schema.parse({ email: 'invalid' });
    } catch (err) {
      zodError = err as z.ZodError;
    }

    errorHandler(zodError!, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(code.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: false,
      status: code.BAD_REQUEST,
      message: 'Validation error',
      errors: zodError!.errors,
    });
  });

  it('should handle AppError with custom status', () => {
    const appError = new AppError('Not found', code.NOT_FOUND);

    errorHandler(appError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(code.NOT_FOUND);
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: false,
      status: code.NOT_FOUND,
      message: 'Not found',
    });
  });

  it('should handle AppError with default status', () => {
    const appError = new AppError('Bad request');

    errorHandler(appError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: false,
      status: 400,
      message: 'Bad request',
    });
  });

  it('should handle generic Error with 500 status', () => {
    const error = new Error('Something went wrong');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(code.INTERNAL_SERVER_ERROR);
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: false,
      status: code.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
    });
  });

  it('should handle unknown error with 500 status', () => {
    const unknownError = 'string error';

    errorHandler(
      unknownError,
      mockReq as Request,
      mockRes as Response,
      mockNext,
    );

    expect(mockRes.status).toHaveBeenCalledWith(code.INTERNAL_SERVER_ERROR);
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: false,
      status: code.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  });
});
