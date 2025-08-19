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

const get = async (id: string) => {
  const isValidPostId = isValidUUID(id);
  if (!isValidPostId) {
    throw new AppError('Post not found', code.NOT_FOUND);
  }
  return await postRepository.get(id);
};

const update = async (input: PostUpdateInput) => {
  const { id } = input;
  const isValidPostId = isValidUUID(id);
  if (!isValidPostId) {
    throw new AppError('Post not found', code.NOT_FOUND);
  }
  const updated_at = new Date();
  const post = await postRepository.update({ ...input, updated_at });
  if (!post) {
    throw new AppError('Post not found', code.NOT_FOUND);
  }
  return post;
};

const remove = async (input: PostDeleteInput) => {
  const { id, user_id } = input;
  const isValidPostId = isValidUUID(id);
  if (!isValidPostId) {
    throw new AppError('Post not found', code.NOT_FOUND);
  }
  const post = await postRepository.remove(id, user_id);
  if (!post) {
    throw new AppError('Post not found', code.NOT_FOUND);
  }
  return post;
};

const postService = {
  create,
  list,
  update,
  get,
  remove,
};

export default postService;
