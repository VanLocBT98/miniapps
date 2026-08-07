# State management

## Server state → TanStack Query

### Queries

- Booking List
- Booking Detail
- Passengers
- Flights
- Payment
- Timeline / History (as specified by API)

### Mutations

- Create Booking
- Update Booking
- Delete Booking
- Update Passenger
- Update Flight
- Update Payment

After success: toast + invalidate related queries.

## Client UI state → Zustand only

**Never** store server state in Zustand.

UI-only examples:

- Sidebar open
- Selected tab
- Filters (draft UI before apply, if needed)
- Theme / local layout prefs

Store: `projects/booking/src/shared/stores/ui.store.ts` (extend as needed).
