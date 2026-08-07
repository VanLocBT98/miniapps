import { createProject } from '@repo/shared/project'
import { ProjectLayout } from './layouts/ProjectLayout'
import { ProjectProviders } from './components/ProjectProviders'
import { en } from './shared/locales/en'

export const project = createProject({
  id: 'admin',
  name: 'Admin',
  version: '0.1.0',
  basePath: '/admin',
  permissions: ["admin:users","admin:roles","admin:permissions"],
  navigation: [
  {
    "id": "admin-users",
    "label": "Users",
    "path": "/admin/users",
    "icon": "Users",
    "order": 20,
    "permissions": [
      "admin:users"
    ]
  },
  {
    "id": "admin-roles",
    "label": "Roles",
    "path": "/admin/roles",
    "icon": "Shield",
    "order": 21,
    "permissions": [
      "admin:roles"
    ]
  },
  {
    "id": "admin-permissions",
    "label": "Permissions",
    "path": "/admin/permissions",
    "icon": "KeyRound",
    "order": 22,
    "permissions": [
      "admin:permissions"
    ]
  }
],
  Layout: ProjectLayout,
  Providers: ProjectProviders,
  translations: { en },
  pages: [
    {
      id: 'users',
      path: '/users',
      title: 'Users',
      permissions: ['admin:users'],
      component: () => import('./pages/UsersPage'),
    },
    {
      id: 'roles',
      path: '/roles',
      title: 'Roles',
      permissions: ['admin:roles'],
      component: () => import('./pages/RolesPage'),
    },
    {
      id: 'permissions',
      path: '/permissions',
      title: 'Permissions',
      permissions: ['admin:permissions'],
      component: () => import('./pages/PermissionsPage'),
    },
  ],
})

export default project
