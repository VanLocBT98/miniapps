import { createProject } from '@repo/shared/project'
import { ProjectLayout } from './layouts/ProjectLayout'
import { ProjectProviders } from './components/ProjectProviders'
import { en } from './shared/locales/en'

export const project = createProject({
  id: 'dashboard',
  name: 'Dashboard',
  version: '0.1.0',
  basePath: '/dashboard',
  permissions: ["dashboard:view","dashboard:analytics"],
  navigation: [
  {
    "id": "dashboard-home",
    "label": "Home",
    "path": "/dashboard",
    "icon": "LayoutDashboard",
    "order": 10,
    "permissions": [
      "dashboard:view"
    ]
  },
  {
    "id": "dashboard-analytics",
    "label": "Analytics",
    "path": "/dashboard/analytics",
    "icon": "ChartColumn",
    "order": 11,
    "permissions": [
      "dashboard:analytics"
    ]
  },
  {
    "id": "dashboard-profile",
    "label": "Profile",
    "path": "/dashboard/profile",
    "icon": "User",
    "order": 12,
    "permissions": [
      "dashboard:view"
    ]
  }
],
  Layout: ProjectLayout,
  Providers: ProjectProviders,
  translations: { en },
  pages: [
    {
      id: 'home',
      path: '/',
      title: 'Dashboard Home',
      permissions: ['dashboard:view'],
      component: () => import('./pages/HomePage'),
    },
    {
      id: 'analytics',
      path: '/analytics',
      title: 'Analytics',
      permissions: ['dashboard:analytics'],
      component: () => import('./pages/AnalyticsPage'),
    },
    {
      id: 'profile',
      path: '/profile',
      title: 'Profile',
      permissions: ['dashboard:view'],
      component: () => import('./pages/ProfilePage'),
    },
  ],
})

export default project
