import { z } from 'zod'

export const roleSchema = z.enum(['admin', 'manager', 'viewer'])
export type Role = z.infer<typeof roleSchema>

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  roles: z.array(roleSchema),
  permissions: z.array(z.string()),
})

export type AuthUser = z.infer<typeof userSchema>

export const sessionSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number(),
  user: userSchema,
})

export type Session = z.infer<typeof sessionSchema>

export const loginInputSchema = z.object({
  email: z.email(),
  password: z.string().min(4),
})

export type LoginInput = z.infer<typeof loginInputSchema>

/** Demo users — replace with real API later */
export const MOCK_USERS: Array<AuthUser & { password: string }> = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin',
    name: 'Admin User',
    roles: ['admin'],
    permissions: [
      'portfolio:view',
      'dashboard:view',
      'dashboard:analytics',
      'admin:users',
      'admin:roles',
      'admin:permissions',
      'booking:view',
      'booking:manage',
      'customer:view',
      'customer:manage',
    ],
  },
  {
    id: '2',
    email: 'manager@example.com',
    password: 'manager',
    name: 'Manager User',
    roles: ['manager'],
    permissions: [
      'portfolio:view',
      'dashboard:view',
      'dashboard:analytics',
      'booking:view',
      'booking:manage',
      'customer:view',
      'customer:manage',
    ],
  },
  {
    id: '3',
    email: 'viewer@example.com',
    password: 'viewer',
    name: 'Viewer User',
    roles: ['viewer'],
    permissions: [
      'portfolio:view',
      'dashboard:view',
      'booking:view',
      'customer:view',
    ],
  },
]

export function hasPermission(
  user: AuthUser | null | undefined,
  permission: string,
): boolean {
  if (!user) return false
  return user.permissions.includes(permission)
}

export function hasAnyPermission(
  user: AuthUser | null | undefined,
  permissions: string[],
): boolean {
  if (!user) return false
  if (permissions.length === 0) return true
  return permissions.some((p) => user.permissions.includes(p))
}

export function hasRole(user: AuthUser | null | undefined, role: Role): boolean {
  if (!user) return false
  return user.roles.includes(role)
}
