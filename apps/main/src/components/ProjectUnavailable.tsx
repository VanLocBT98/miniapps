import { Link } from '@tanstack/react-router'
import { Button, EmptyState } from '@repo/ui'

export function ProjectUnavailable({
  projectId,
  onRetry,
}: {
  projectId: string
  onRetry: () => void
}) {
  return (
    <div className="mx-auto max-w-lg p-8">
      <EmptyState
        title="Project unavailable"
        description={`We could not open “${projectId}”. It may be offline or not registered.`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={onRetry}>
              Retry
            </Button>
            <Link to="/">
              <Button variant="ghost">Return Home</Button>
            </Link>
          </div>
        }
      />
    </div>
  )
}
