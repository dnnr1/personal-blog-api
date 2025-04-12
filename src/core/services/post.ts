import type {
  CreatePostInputSchema,
  UpdatePostInputSchema,
} from '../schemas/post';
import postRepository from '../repositories/post';
import isValidUUID from '../utils/isValidUUID';
import { AppError } from '../utils/AppError';
import { code } from '../utils/constants';

const create = async (input: CreatePostInputSchema & { user_id: string }) => {
  const { title, content, user_id } = input;
  const post = await postRepository.create({ title, content, user_id });
  return {
    id: post.id,
    title,
    content,
    created_at: post.created_at,
    updated_at: post.updated_at,
  };
};

const list = async () => {
  const posts = await postRepository.list();
  return posts;
};

const update = async (
  input: UpdatePostInputSchema & { id: string; user_id: string },
) => {
  const { title, content, id, user_id } = input;
  const isValidPostId = isValidUUID(id);
  if (!isValidPostId) {
    throw new AppError('Post not found', code.BAD_REQUEST);
  }
  const updated_at = new Date();
  const post = await postRepository.update(
    title,
    content,
    user_id,
    updated_at,
    id,
  );
  if (!post) {
    throw new AppError('Post not found', code.BAD_REQUEST);
  }
  return post;
};

const remove = async (input: { id: string; user_id: string }) => {
  const { id, user_id } = input;
  const isValidPostId = isValidUUID(id);
  if (!isValidPostId) {
    throw new AppError('Post not found', code.BAD_REQUEST);
  }
  const post = await postRepository.remove(id, user_id);
  if (!post) {
    throw new AppError('Post not found', code.BAD_REQUEST);
  }
  return post;
};

const postService = {
  create,
  list,
  update,
  remove,
};

export default postService;
