import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishDate: z.string(),
    description: z.string(),
    draft: z.boolean().optional(),
    category: z.string().optional(),
  }),
});

export const collections = {
  blog,
};
