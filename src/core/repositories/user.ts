import db from '../../db';
import { User, UserCreateInput } from '../models/user';

const findByEmail = async (email: string): Promise<User> => {
  return await db('users').where({ email }).first();
};

const create = async (user: UserCreateInput): Promise<User> => {
  const [result] = await db('users').insert(user).returning('*');
  return result;
};

const userRepository = {
  findByEmail,
  create,
};

export default userRepository;
