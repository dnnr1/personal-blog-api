import type { PostBaseSchema } from '../schemas/post';
import db from '../../db';

const create = async (post: {
  title: string;
  content: string;
  user_id: string;
}): Promise<PostBaseSchema> => {
  const [result] = await db('posts').insert(post).returning('*');
  return result;
};

const list = async (): Promise<PostBaseSchema[]> => {
  const posts = await db('posts')
    .select(
      'posts.id',
      'users.username',
      'posts.title',
      'posts.content',
      'posts.created_at',
      'posts.updated_at',
    )
    .join('users', 'posts.user_id', '=', 'users.id');
  return posts;
};

const update = async (
  title: string,
  content: string,
  user_id: string,
  updated_at: Date,
  id: string,
): Promise<PostBaseSchema> => {
  const [result] = await db('posts')
    .where({ id, user_id })
    .update({ title, content, updated_at })
    .returning('*');
  return result;
};

const remove = async (id: string, user_id: string): Promise<any> => {
  const [result] = await db('posts')
    .where({ id, user_id })
    .del()
    .returning('*');
  return result;
};

const postRepository = {
  create,
  list,
  update,
  remove,
};

export default postRepository;
