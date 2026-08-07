import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  RouterProvider,
  useRouterState,
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { project } from '../project'
import { ProjectLayout } from '../layouts/ProjectLayout'
import {
  ENABLE_LEGACY_CALENDAR,
  bookingTabFromPathname,
} from '../shared/constants'
import { BookingDetailShell } from '../features/booking-detail'
import {
  bookingDetailQueryOptions,
  bookingFlightsQueryOptions,
  bookingHistoryQueryOptions,
  bookingPassengersQueryOptions,
  bookingPaymentQueryOptions,
  bookingDocumentsQueryOptions,
  bookingTimelineQueryOptions,
  bookingsQueryOptions,
} from '../shared/services/apis/apis'
import BookingListPage from '../pages/BookingListPage/index'
import BookingDetailPage from '../pages/BookingDetailPage/index'
import BookingNewPage from '../pages/BookingNewPage/index'
import PassengersPage from '../pages/PassengersPage/index'
import FlightsPage from '../pages/FlightsPage/index'
import PaymentPage from '../pages/PaymentPage/index'
import HistoryPage from '../pages/HistoryPage/index'
import DocumentsPage from '../pages/DocumentsPage/index'
import CalendarPage from '../pages/CalendarPage/index'
import CustomerListPage from '../pages/CustomerListPage/index'
import CustomerNewPage from '../pages/CustomerNewPage/index'
import CustomerDetailPage from '../pages/CustomerDetailPage/index'
import CustomerEditPage from '../pages/CustomerEditPage/index'

const queryClient = new QueryClient()

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-slate-950/80 p-6 text-slate-100">
      <header className="mb-6 flex flex-wrap items-center gap-4 border-b border-slate-800 pb-4">
        <strong>{project.name} (standalone)</strong>
        {project.navigation.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="text-sm text-sky-400 hover:underline"
          >
            {item.label}
          </Link>
        ))}
      </header>
      <ProjectLayout>
        <Outlet />
      </ProjectLayout>
    </div>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    window.location.replace('/booking')
    return null
  },
})

const listRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking',
  loader: () => queryClient.ensureQueryData(bookingsQueryOptions),
  component: BookingListPage,
})

const newRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking/new',
  component: BookingNewPage,
})

const detailLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking/$bookingId',
  loader: ({ params }) =>
    queryClient.ensureQueryData(bookingDetailQueryOptions(params.bookingId)),
  component: function BookingDetailLayout() {
    const { bookingId } = detailLayoutRoute.useParams()
    const pathname = useRouterState({ select: (s) => s.location.pathname })
    return (
      <BookingDetailShell
        bookingId={bookingId}
        active={bookingTabFromPathname(pathname)}
      >
        <Outlet />
      </BookingDetailShell>
    )
  },
})

const detailIndexRoute = createRoute({
  getParentRoute: () => detailLayoutRoute,
  path: '/',
  component: function BookingDetailIndex() {
    const { bookingId } = detailLayoutRoute.useParams()
    return <BookingDetailPage bookingId={bookingId} />
  },
})

const passengersRoute = createRoute({
  getParentRoute: () => detailLayoutRoute,
  path: '/passengers',
  loader: ({ params }) =>
    Promise.all([
      queryClient.ensureQueryData(bookingDetailQueryOptions(params.bookingId)),
      queryClient.ensureQueryData(
        bookingPassengersQueryOptions(params.bookingId),
      ),
    ]),
  component: function PassengersRoute() {
    const { bookingId } = detailLayoutRoute.useParams()
    return <PassengersPage bookingId={bookingId} />
  },
})

const flightsRoute = createRoute({
  getParentRoute: () => detailLayoutRoute,
  path: '/flights',
  loader: ({ params }) =>
    Promise.all([
      queryClient.ensureQueryData(bookingDetailQueryOptions(params.bookingId)),
      queryClient.ensureQueryData(bookingFlightsQueryOptions(params.bookingId)),
    ]),
  component: function FlightsRoute() {
    const { bookingId } = detailLayoutRoute.useParams()
    return <FlightsPage bookingId={bookingId} />
  },
})

const paymentRoute = createRoute({
  getParentRoute: () => detailLayoutRoute,
  path: '/payment',
  loader: ({ params }) =>
    Promise.all([
      queryClient.ensureQueryData(bookingDetailQueryOptions(params.bookingId)),
      queryClient.ensureQueryData(bookingPaymentQueryOptions(params.bookingId)),
    ]),
  component: function PaymentRoute() {
    const { bookingId } = detailLayoutRoute.useParams()
    return <PaymentPage bookingId={bookingId} />
  },
})

const documentsRoute = createRoute({
  getParentRoute: () => detailLayoutRoute,
  path: '/documents',
  loader: ({ params }) =>
    Promise.all([
      queryClient.ensureQueryData(bookingDetailQueryOptions(params.bookingId)),
      queryClient.ensureQueryData(
        bookingDocumentsQueryOptions(params.bookingId),
      ),
    ]),
  component: function DocumentsRoute() {
    const { bookingId } = detailLayoutRoute.useParams()
    return <DocumentsPage bookingId={bookingId} />
  },
})

const historyRoute = createRoute({
  getParentRoute: () => detailLayoutRoute,
  path: '/history',
  loader: ({ params }) =>
    Promise.all([
      queryClient.ensureQueryData(bookingDetailQueryOptions(params.bookingId)),
      queryClient.ensureQueryData(bookingHistoryQueryOptions(params.bookingId)),
      queryClient.ensureQueryData(
        bookingTimelineQueryOptions(params.bookingId),
      ),
    ]),
  component: function HistoryRoute() {
    const { bookingId } = detailLayoutRoute.useParams()
    return <HistoryPage bookingId={bookingId} />
  },
})

const detailRouteTree = detailLayoutRoute.addChildren([
  detailIndexRoute,
  passengersRoute,
  flightsRoute,
  paymentRoute,
  documentsRoute,
  historyRoute,
])

const customerListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer',
  component: CustomerListPage,
})

const customerNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/new',
  component: CustomerNewPage,
})

const customerDetailLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/$customerId',
  component: () => <Outlet />,
})

const customerDetailIndexRoute = createRoute({
  getParentRoute: () => customerDetailLayoutRoute,
  path: '/',
  component: function CustomerDetailIndex() {
    const { customerId } = customerDetailLayoutRoute.useParams()
    return <CustomerDetailPage customerId={customerId} />
  },
})

const customerEditRoute = createRoute({
  getParentRoute: () => customerDetailLayoutRoute,
  path: '/edit',
  component: function CustomerEditRoute() {
    const { customerId } = customerDetailLayoutRoute.useParams()
    return <CustomerEditPage customerId={customerId} />
  },
})

const customerRouteTree = customerDetailLayoutRoute.addChildren([
  customerDetailIndexRoute,
  customerEditRoute,
])

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking/calendar',
  loader: () => queryClient.ensureQueryData(bookingsQueryOptions),
  component: CalendarPage,
})

const children = ENABLE_LEGACY_CALENDAR
  ? [
      indexRoute,
      listRoute,
      newRoute,
      detailRouteTree,
      customerListRoute,
      customerNewRoute,
      customerRouteTree,
      calendarRoute,
    ]
  : [
      indexRoute,
      listRoute,
      newRoute,
      detailRouteTree,
      customerListRoute,
      customerNewRoute,
      customerRouteTree,
    ]

const routeTree = rootRoute.addChildren(children)

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function StandaloneApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
