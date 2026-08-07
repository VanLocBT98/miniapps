import { hasPermission, type AuthUser } from '@repo/shared/auth'

export function canAccess(user: AuthUser | null | undefined, permission: string) {
  return hasPermission(user, permission)
}
