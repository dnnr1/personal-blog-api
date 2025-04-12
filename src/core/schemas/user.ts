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

export const userBaseSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserBase = z.infer<typeof userBaseSchema>;
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
