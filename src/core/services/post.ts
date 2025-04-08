import type {
  CreatePostInputSchema,
  UpdatePostInputSchema,
} from '../schemas/post';
import postRepository from '../repositories/post';
import type { Request } from 'express';
import isValidUUID from '../utils/isValidUUID';

const create = async (input: CreatePostInputSchema, req: Request) => {
  const { title, content } = input;
  const { id: user_id } = req.user;
  const post = await postRepository.create({ title, content, user_id });
  return {
    id: post.id,
    title,
    content,
    created_at: post.created_at,
    updated_at: post.updated_at,
  };
};

const getPosts = async () => {
  const posts = await postRepository.getPosts();
  return posts;
};

const update = async (input: UpdatePostInputSchema, req: Request) => {
  const { title, content, id } = input;
  const { id: user_id } = req.user;
  const updated_at = new Date();
  const isValidPostId = isValidUUID(id);
  if (!isValidPostId) {
    return {
      ok: false,
      status: 400,
      message: 'Post not found',
    };
  }
  const post = postRepository.update(title, content, user_id, updated_at, id);
  if (!post) {
    return {
      ok: false,
      status: 400,
      message: 'Post not found',
    };
  }
  return post;
};

const postService = {
  create,
  getPosts,
  update,
};

export default postService;
