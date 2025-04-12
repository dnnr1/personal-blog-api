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

export const userInternalSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const userPublicSchema = userInternalSchema.omit({ password: true });

export type UserInternal = z.infer<typeof userInternalSchema>;
export type UserPublic = z.infer<typeof userPublicSchema>;
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
