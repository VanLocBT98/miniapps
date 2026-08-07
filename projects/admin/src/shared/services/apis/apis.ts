import { queryOptions } from '@tanstack/react-query'
import { adminKeys } from './query-keys'

export type AdminUser = { id: string; name: string; email: string; role: string }
export type AdminRole = { id: string; name: string; permissions: string[] }

const users: AdminUser[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: '2', name: 'Manager User', email: 'manager@example.com', role: 'manager' },
  { id: '3', name: 'Viewer User', email: 'viewer@example.com', role: 'viewer' },
]

const roles: AdminRole[] = [
  { id: 'admin', name: 'Admin', permissions: ['*'] },
  { id: 'manager', name: 'Manager', permissions: ['dashboard:view', 'booking:manage'] },
  { id: 'viewer', name: 'Viewer', permissions: ['dashboard:view', 'booking:view'] },
]

export const usersQueryOptions = queryOptions({
  queryKey: adminKeys.list({ type: 'users' }),
  queryFn: async () => users,
})

export const rolesQueryOptions = queryOptions({
  queryKey: adminKeys.list({ type: 'roles' }),
  queryFn: async () => roles,
})

export const permissionsQueryOptions = queryOptions({
  queryKey: adminKeys.list({ type: 'permissions' }),
  queryFn: async () => [
    'dashboard:view',
    'dashboard:analytics',
    'admin:users',
    'admin:roles',
    'admin:permissions',
    'booking:view',
    'booking:manage',
  ],
})
