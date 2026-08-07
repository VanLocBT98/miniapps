import { ExternalLink } from 'lucide-react'
import { Button } from '@repo/ui'
import { SocialIconView } from '@/components/atoms/icon-map'
import { GlassCard } from '@/components/molecules/SectionShell'
import type { PortfolioData } from '@/shared/types/portfolio'

export function SectionSummary({
  profile,
  socials,
}: {
  profile: PortfolioData['profile']
  socials: PortfolioData['socials']
}) {
  return (
    <GlassCard className="space-y-5">
      {profile.summary.map((paragraph) => (
        <p
          key={paragraph.slice(0, 24)}
          className="pf-text text-sm font-normal leading-7 md:text-[15px] md:leading-8"
        >
          {paragraph}
        </p>
      ))}
      {profile.currentlyLearning.length > 0 ? (
        <p className="pf-text-light text-sm font-normal">
          <span className="pf-primary font-semibold">Currently learning:</span>{' '}
          <span className="font-medium text-white">{profile.currentlyLearning.join(', ')}</span>
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
          <Button className="bg-[var(--pf-primary)] font-semibold text-slate-950 hover:bg-[var(--pf-primary-soft)]">
            Resume
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
        <a href={profile.websiteUrl} target="_blank" rel="noreferrer">
          <Button
            variant="secondary"
            className="border border-white/20 bg-white/10 font-medium text-white hover:bg-white/15"
          >
            Live site
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
        <a href={profile.moreProjectsUrl} target="_blank" rel="noreferrer">
          <Button
            variant="ghost"
            className="font-medium text-white hover:bg-white/10 hover:text-white"
          >
            GitHub
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
        <div className="flex gap-2">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:border-[var(--pf-primary)]/70 hover:text-[var(--pf-primary-soft)]"
            >
              <SocialIconView icon={social.icon} className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
