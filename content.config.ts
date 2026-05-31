import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'posts/**/*.md',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        category: z.string(),
        tags: z.array(z.string()).default([]),
        excerpt: z.string().default(''),
        thumbnail: z.string().optional(),
      }),
    }),
    feeds: defineCollection({
      type: 'page',
      source: 'feeds/**/*.md',
      schema: z.object({
        date: z.string(),
        tags: z.array(z.string()).default([]),
      }),
    }),
  },
})
