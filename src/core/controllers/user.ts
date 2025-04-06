import { Request, Response } from 'express';
import handleError from '../utils/handleError';
import userService from '../services/user';
import { userLoginInputSchema, userRegisterInputSchema } from '../schemas/user';
import setCookie from '../utils/setCookie';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = userRegisterInputSchema.parse(
      req.body,
    );
    const result = await userService.register({ email, password, username });
    if (result.data) {
      setCookie({ name: 'token', data: result.data, res });
    }
    res.status(result.status).json(result);
  } catch (err) {
    const errorResponse = handleError(err);
    res.status(errorResponse.status).json(errorResponse);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = userLoginInputSchema.parse(req.body);
    const result = await userService.login({ email, password });
    if (result.data) {
      setCookie({ name: 'token', data: result.data, res });
    }
    res.status(result.status).json(result);
  } catch (err) {
    const errorResponse = handleError(err);
    res.status(errorResponse.status).json(errorResponse);
  }
};
