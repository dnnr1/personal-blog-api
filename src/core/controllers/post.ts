import postService from '../services/post';
import type { Request, Response } from 'express';
import { createPostSchema, updatePostSchema } from '../schemas/post';

const create = async (req: Request, res: Response) => {
  const { title, content } = createPostSchema.parse(req.body);
  const user_id = req.user.id;
  const post = await postService.create({ title, content, user_id });
  res.status(200).json({
    ok: true,
    status: 200,
    message: 'Post created successfully',
    data: post,
  });
};

const list = async (_: Request, res: Response) => {
  const posts = await postService.list();
  res.status(200).json({
    ok: true,
    status: 200,
    message: 'Posts retrieved successfully',
    data: posts,
  });
};

const update = async (req: Request, res: Response) => {
  const { title, content } = updatePostSchema.parse(req.body);
  const { id } = req.params;
  const user_id = req.user.id;
  const post = await postService.update({ title, content, id, user_id });
  res.status(200).json({
    ok: true,
    status: 200,
    message: 'Post updated successfully',
    data: post,
  });
};

const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user_id = req.user.id;
  const post = await postService.remove({ id, user_id });
  res.status(200).json({
    ok: true,
    status: 200,
    message: 'Post deleted successfully',
    data: post,
  });
};

export { create, list, update, remove };
