import { create } from 'zustand'
import {
  MOCK_USERS,
  loginInputSchema,
  sessionSchema,
  type AuthUser,
  type LoginInput,
  type Session,
} from '@repo/shared/auth'
import { STORAGE_KEYS } from '@repo/shared/constants'

function createSession(user: AuthUser): Session {
  const now = Date.now()
  return {
    accessToken: `access_${user.id}_${now}`,
    refreshToken: `refresh_${user.id}_${now}`,
    expiresAt: now + 60 * 60 * 1000,
    user,
  }
}

function readSession(): Session | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(STORAGE_KEYS.session)
  if (!raw) return null
  const parsed = sessionSchema.safeParse(JSON.parse(raw))
  return parsed.success ? parsed.data : null
}

function writeSession(session: Session | null) {
  if (typeof window === 'undefined') return
  if (!session) {
    window.localStorage.removeItem(STORAGE_KEYS.session)
    return
  }
  window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session))
}

type AuthState = {
  session: Session | null
  hydrated: boolean
  hydrate: () => void
  login: (input: LoginInput) => Promise<Session>
  logout: () => void
  refresh: () => Promise<Session | null>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  hydrated: false,
  hydrate: () => {
    set({ session: readSession(), hydrated: true })
  },
  login: async (input) => {
    const data = loginInputSchema.parse(input)
    await new Promise((r) => setTimeout(r, 200))
    const found = MOCK_USERS.find(
      (user) => user.email === data.email && user.password === data.password,
    )
    if (!found) {
      throw new Error('Invalid email or password')
    }
    const { password: _password, ...user } = found
    const session = createSession(user)
    writeSession(session)
    set({ session, hydrated: true })
    return session
  },
  logout: () => {
    writeSession(null)
    set({ session: null })
  },
  refresh: async () => {
    const current = get().session ?? readSession()
    if (!current) {
      set({ session: null, hydrated: true })
      return null
    }
    const session = createSession(current.user)
    writeSession(session)
    set({ session, hydrated: true })
    return session
  },
}))

export function getClientSession(): Session | null {
  return useAuthStore.getState().session ?? readSession()
}
