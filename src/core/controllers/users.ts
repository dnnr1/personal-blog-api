import { Request, Response } from 'express';
import knex from '../../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userLoginSchema, userSchema } from '../../schemas';
import handleError from '../utils/handleError';
import 'dotenv/config';

const { JWT_SECRET, NODE_ENV } = process.env;

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = userSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const userExists = await knex('users').where({ email }).first();
    if (userExists) {
      res.status(409).json({
        ok: false,
        status: 409,
        message: 'User already exists',
      });
      return;
    }
    const [user] = await knex('users')
      .insert({
        email,
        password: hashedPassword,
      })
      .returning('id');
    const token = jwt.sign({ id: user }, JWT_SECRET as string, {
      expiresIn: '1h',
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
    });
    res.status(201).json({
      ok: true,
      status: 201,
      message: 'User registered successfully',
      user: {
        id: user.id,
        email,
      },
      token,
    });
  } catch (error: unknown) {
    const errorResponse = handleError(error);
    res.status(errorResponse.status).json(errorResponse);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = userLoginSchema.parse(req.body);
    const user = await knex('users').where({ email }).first();
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!user) {
      res.status(401).json({
        ok: false,
        status: 401,
        message: 'User not found',
      });
      return;
    }
    if (!isPasswordValid) {
      res.status(401).json({
        ok: false,
        status: 401,
        message: 'Invalid email or password',
      });
      return;
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET as string, {
      expiresIn: '1h',
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
    });
    res.json({
      ok: true,
      status: 200,
      message: 'Login successful',
      user: {
        id: user.id,
        email,
      },
      token,
    });
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.status).json(errorResponse);
  }
};
