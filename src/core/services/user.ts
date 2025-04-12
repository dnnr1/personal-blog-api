import bcrypt from 'bcrypt';
import userRepository from '../repositories/user';
import type {
  UserBase,
  UserLoginInput,
  UserRegisterInput,
} from '../schemas/user';
import { AppError } from '../utils/AppError';
import { code } from '../utils/constants';

const register = async (input: UserRegisterInput): Promise<UserBase> => {
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
  return data;
};

const login = async (input: UserLoginInput): Promise<UserBase> => {
  const { email, password } = input;
  const user = await userRepository.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid credentials', code.UNAUTHORIZED);
  }
  return user;
};
const userService = {
  register,
  login,
};

export default userService;
