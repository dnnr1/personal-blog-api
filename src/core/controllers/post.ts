import postService from '../services/post';
import type { Request, Response } from 'express';
import { createPostSchema, updatePostSchema } from '../schemas/post';
import { code } from '../utils/constants';
import isValidUUID from '../utils/isValidUUID';
import { AppError } from '../utils/AppError';

const create = async (req: Request, res: Response) => {
  const { title, content, pictureUrl } = createPostSchema.parse(req.body);
  const user_id = req.user.id;
  const data = await postService.create({
    title,
    content,
    user_id,
    pictureUrl,
  });
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

const get = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await postService.get(id);
  res.status(code.OK).json({
    ok: true,
    status: code.OK,
    message: 'Post retrieved successfully',
    data,
  });
};

const update = async (req: Request, res: Response) => {
  const body = updatePostSchema.parse(req.body);
  const { id } = req.params;
  const user_id = req.user.id;
  if (!isValidUUID(id)) throw new AppError('Post not found', code.NOT_FOUND);
  const data = await postService.update({ id, user_id, ...body });
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

export { create, list, update, remove, get };
