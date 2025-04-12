import type { Request, Response } from 'express';
import userService from '../services/user';
import { userLoginSchema, userRegisterSchema } from '../schemas/user';
import setCookie from '../utils/setCookie';

export const register = async (req: Request, res: Response) => {
  const { email, password, username } = userRegisterSchema.parse(req.body);
  const data = await userService.register({ email, password, username });
  setCookie({ name: 'token', data, res });
  res.status(200).json({
    ok: true,
    status: 200,
    message: 'User created successfully',
    data: { ...data, password: undefined },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = userLoginSchema.parse(req.body);
  const data = await userService.login({ email, password });
  setCookie({ name: 'token', data, res });
  res.status(200).json({
    ok: true,
    status: 200,
    message: 'Login successful',
    data: { ...data, password: undefined },
  });
};
