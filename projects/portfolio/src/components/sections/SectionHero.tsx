import { MapPin, Building2 } from 'lucide-react'
import { TypingEffect } from '@/components/atoms/TypingEffect'
import { SectionShell } from '@/components/molecules/SectionShell'
import { SECTIONS } from '@/shared/constants'
import type { PortfolioData } from '@/shared/types/portfolio'

export function SectionHero({
  profile,
  siteTitle,
}: {
  profile: PortfolioData['profile']
  siteTitle: string
}) {
  return (
    <SectionShell id={SECTIONS.home} className="pt-10 md:pt-14">
      <p className="pf-primary-soft text-[11px] font-bold uppercase tracking-[0.28em]">
        {siteTitle}
      </p>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="pf-text text-2xl font-light md:text-3xl">{profile.greeting}</span>
        <h1 className="pf-primary text-4xl font-bold leading-tight drop-shadow-sm md:text-5xl">
          {profile.name}
        </h1>
        <span className="pf-text-soft text-base font-normal md:text-lg">
          · aka {profile.nickname}
        </span>
      </div>

      <p className="pf-text-light mt-3 max-w-2xl text-base font-normal md:text-lg">
        {profile.headline}
      </p>

      <p className="pf-text mt-8 text-2xl font-light md:text-3xl">{profile.welcome}</p>
      <h2 className="pf-primary mt-2 text-3xl font-bold uppercase tracking-wide md:text-5xl">
        <TypingEffect roles={profile.roles} />
      </h2>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-white backdrop-blur-sm">
          <Building2 className="pf-primary h-4 w-4" aria-hidden />
          {profile.company}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-white backdrop-blur-sm">
          <MapPin className="pf-primary h-4 w-4" aria-hidden />
          {profile.location}
        </span>
      </div>
    </SectionShell>
  )
}
