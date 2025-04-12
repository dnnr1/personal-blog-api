import db from '../../db';
import { Post, PostCreateInput, Posts } from '../models/post';

const create = async (post: PostCreateInput): Promise<Post> => {
  const [result] = await db('posts').insert(post).returning('*');
  return result;
};

const list = async (): Promise<Posts> => {
  const posts = await db('posts')
    .select(
      'posts.id',
      'posts.user_id',
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
): Promise<Post> => {
  const [result] = await db('posts')
    .where({ id, user_id })
    .update({ title, content, updated_at })
    .returning('*');
  return result;
};

const remove = async (id: string, user_id: string): Promise<Post> => {
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
