import { useState } from 'react'
import { ArrowLeft, Menu, X } from 'lucide-react'
import { Button } from '@repo/ui'
import type { PortfolioNavItem } from '@/shared/types/portfolio'
import { scrollToHash } from '@/shared/utils'

export function PortfolioHeader({
  nav,
  siteTitle,
}: {
  nav: PortfolioNavItem[]
  siteTitle: string
}) {
  const [open, setOpen] = useState(false)

  const go = (hash: string) => {
    scrollToHash(hash)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1020]/55 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <a
            href="/"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Back to platform home"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Platform</span>
          </a>
          <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden />
          <button
            type="button"
            className="pf-primary truncate text-sm font-bold tracking-wide"
            onClick={() => go(nav[0]?.hash ?? 'sec-home')}
          >
            {siteTitle}
          </button>
        </div>
        <nav className="hidden gap-1 md:flex" aria-label="Portfolio sections">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
              onClick={() => go(item.hash)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      {open ? (
        <nav
          className="border-t border-white/10 bg-[#0b1020]/80 px-4 py-3 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            <li>
              <a
                href="/"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to platform
              </a>
            </li>
            {nav.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-white hover:bg-white/10"
                  onClick={() => go(item.hash)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
