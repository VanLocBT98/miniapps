import { ContactIconView } from '@/components/atoms/icon-map'
import { GlassCard, SectionShell, SectionTitle } from '@/components/molecules/SectionShell'
import { SECTIONS } from '@/shared/constants'
import type { PortfolioData } from '@/shared/types/portfolio'

export function SectionContact({ contacts }: { contacts: PortfolioData['contacts'] }) {
  return (
    <SectionShell id={SECTIONS.contact} className="pb-24">
      <SectionTitle>Contact</SectionTitle>
      <ul className="grid gap-3 sm:grid-cols-2">
        {contacts.map((contact) => (
          <li key={contact.id}>
            <a href={contact.href} className="block">
              <GlassCard className="flex items-center gap-3 p-4 transition hover:border-[var(--pf-primary)]/45">
                <ContactIconView icon={contact.icon} className="pf-primary h-5 w-5" />
                <span>
                  <span className="block text-xs font-medium uppercase tracking-wide text-white/60">
                    {contact.label}
                  </span>
                  <span className="font-semibold text-white">{contact.value}</span>
                </span>
              </GlassCard>
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}
