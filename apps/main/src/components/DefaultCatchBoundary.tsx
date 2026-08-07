import { Link } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { Button } from '@repo/ui'

export function DefaultCatchBoundary({ error, reset }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : 'Something went wrong'

  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-4 p-8">
      <p className="text-sm font-medium uppercase tracking-wide text-rose-400">Error</p>
      <h1 className="text-2xl font-semibold text-slate-50">We hit a snag</h1>
      <p className="text-slate-400">{message}</p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link to="/" className="inline-flex h-10 items-center rounded-md px-4 text-sm text-sky-400">
          Go home
        </Link>
      </div>
    </div>
  )
}
