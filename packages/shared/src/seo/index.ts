import { z } from 'zod'

/** Shared page SEO shape — each project owns its values; portal can re-emit them. */
export const pageSeoSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(''),
  canonical: z.string().optional(),
  robots: z.string().default('index,follow'),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  twitterCard: z.enum(['summary', 'summary_large_image']).default('summary'),
})

export type PageSeo = z.infer<typeof pageSeoSchema>

/** Map PageSeo → TanStack Router `head()` fragments. */
export function pageSeoToHead(seo: PageSeo) {
  const parsed = pageSeoSchema.parse(seo)
  const ogTitle = parsed.ogTitle ?? parsed.title
  const ogDescription = parsed.ogDescription ?? parsed.description

  return {
    meta: [
      { title: parsed.title },
      { name: 'description', content: parsed.description },
      { name: 'robots', content: parsed.robots },
      { property: 'og:title', content: ogTitle },
      { property: 'og:description', content: ogDescription },
      ...(parsed.ogImage
        ? [{ property: 'og:image', content: parsed.ogImage }]
        : []),
      { name: 'twitter:card', content: parsed.twitterCard },
      { name: 'twitter:title', content: ogTitle },
      { name: 'twitter:description', content: ogDescription },
    ],
    links: parsed.canonical
      ? [{ rel: 'canonical', href: parsed.canonical }]
      : [],
  }
}
