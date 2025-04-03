import { Request, Response } from 'express';
import knex from '../../db';
import { postSchema } from '../../schemas';
import handleError from '../utils/handleError';

const create = async (req: Request, res: Response) => {
  try {
    const { title, content } = postSchema.parse(req.body);
    const userId = req.user.id;
    const [post] = await knex('posts')
      .insert({ title, content, user_id: userId })
      .returning('id');
    res.status(201).json({
      ok: true,
      status: 201,
      message: 'Post created successfully',
      post: {
        id: post.id,
        title,
        content,
      },
    });
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.status).json(handleError(error));
  }
};

const list = async (req: Request, res: Response) => {};
const update = async (req: Request, res: Response) => {};
const del = async (req: Request, res: Response) => {};

export { create, list, update, del };
