import postService from '../services/post';
import type { Request, Response } from 'express';
import { createPostSchema, updatePostSchema } from '../schemas/post';
import { code } from '../utils/constants';

const create = async (req: Request, res: Response) => {
  const { title, content } = createPostSchema.parse(req.body);
  const user_id = req.user.id;
  const data = await postService.create({ title, content, user_id });
  res.status(code.CREATED).json({
    ok: true,
    status: code.CREATED,
    message: 'Post created successfully',
    data,
  });
};

const list = async (_: Request, res: Response) => {
  const data = await postService.list();
  res.status(code.OK).json({
    ok: true,
    status: code.OK,
    message: 'Posts retrieved successfully',
    data,
  });
};

const update = async (req: Request, res: Response) => {
  const { title, content } = updatePostSchema.parse(req.body);
  const { id } = req.params;
  const user_id = req.user.id;
  const data = await postService.update({ title, content, id, user_id });
  res.status(code.OK).json({
    ok: true,
    status: code.OK,
    message: 'Post updated successfully',
    data,
  });
};

const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user_id = req.user.id;
  const data = await postService.remove({ id, user_id });
  res.status(code.OK).json({
    ok: true,
    status: code.OK,
    message: 'Post deleted successfully',
    data,
  });
};

export { create, list, update, remove };
