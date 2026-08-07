import type { ReactNode } from 'react'
import { ToastViewport } from '@repo/ui'

/** Project-local providers — toast viewport for standalone + host mount. */
export function ProjectProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastViewport />
    </>
  )
}
