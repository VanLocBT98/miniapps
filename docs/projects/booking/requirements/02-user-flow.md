# User Flow

```
User opens Booking
        ↓
  Booking List
        ↓
     Search / Filters
        ↓
  Select Booking
        ↓
  Booking Detail
        ↓
       Tabs
  - Overview
  - Passengers
  - Flights
  - Payment
  - History
  - Documents
        ↓
     Update
        ↓
      Save
        ↓
      Toast
        ↓
 Invalidate Cache (TanStack Query)
        ↓
  Refresh Detail
```

## Notes

- List is the default entry (`/booking`).
- Detail tabs may map to nested routes (see `03-routing.md`) or client tabs — prefer nested routes for deep-link + SSR SEO where useful.
- After mutation: toast → invalidate related queries → detail reflects fresh data.

## Customer (Sprint 2)

```
User opens Customers (/customer)
        ↓
  Customer List (search / filter / paginate)
        ↓
  Create (/customer/new)  OR  Select customer
        ↓
  Customer Detail (/customer/:id)
        ↓
  Edit (/customer/:id/edit)  OR  Delete (confirm)
        ↓
  Toast → invalidate → refresh list/detail
```
