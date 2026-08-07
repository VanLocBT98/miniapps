import { Link } from '@tanstack/react-router'
import { EmptyState, Button } from '@repo/ui'

export function NotFound() {
  return (
    <div className="p-8">
      <EmptyState
        title="Page not found"
        description="The route you requested does not exist in the Main App or any installed mini app."
        action={
          <Link to="/">
            <Button>Back to home</Button>
          </Link>
        }
      />
    </div>
  )
}
