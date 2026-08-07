import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server'
import {
  MOCK_USERS,
  loginInputSchema,
  sessionSchema,
  type Session,
} from '@repo/shared/auth'
import { getServerEnv } from '@repo/config'

const SESSION_COOKIE = () => getServerEnv().AUTH_COOKIE_NAME

function toPublicSession(session: Session): Session {
  return sessionSchema.parse(session)
}

/** Re-apply latest mock permissions so demo sessions pick up new grants without re-login. */
function withFreshMockPermissions(session: Session): Session {
  const mock = MOCK_USERS.find((u) => u.id === session.user.id)
  if (!mock) return session
  const { password: _password, ...user } = mock
  return { ...session, user }
}

function writeSessionCookie(session: Session) {
  setCookie(SESSION_COOKIE(), JSON.stringify(session), {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export const getSessionFn = createServerFn({ method: 'GET' }).handler(async () => {
  const raw = getCookie(SESSION_COOKIE())
  if (!raw) return null
  try {
    const parsed = sessionSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) return null
    const session = withFreshMockPermissions(toPublicSession(parsed.data))
    // Persist refreshed permissions when mock catalog changed (e.g. customer:view).
    if (
      JSON.stringify(session.user.permissions) !==
      JSON.stringify(parsed.data.user.permissions)
    ) {
      writeSessionCookie(session)
    }
    return session
  } catch {
    return null
  }
})

export const loginFn = createServerFn({ method: 'POST' })
  .validator(loginInputSchema)
  .handler(async ({ data }) => {
    const found = MOCK_USERS.find(
      (user) => user.email === data.email && user.password === data.password,
    )
    if (!found) {
      throw new Error('Invalid email or password')
    }
    const { password: _password, ...user } = found
    const now = Date.now()
    const session: Session = {
      accessToken: `access_${user.id}_${now}`,
      refreshToken: `refresh_${user.id}_${now}`,
      expiresAt: now + 60 * 60 * 1000,
      user,
    }
    writeSessionCookie(session)
    return toPublicSession(session)
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  deleteCookie(SESSION_COOKIE())
  return { ok: true as const }
})

export const refreshSessionFn = createServerFn({ method: 'POST' }).handler(async () => {
  const current = await getSessionFn()
  if (!current) return null
  const now = Date.now()
  const session: Session = {
    ...withFreshMockPermissions(current),
    accessToken: `access_${current.user.id}_${now}`,
    refreshToken: `refresh_${current.user.id}_${now}`,
    expiresAt: now + 60 * 60 * 1000,
  }
  writeSessionCookie(session)
  return toPublicSession(session)
})
