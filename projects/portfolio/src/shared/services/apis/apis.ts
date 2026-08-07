import raw from '@/shared/data/portfolio.json'
import { portfolioDataSchema, type PortfolioData } from '@/shared/types/portfolio'
import { portfolioKeys } from './query-keys'
import { queryOptions } from '@tanstack/react-query'

let cached: PortfolioData | null = null

export function getPortfolioData(): PortfolioData {
  if (cached) return cached
  cached = portfolioDataSchema.parse(raw)
  return cached
}

export const portfolioQueryOptions = queryOptions({
  queryKey: portfolioKeys.detail('main'),
  queryFn: async () => getPortfolioData(),
  staleTime: Infinity,
})
