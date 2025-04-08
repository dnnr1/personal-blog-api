import knex from '../../db';
import { createPostInputSchema, updatePostInputSchema } from '../schemas/post';
import isValidUUID from '../utils/isValidUUID';
import postService from '../services/post';
import type { Request, Response } from 'express';

const create = async (req: Request, res: Response) => {
  const { title, content } = createPostInputSchema.parse(req.body);
  const post = await postService.create({ title, content }, req);
  res.status(200).json({
    ok: true,
    status: 200,
    data: post,
  });
};

const list = async (_: Request, res: Response) => {
  const posts = await postService.getPosts();
  res.status(200).json({
    ok: true,
    status: 200,
    data: posts,
  });
};

const update = async (req: Request, res: Response) => {
  const { title, content } = updatePostInputSchema.parse(req.body);
  const { id } = req.params;
  const post = await postService.update({ title, content, id }, req);
  res.status(200).json({
    ok: true,
    status: 200,
    message: 'Post updated successfully',
  });
};

const del = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const isValidPostId = isValidUUID(id);
  if (!isValidPostId) {
    res.status(400).json({
      ok: false,
      status: 400,
      message: 'Post not found',
    });
    return;
  }
  const [deletedPost] = await knex('posts')
    .where({ id, user_id: userId })
    .del()
    .returning('*');
  if (!deletedPost) {
    res.status(404).json({
      ok: false,
      status: 404,
      message: 'Post not found',
    });
    return;
  }
  res.status(200).json({
    ok: true,
    status: 200,
    message: 'Post deleted successfully',
  });
};

export { create, list, update, del };
