import { Request, Response } from 'express';
import knex from '../../db';
import bcrypt from 'bcrypt';
import { userLoginSchema, userSchema } from '../../schemas';
import handleError from '../utils/handleError';
import setCookie from '../utils/setCookie';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = userSchema.parse(req.body);
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
        username,
        password: hashedPassword,
      })
      .returning('id');
    const data = {
      id: user.id,
      username: username,
      email,
    };
    setCookie({
      name: 'token',
      data,
      res,
    });
    res.status(201).json({
      ok: true,
      status: 201,
      message: 'User registered successfully',
      user: {
        ...data,
      },
    });
  } catch (error: unknown) {
    const errorResponse = handleError(error);
    res.status(errorResponse.status).json(errorResponse);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = userLoginSchema.parse(req.body);
    const user = await knex('users')
      .where({ email })
      .select('id', 'password', 'username')
      .first();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({
        ok: false,
        status: 401,
        message: 'Invalid credentials',
      });
      return;
    }
    const data = {
      id: user.id,
      username: user.username,
      email,
    };
    setCookie({
      name: 'token',
      data,
      res,
    });
    res.json({
      ok: true,
      status: 200,
      message: 'Login successful',
      user: {
        ...data,
      },
    });
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.status).json(errorResponse);
  }
};
