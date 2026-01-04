import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../../src/core/middlewares/authenticate';
import { AppError } from '../../src/core/utils/AppError';
import { code } from '../../src/core/utils/constants';

jest.mock('jsonwebtoken');

const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('authenticate middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next with AppError when no token is provided', () => {
    authenticate(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    const error = (mockNext as jest.Mock).mock.calls[0][0];
    expect(error.message).toBe('UNAUTHORIZED');
    expect(error.status).toBe(code.UNAUTHORIZED);
  });

  it('should set user on request when token is valid', () => {
    const tokenPayload = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      username: 'testuser',
      email: 'test@example.com',
    };

    mockReq.headers = { authorization: 'Bearer valid-token' };
    (mockedJwt.verify as jest.Mock).mockReturnValue(tokenPayload);

    authenticate(mockReq as Request, mockRes as Response, mockNext);

    expect(mockedJwt.verify).toHaveBeenCalledWith(
      'valid-token',
      expect.any(String),
    );
    expect(mockReq.user).toEqual(tokenPayload);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should call next with AppError when token is invalid', () => {
    mockReq.headers = { authorization: 'Bearer invalid-token' };
    (mockedJwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticate(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    const error = (mockNext as jest.Mock).mock.calls[0][0];
    expect(error.message).toBe('UNAUTHORIZED');
    expect(error.status).toBe(code.UNAUTHORIZED);
  });
});
