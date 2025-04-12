import bcrypt from 'bcrypt';
import userRepository from '../repositories/user';
import { AppError } from '../utils/AppError';
import { code } from '../utils/constants';
import { UserLoginInput, UserRegisterInput } from '../models/user';

const register = async (input: UserRegisterInput) => {
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
  return { ...data, password: undefined };
};

const login = async (input: UserLoginInput) => {
  const { email, password } = input;
  const data = await userRepository.findByEmail(email);
  if (!data || !(await bcrypt.compare(password, data.password))) {
    throw new AppError('Invalid credentials', code.UNAUTHORIZED);
  }
  return { ...data, password: undefined };
};

const userService = {
  register,
  login,
};

export default userService;
