import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const updatePostSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const postBaseSchema = z.object({
  id: z.string(),
  username: z.string(),
  title: z.string(),
  content: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type CreatePostInputSchema = z.infer<typeof createPostSchema>;
export type CreatePostOutputSchema = z.infer<typeof createPostSchema>;
export type UpdatePostInputSchema = z.infer<typeof updatePostSchema>;
export type PostBaseSchema = z.infer<typeof postBaseSchema>;
