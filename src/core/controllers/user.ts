import type { Request, Response } from 'express';
import userService from '../services/user';
import setCookie from '../utils/setCookie';
import { userLoginSchema, userRegisterSchema } from '../schemas/user';
import { code } from '../utils/constants';

export const register = async (req: Request, res: Response) => {
  const { email, password, username } = userRegisterSchema.parse(req.body);
  const data = await userService.register({ email, password, username });
  setCookie({ name: 'token', data, res });
  res.status(code.CREATED).json({
    ok: true,
    status: code.CREATED,
    message: 'User created successfully',
    data,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = userLoginSchema.parse(req.body);
  const data = await userService.login({ email, password });
  setCookie({ name: 'token', data, res });
  res.status(code.OK).json({
    ok: true,
    status: code.OK,
    message: 'Login successful',
    data,
  });
};
