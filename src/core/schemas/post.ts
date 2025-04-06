import { z } from 'zod';

export const postInputSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export type PostInputSchema = z.infer<typeof postInputSchema>;
