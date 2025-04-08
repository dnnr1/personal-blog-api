import { z } from 'zod';

export const createPostInputSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const updatePostInputSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});

export const createPostOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const postBaseSchema = z.object({
  id: z.string(),
  username: z.string(),
  title: z.string(),
  content: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type CreatePostInputSchema = z.infer<typeof createPostInputSchema>;
export type CreatePostOutputSchema = z.infer<typeof createPostOutputSchema>;
export type UpdatePostInputSchema = z.infer<typeof updatePostInputSchema>;
export type PostBaseSchema = z.infer<typeof postBaseSchema>;
