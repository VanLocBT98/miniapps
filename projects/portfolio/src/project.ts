import { createProject } from '@repo/shared/project'
import { ProjectLayout } from './layouts/ProjectLayout'
import { ProjectProviders } from './components/ProjectProviders'
import { getPortfolioData } from './shared/services/apis/apis'

const data = getPortfolioData()

export const project = createProject({
  id: 'portfolio',
  name: data.meta.siteTitle,
  version: data.meta.version,
  basePath: '/portfolio',
  permissions: ['portfolio:view'],
  // Hidden from sidebar; still reachable at /portfolio
  navigation: [],
  Layout: ProjectLayout,
  Providers: ProjectProviders,
  translations: {
    en: {
      title: data.meta.siteTitle,
      loading: 'Loading portfolio…',
    },
  },
  pages: [
    {
      id: 'home',
      path: '/',
      title: `${data.meta.siteTitle} · ${data.profile.fullName}`,
      permissions: [],
      component: () => import('./pages/HomePage'),
    },
  ],
})

export default project
