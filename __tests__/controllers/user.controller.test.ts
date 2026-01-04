import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as userController from '../../src/core/controllers/user';
import userService from '../../src/core/services/user';
import { code } from '../../src/core/utils/constants';

jest.mock('../../src/core/services/user');
jest.mock('jsonwebtoken');

const mockedUserService = userService as jest.Mocked<typeof userService>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('User controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user and return 201', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const registeredUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: userData.email,
        username: userData.username,
      };

      mockReq.body = userData;
      mockedUserService.register.mockResolvedValue(registeredUser as any);
      (mockedJwt.sign as jest.Mock).mockReturnValue('mock-token');

      await userController.register(mockReq as Request, mockRes as Response);

      expect(mockedUserService.register).toHaveBeenCalledWith(userData);
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        registeredUser,
        'test-secret',
        {
          expiresIn: '3d',
        },
      );
      expect(mockRes.status).toHaveBeenCalledWith(code.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        status: code.CREATED,
        message: 'User created successfully',
        data: registeredUser,
        token: 'mock-token',
      });
    });
  });

  describe('login', () => {
    it('should login a user and return 200', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const loggedInUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: loginData.email,
        username: 'testuser',
      };

      mockReq.body = loginData;
      mockedUserService.login.mockResolvedValue(loggedInUser as any);
      (mockedJwt.sign as jest.Mock).mockReturnValue('mock-token');

      await userController.login(mockReq as Request, mockRes as Response);

      expect(mockedUserService.login).toHaveBeenCalledWith(loginData);
      expect(mockedJwt.sign).toHaveBeenCalledWith(loggedInUser, 'test-secret', {
        expiresIn: '3d',
      });
      expect(mockRes.status).toHaveBeenCalledWith(code.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        status: code.OK,
        message: 'Login successful',
        data: loggedInUser,
        token: 'mock-token',
      });
    });
  });
});
