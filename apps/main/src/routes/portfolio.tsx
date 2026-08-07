import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'
import { Loading } from '@repo/ui'
import { portfolioQueryOptions, getPortfolioData } from '@repo/portfolio/apis'
import { project as portfolio } from '@repo/portfolio'
import { ProjectPage } from '~/components/ProjectPage'
import '@repo/portfolio/styles.css'

const seo = getPortfolioData()

export const Route = createFileRoute('/portfolio')({
  head: () => ({
    meta: [
      { title: `${seo.meta.siteTitle} · ${seo.profile.fullName}` },
      {
        name: 'description',
        content: `${seo.profile.headline}. Currently at ${seo.profile.company}, ${seo.profile.location}.`,
      },
      {
        name: 'author',
        content: seo.profile.fullName,
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(portfolioQueryOptions),
  component: PortfolioRoute,
})

function PortfolioRoute() {
  const page = portfolio.pages.find((item) => item.id === 'home')
  if (!page) throw new Error('Portfolio home page missing')

  const Page = lazy(() => page.component())

  return (
    <ProjectPage
      project={portfolio}
      Page={() => (
        <Suspense fallback={<Loading label="Loading portfolio…" />}>
          <Page />
        </Suspense>
      )}
    />
  )
}
