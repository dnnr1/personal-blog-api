import bcrypt from 'bcrypt';
import userRepository from '../repositories/user';
import { AppError } from '../utils/AppError';
import { code } from '../utils/constants';
import { UserLoginInput, UserCreateInput } from '../models/user';
import { omit } from 'lodash';

const register = async (input: UserCreateInput) => {
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
  const dataWithoutPassword = omit(data, ['password']);
  return dataWithoutPassword;
};

const login = async (input: UserLoginInput) => {
  const { email, password } = input;
  const data = await userRepository.findByEmail(email);
  if (!data || !(await bcrypt.compare(password, data.password))) {
    throw new AppError('Invalid credentials', code.UNAUTHORIZED);
  }
  const dataWithoutPassword = omit(data, ['password']);
  return dataWithoutPassword;
};

const userService = {
  register,
  login,
};

export default userService;
