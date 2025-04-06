import knex from '../../db';
import { UserBaseWithPasswordSchema } from '../schemas/user';

const findByEmail = async (
  email: string,
): Promise<UserBaseWithPasswordSchema> => {
  const result = await knex('users').where({ email }).first();
  return result;
};

const create = async (user: {
  email: string;
  username: string;
  password: string;
}): Promise<UserBaseWithPasswordSchema> => {
  const [result] = await knex('users').insert(user).returning('*');
  return result;
};

const userRepository = {
  findByEmail,
  create,
};

export default userRepository;
