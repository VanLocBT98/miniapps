import type { ReactNode } from 'react'

export function SectionShell({
  id,
  children,
  className = '',
}: {
  id: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`scroll-mt-24 py-12 md:py-16 ${className}`}>
      {children}
    </section>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="pf-text-bold mb-8 text-3xl tracking-tight drop-shadow-sm md:text-4xl">
      {children}
    </h2>
  )
}

export function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-white/15 bg-slate-950/50 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  )
}
