import bcrypt from 'bcrypt';
import userRepository from '../repositories/user';
import type {
  UserBaseSchema,
  UserLoginInputSchema,
  UserRegisterInputSchema,
} from '../schemas/user';
import type { ApiResponse } from '../../types';
import { code } from '../utils/constants';

const register = async (
  input: UserRegisterInputSchema,
): Promise<ApiResponse<UserBaseSchema>> => {
  const existingUser = await userRepository.findByEmail(input.email);
  if (existingUser) {
    return {
      ok: false,
      status: code.CONFLICT,
      message: 'User already exists',
    };
  }
  const hashedPassword = await bcrypt.hash(input.password, 10);
  const data = await userRepository.create({
    ...input,
    password: hashedPassword,
  });
  return {
    ok: true,
    status: code.CREATED,
    data: {
      id: data.id,
      username: data.username,
      email: data.email,
      created_at: data.created_at,
      updated_at: data.updated_at,
    },
  };
};

const login = async (
  input: UserLoginInputSchema,
): Promise<ApiResponse<UserBaseSchema>> => {
  const { email, password } = input;
  const user = await userRepository.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return {
      ok: false,
      status: code.UNAUTHORIZED,
      message: 'Invalid credentials',
    };
  }
  return {
    ok: true,
    status: code.OK,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};

const userService = {
  register,
  login,
};

export default userService;
