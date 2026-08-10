import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { loginInputSchema } from '@repo/shared/auth'
import { useIsClient } from '@repo/shared/hooks'
import { Button, Card, Input, toast } from '@repo/ui'
import { loginFn } from '~/lib/auth'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [pending, setPending] = useState(false)
  // Marks client handlers as attached (dev hydration can race native form submit).
  const hydrated = useIsClient()

  function submitLogin() {
    const parsed = loginInputSchema.safeParse({ email, password })
    if (!parsed.success) {
      const fieldErrors: { email?: string; password?: string } = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (key === 'email' || key === 'password') {
          fieldErrors[key] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setPending(true)
    void loginFn({ data: parsed.data })
      .then(async () => {
        toast({ title: 'Signed in', variant: 'success' })
        await router.invalidate()
        await router.navigate({ to: '/dashboard' })
      })
      .catch((error: unknown) => {
        toast({
          title: 'Login failed',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'error',
        })
      })
      .finally(() => setPending(false))
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <Card
        className="w-full"
        title="Sign in"
        description="Mock auth with roles and permissions. Replace with a real API later."
      >
        <form
          className="space-y-4"
          data-hydrated={hydrated ? 'true' : 'false'}
          // Avoid native GET navigation if the user submits before React hydrates.
          method="post"
          action="#"
          onSubmit={(event) => {
            event.preventDefault()
            submitLogin()
          }}
        >
          <Input
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="username"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />
          <Button type="submit" className="w-full" disabled={pending || !hydrated}>
            {pending ? 'Signing in…' : 'Continue'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
