import { GlassCard, SectionShell, SectionTitle } from '@/components/molecules/SectionShell'
import { SECTIONS } from '@/shared/constants'
import type { PortfolioData } from '@/shared/types/portfolio'

export function SectionSkills({ techStacks }: { techStacks: PortfolioData['techStacks'] }) {
  return (
    <SectionShell id={SECTIONS.skills}>
      <SectionTitle>My Tech Stacks</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        {techStacks.map((stack) => (
          <GlassCard key={stack.title} className="p-4">
            <h3 className="pf-primary mb-3 text-sm font-bold uppercase tracking-wide">
              {stack.title}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {stack.keys.map((key) => (
                <li
                  key={key}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white"
                >
                  {key}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
    </SectionShell>
  )
}
