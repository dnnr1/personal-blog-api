import { z } from 'zod';

export const userRegisterInputSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const userLoginInputSchema = userRegisterInputSchema.merge(
  z.object({
    username: z.string().optional(),
    password: z.string(),
  }),
);

export const userBaseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const userBaseWithPasswordSchema = userBaseSchema.merge(
  z.object({
    password: z.string(),
  }),
);

export type UserBaseSchema = z.infer<typeof userBaseSchema>;
export type UserBaseWithPasswordSchema = z.infer<
  typeof userBaseWithPasswordSchema
>;
export type UserRegisterInputSchema = z.infer<typeof userRegisterInputSchema>;
export type UserLoginInputSchema = z.infer<typeof userLoginInputSchema>;
