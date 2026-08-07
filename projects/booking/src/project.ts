import { createProject } from '@repo/shared/project'
import { ProjectLayout } from './layouts/ProjectLayout'
import { ProjectProviders } from './components/ProjectProviders'
import { ENABLE_LEGACY_CALENDAR } from './shared/constants'
import { en } from './shared/locales/en'

const calendarNav = ENABLE_LEGACY_CALENDAR
  ? [
      {
        id: 'booking-calendar',
        label: 'Calendar',
        path: '/booking/calendar',
        icon: 'Calendar',
        order: 32,
        permissions: ['booking:view'],
      },
    ]
  : []

export const project = createProject({
  id: 'booking',
  name: 'Booking',
  version: '0.2.0',
  basePath: '/booking',
  permissions: [
    'booking:view',
    'booking:manage',
    'customer:view',
    'customer:manage',
  ],
  navigation: [
    {
      id: 'booking-list',
      label: 'Bookings',
      path: '/booking',
      icon: 'CalendarCheck',
      order: 30,
      permissions: ['booking:view'],
    },
    {
      id: 'customer-list',
      label: 'Customers',
      path: '/customer',
      icon: 'Users',
      order: 35,
      permissions: ['customer:view'],
    },
    ...calendarNav,
  ],
  Layout: ProjectLayout,
  Providers: ProjectProviders,
  translations: { en },
  pages: [
    {
      id: 'list',
      path: '/',
      title: 'Booking List',
      permissions: ['booking:view'],
      component: () => import('./pages/BookingListPage/index'),
    },
    {
      id: 'new',
      path: '/new',
      title: 'New Booking',
      permissions: ['booking:manage'],
      component: () => import('./pages/BookingNewPage/index'),
    },
    {
      id: 'detail',
      path: '/$bookingId',
      title: 'Booking Detail',
      permissions: ['booking:view'],
      component: () => import('./pages/BookingDetailPage/index'),
    },
    {
      id: 'passengers',
      path: '/$bookingId/passengers',
      title: 'Passengers',
      permissions: ['booking:view'],
      component: () => import('./pages/PassengersPage/index'),
    },
    {
      id: 'flights',
      path: '/$bookingId/flights',
      title: 'Flights',
      permissions: ['booking:view'],
      component: () => import('./pages/FlightsPage/index'),
    },
    {
      id: 'payment',
      path: '/$bookingId/payment',
      title: 'Payment',
      permissions: ['booking:view'],
      component: () => import('./pages/PaymentPage/index'),
    },
    {
      id: 'documents',
      path: '/$bookingId/documents',
      title: 'Documents',
      permissions: ['booking:view'],
      component: () => import('./pages/DocumentsPage/index'),
    },
    {
      id: 'history',
      path: '/$bookingId/history',
      title: 'History',
      permissions: ['booking:view'],
      component: () => import('./pages/HistoryPage/index'),
    },
    ...(ENABLE_LEGACY_CALENDAR
      ? [
          {
            id: 'calendar',
            path: '/calendar',
            title: 'Calendar (legacy)',
            permissions: ['booking:view' as const],
            component: () => import('./pages/CalendarPage/index'),
          },
        ]
      : []),
    {
      id: 'customer-list',
      path: '/customer',
      title: 'Customers',
      permissions: ['customer:view'],
      component: () => import('./pages/CustomerListPage/index'),
    },
    {
      id: 'customer-new',
      path: '/customer/new',
      title: 'New Customer',
      permissions: ['customer:manage'],
      component: () => import('./pages/CustomerNewPage/index'),
    },
    {
      id: 'customer-detail',
      path: '/customer/$customerId',
      title: 'Customer Detail',
      permissions: ['customer:view'],
      component: () => import('./pages/CustomerDetailPage/index'),
    },
    {
      id: 'customer-edit',
      path: '/customer/$customerId/edit',
      title: 'Edit Customer',
      permissions: ['customer:manage'],
      component: () => import('./pages/CustomerEditPage/index'),
    },
  ],
})

export default project
