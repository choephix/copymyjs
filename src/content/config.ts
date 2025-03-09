import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishDate: z.string(),
    description: z.string(),
    draft: z.boolean().optional(),
    category: z.string().optional(),
    version: z.union([z.string(), z.number()]).optional(),
    folder: z.string().optional(),
  }),
});

export const collections = {
  posts,
};
