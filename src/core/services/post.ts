import postRepository from '../repositories/post';
import isValidUUID from '../utils/isValidUUID';
import { code } from '../utils/constants';
import { AppError } from '../utils/AppError';
import {
  PostCreateInput,
  PostDeleteInput,
  PostUpdateInput,
} from '../models/post';

const create = async (input: PostCreateInput) => {
  return await postRepository.create(input);
};

const list = async () => {
  return await postRepository.list();
};

const update = async (input: PostUpdateInput) => {
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

const remove = async (input: PostDeleteInput) => {
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
