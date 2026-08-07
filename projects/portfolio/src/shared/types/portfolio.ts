import { z } from 'zod'

export const socialIconSchema = z.enum(['linkedin', 'github', 'facebook'])
export const contactIconSchema = z.enum(['mail', 'phone'])

export const portfolioDataSchema = z.object({
  meta: z.object({
    id: z.string(),
    version: z.string(),
    accent: z.string(),
    locale: z.string(),
    siteTitle: z.string(),
    source: z.string(),
  }),
  profile: z.object({
    name: z.string(),
    displayName: z.string(),
    nickname: z.string(),
    fullName: z.string(),
    headline: z.string(),
    greeting: z.string(),
    welcome: z.string(),
    roles: z.array(z.string()).min(1),
    company: z.string(),
    location: z.string(),
    timezone: z.string(),
    githubUsername: z.string(),
    websiteUrl: z.string(),
    summary: z.array(z.string()).min(1),
    currentlyLearning: z.array(z.string()),
    resumeUrl: z.string(),
    moreProjectsUrl: z.string(),
  }),
  socials: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      url: z.string(),
      icon: socialIconSchema,
    }),
  ),
  nav: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      hash: z.string(),
    }),
  ),
  techStacks: z.array(
    z.object({
      title: z.string(),
      keys: z.array(z.string()),
    }),
  ),
  experiences: z.array(
    z.object({
      id: z.string(),
      companies: z.array(z.string()),
      positions: z.array(z.string()),
      startDate: z.string(),
      endDate: z.string(),
      responsibilities: z.array(z.string()),
      techStacks: z.array(
        z.object({
          title: z.string(),
          keys: z.string(),
        }),
      ),
    }),
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      url: z.string(),
      description: z.string(),
    }),
  ),
  contacts: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      value: z.string(),
      href: z.string(),
      icon: contactIconSchema,
    }),
  ),
  assets: z.object({
    lottie: z.object({
      build: z.string(),
      coding: z.string(),
      contact: z.string(),
    }),
  }),
  three: z.object({
    enabled: z.boolean(),
    pointCount: z.number().int().positive(),
    radius: z.number().positive(),
    pointSize: z.number().positive(),
    camera: z.object({
      position: z.tuple([z.number(), z.number(), z.number()]),
      fov: z.number().positive(),
    }),
    gradient: z.string(),
  }),
})

export type PortfolioData = z.infer<typeof portfolioDataSchema>
export type PortfolioNavItem = PortfolioData['nav'][number]
export type PortfolioExperience = PortfolioData['experiences'][number]
export type PortfolioProject = PortfolioData['projects'][number]
export type ThreeConfig = PortfolioData['three']
