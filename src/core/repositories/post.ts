import knex from 'knex';
import type { CreatePostOutputSchema, PostBaseSchema } from '../schemas/post';

const create = async (post: {
  title: string;
  content: string;
  user_id: string;
}): Promise<CreatePostOutputSchema> => {
  const [result] = await knex('posts').insert(post).returning('*');
  return result;
};

const getPosts = async (): Promise<PostBaseSchema[]> => {
  const posts = await knex('posts')
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
) => {
  const [result] = await knex('posts')
    .where({ id, user_id })
    .update({ title, content, updated_at })
    .returning('*');
  return result;
};

const postRepository = {
  create,
  getPosts,
  update,
};

export default postRepository;
