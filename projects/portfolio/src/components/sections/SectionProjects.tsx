import { ArrowUpRight } from 'lucide-react'
import { GlassCard, SectionShell, SectionTitle } from '@/components/molecules/SectionShell'
import { SECTIONS } from '@/shared/constants'
import type { PortfolioData } from '@/shared/types/portfolio'

export function SectionProjects({
  projects,
  moreUrl,
}: {
  projects: PortfolioData['projects']
  moreUrl: string
}) {
  return (
    <SectionShell id={SECTIONS.projects}>
      <SectionTitle>Projects</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="group block"
          >
            <GlassCard className="h-full transition group-hover:border-[var(--pf-primary)]/45 group-hover:bg-slate-950/65">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-white">{project.title}</h3>
                <ArrowUpRight className="h-4 w-4 font-light text-white/50 transition group-hover:text-[var(--pf-primary)]" />
              </div>
              <p className="text-sm font-normal leading-7 text-white">{project.description}</p>
            </GlassCard>
          </a>
        ))}
      </div>
      <a
        href={moreUrl}
        target="_blank"
        rel="noreferrer"
        className="pf-primary mt-6 inline-flex items-center gap-2 text-sm font-semibold hover:text-[var(--pf-primary-soft)]"
      >
        More projects here
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </SectionShell>
  )
}
