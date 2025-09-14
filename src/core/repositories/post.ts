import db from '../../db';
import { Post, PostCreateInput, Posts, PostUpdateInput } from '../models/post';

const create = async (post: PostCreateInput): Promise<Post> => {
  const [result] = await db('posts').insert(post).returning('*');
  return result;
};

const list = async (): Promise<Posts> => {
  const posts = await db('posts')
    .select(
      'posts.id',
      'posts.user_id',
      'users.username as author',
      'posts.title',
      'posts.content',
      'posts.created_at',
      'posts.updated_at',
      'posts.pictureUrl',
    )
    .orderBy('created_at', 'desc')
    .join('users', 'posts.user_id', '=', 'users.id');
  return posts;
};

const get = async (id: string): Promise<Post | null> => {
  const post = await db('posts')
    .select(
      'posts.id',
      'posts.user_id',
      'users.username as author',
      'posts.title',
      'posts.content',
      'posts.created_at',
      'posts.updated_at',
      'posts.pictureUrl',
    )
    .join('users', 'posts.user_id', '=', 'users.id')
    .where('posts.id', id)
    .first();
  return post;
};

const update = async (input: PostUpdateInput): Promise<Post> => {
  const { title, content, pictureUrl, user_id, id } = input;
  const updated_at = new Date();
  const [result] = await db('posts')
    .where({ id, user_id })
    .update({ title, content, pictureUrl, updated_at })
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
  get,
  list,
  update,
  remove,
};

export default postRepository;
