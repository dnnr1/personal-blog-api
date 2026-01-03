import userService from '../../src/core/services/user';
import userRepository from '../../src/core/repositories/user';
import bcrypt from 'bcrypt';
import { AppError } from '../../src/core/utils/AppError';

jest.mock('../../src/core/repositories/user');
jest.mock('bcrypt');

const mockedUserRepository = userRepository as jest.Mocked<
  typeof userRepository
>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerInput = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
    };

    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: registerInput.email,
        username: registerInput.username,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockedUserRepository.findByEmail.mockResolvedValue(null as any);
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockedUserRepository.create.mockResolvedValue(createdUser);

      const result = await userService.register(registerInput);

      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
        registerInput.email,
      );
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(
        registerInput.password,
        10,
      );
      expect(mockedUserRepository.create).toHaveBeenCalledWith({
        ...registerInput,
        password: hashedPassword,
      });
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(registerInput.email);
    });

    it('should throw AppError when user already exists', async () => {
      const existingUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: registerInput.email,
        username: 'existinguser',
        password: 'hashedPassword',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockedUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(userService.register(registerInput)).rejects.toThrow(
        AppError,
      );
      await expect(userService.register(registerInput)).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('login', () => {
    const loginInput = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully with valid credentials', async () => {
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: loginInput.email,
        username: 'testuser',
        password: 'hashedPassword123',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockedUserRepository.findByEmail.mockResolvedValue(user);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await userService.login(loginInput);

      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
        loginInput.email,
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        loginInput.password,
        user.password,
      );
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(loginInput.email);
    });

    it('should throw AppError when user does not exist', async () => {
      mockedUserRepository.findByEmail.mockResolvedValue(null as any);

      await expect(userService.login(loginInput)).rejects.toThrow(AppError);
      await expect(userService.login(loginInput)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw AppError when password is incorrect', async () => {
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: loginInput.email,
        username: 'testuser',
        password: 'hashedPassword123',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockedUserRepository.findByEmail.mockResolvedValue(user);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userService.login(loginInput)).rejects.toThrow(AppError);
      await expect(userService.login(loginInput)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
