import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import userService from '../services/user';
import { userLoginSchema, userRegisterSchema } from '../schemas/user';
import { code } from '../utils/constants';

export const register = async (req: Request, res: Response) => {
  const { email, password, username } = userRegisterSchema.parse(req.body);
  const data = await userService.register({ email, password, username });
  const token = jwt.sign(data, process.env.JWT_SECRET as string, {
    expiresIn: '3d',
  });
  res.status(code.CREATED).json({
    ok: true,
    status: code.CREATED,
    message: 'User created successfully',
    data,
    token,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = userLoginSchema.parse(req.body);
  const data = await userService.login({ email, password });
  const token = jwt.sign(data, process.env.JWT_SECRET as string, {
    expiresIn: '3d',
  });
  res.status(code.OK).json({
    ok: true,
    status: code.OK,
    message: 'Login successful',
    data,
    token,
  });
};
