import { GlassCard, SectionShell, SectionTitle } from '@/components/molecules/SectionShell'
import { SECTIONS } from '@/shared/constants'
import { joinWith } from '@/shared/utils'
import type { PortfolioData } from '@/shared/types/portfolio'

export function SectionExperience({
  experiences,
}: {
  experiences: PortfolioData['experiences']
}) {
  return (
    <SectionShell id={SECTIONS.experiences}>
      <SectionTitle>Experiences</SectionTitle>
      <ol className="space-y-4">
        {experiences.map((exp) => (
          <li key={exp.id}>
            <GlassCard>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm md:text-base">
                <strong className="pf-primary font-bold">{joinWith(exp.companies)}</strong>
                <span className="font-light text-white/40">•</span>
                <span className="font-semibold text-white">
                  {joinWith(exp.positions, ' / ')}
                </span>
                <span className="font-light text-white/40">•</span>
                <span className="font-normal text-white/70">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm font-normal leading-7 text-white">
                {exp.responsibilities.map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
              <div className="mt-4 space-y-1 text-sm font-normal text-white/75">
                {exp.techStacks.map((stack) => (
                  <p key={stack.title}>
                    <span className="pf-primary font-semibold">{stack.title}:</span>{' '}
                    <span className="font-normal text-white">{stack.keys}</span>
                  </p>
                ))}
              </div>
            </GlassCard>
          </li>
        ))}
      </ol>
    </SectionShell>
  )
}
