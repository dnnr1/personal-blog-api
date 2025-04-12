import { z } from 'zod';

export const userRegisterSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const userLoginSchema = userRegisterSchema.merge(
  z.object({
    username: z.string().optional(),
    password: z.string(),
  }),
);
