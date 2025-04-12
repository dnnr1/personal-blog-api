import bcrypt from 'bcrypt';
import userRepository from '../repositories/user';
import type {
  UserPublic,
  UserLoginInput,
  UserRegisterInput,
} from '../schemas/user';
import { userPublicSchema } from '../schemas/user';
import { AppError } from '../utils/AppError';
import { code } from '../utils/constants';

const register = async (input: UserRegisterInput): Promise<UserPublic> => {
  const existingUser = await userRepository.findByEmail(input.email);
  const saltRounds = 10;
  if (existingUser) {
    throw new AppError('User already exists', code.CONFLICT);
  }
  const hashedPassword = await bcrypt.hash(input.password, saltRounds);
  const data = await userRepository.create({
    ...input,
    password: hashedPassword,
  });
  return userPublicSchema.parse(data);
};

const login = async (input: UserLoginInput): Promise<UserPublic> => {
  const { email, password } = input;
  const data = await userRepository.findByEmail(email);
  if (!data || !(await bcrypt.compare(password, data.password))) {
    throw new AppError('Invalid credentials', code.UNAUTHORIZED);
  }
  return userPublicSchema.parse(data);
};

const userService = {
  register,
  login,
};

export default userService;
