import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const userLoginSchema = userSchema.merge(
  z.object({
    password: z.string(),
  }),
);

export const postSchema = z.object({
  title: z.string(),
  content: z.string(),
});
