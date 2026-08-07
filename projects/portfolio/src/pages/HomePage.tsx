import { useSuspenseQuery } from '@tanstack/react-query'
import { PortfolioHeader } from '@/components/molecules/PortfolioHeader'
import { ThreeBackground } from '@/components/organisms/ThreeBackground'
import { SectionHero } from '@/components/sections/SectionHero'
import { SectionSummary } from '@/components/sections/SectionSummary'
import { SectionSkills } from '@/components/sections/SectionSkills'
import { SectionExperience } from '@/components/sections/SectionExperience'
import { SectionProjects } from '@/components/sections/SectionProjects'
import { SectionContact } from '@/components/sections/SectionContact'
import { portfolioQueryOptions } from '@/shared/services/apis/apis'
import '@/styles/portfolio.css'

export default function HomePage() {
  const { data } = useSuspenseQuery(portfolioQueryOptions)

  return (
    <div className="portfolio-root relative min-h-screen text-white">
      <ThreeBackground config={data.three} />
      <div className="relative z-10">
        <PortfolioHeader nav={data.nav} siteTitle={data.meta.siteTitle} />
        <main className="mx-auto max-w-5xl px-4 pb-8">
          <SectionHero profile={data.profile} siteTitle={data.meta.siteTitle} />
          <SectionSummary profile={data.profile} socials={data.socials} />
          <SectionSkills techStacks={data.techStacks} />
          <SectionExperience experiences={data.experiences} />
          <SectionProjects
            projects={data.projects}
            moreUrl={data.profile.moreProjectsUrl}
          />
          <SectionContact contacts={data.contacts} />
        </main>
      </div>
    </div>
  )
}
