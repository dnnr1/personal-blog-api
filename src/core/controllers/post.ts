import knex from '../../db';
import { postInputSchema } from '../schemas/post';
import isValidUUID from '../utils/isValidUUID';
import { Request, Response } from 'express';

const create = async (req: Request, res: Response) => {
  const { title, content } = postInputSchema.parse(req.body);
  const { id } = req.user;
  const [post] = await knex('posts')
    .insert({ title, content, user_id: id })
    .returning('*');
  res.status(201).json({
    ok: true,
    status: 201,
    message: 'Post created successfully',
    post: {
      id: post.id,
      title,
      content,
      created_at: post.created_at,
      updated_at: post.updated_at,
    },
  });
};

const list = async (_: Request, res: Response) => {
  const posts = await knex('posts')
    .select(
      'posts.id',
      'users.username',
      'posts.title',
      'posts.content',
      'posts.created_at',
      'posts.updated_at',
    )
    .join('users', 'posts.user_id', '=', 'users.id')
    .orderBy('posts.created_at', 'desc');
  res.status(200).json({
    ok: true,
    status: 200,
    message: 'Posts retrieved successfully',
    posts,
  });
};

const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId, username } = req.user;
  const { title, content } = postInputSchema.parse(req.body);
  const updated_at = new Date();
  const isValidPostId = isValidUUID(id);
  if (!isValidPostId) {
    res.status(400).json({
      ok: false,
      status: 400,
      message: 'Post not found',
    });
    return;
  }
  const [post] = await knex('posts')
    .where({ id, user_id: userId })
    .update({ title, content, updated_at })
    .returning('*');
  if (!post) {
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
    message: 'Post updated successfully',
    post: {
      id: post.id,
      username,
      title: post.title,
      content: post.content,
      created_at: post.created_at,
      updated_at: post.updated_at,
    },
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
