import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  pictureUrl: z.string().optional(),
});

export const updatePostSchema = z.object({
  title: z.string(),
  content: z.string(),
  pictureUrl: z.string().optional(),
});
