import { Request, Response } from 'express';
import * as userController from '../../src/core/controllers/user';
import userService from '../../src/core/services/user';
import setCookie from '../../src/core/utils/setCookie';
import { code } from '../../src/core/utils/constants';

jest.mock('../../src/core/services/user');
jest.mock('../../src/core/utils/setCookie');

const mockedUserService = userService as jest.Mocked<typeof userService>;
const mockedSetCookie = setCookie as jest.MockedFunction<typeof setCookie>;

describe('User controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
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

      await userController.register(mockReq as Request, mockRes as Response);

      expect(mockedUserService.register).toHaveBeenCalledWith(userData);
      expect(mockedSetCookie).toHaveBeenCalledWith({
        name: 'token',
        data: registeredUser,
        res: mockRes,
      });
      expect(mockRes.status).toHaveBeenCalledWith(code.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        status: code.CREATED,
        message: 'User created successfully',
        data: registeredUser,
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

      await userController.login(mockReq as Request, mockRes as Response);

      expect(mockedUserService.login).toHaveBeenCalledWith(loginData);
      expect(mockedSetCookie).toHaveBeenCalledWith({
        name: 'token',
        data: loggedInUser,
        res: mockRes,
      });
      expect(mockRes.status).toHaveBeenCalledWith(code.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        status: code.OK,
        message: 'Login successful',
        data: loggedInUser,
      });
    });
  });
});
