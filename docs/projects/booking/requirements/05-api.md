# APIs

Base path (logical): `/bookings`  
(Wire to mock server fns / fetch client under `projects/booking/src/shared/services/apis`.)

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/bookings` | List (search + filters via query) |
| `GET` | `/bookings/{id}` | Detail |
| `POST` | `/bookings` | Create |
| `PUT` | `/bookings/{id}` | Update |
| `DELETE` | `/bookings/{id}` | Delete |
| `GET` | `/bookings/{id}/history` | History |
| `GET` | `/bookings/{id}/passengers` | Passengers |
| `GET` | `/bookings/{id}/flights` | Flights |
| `GET` | `/bookings/{id}/payment` | Payment |
| `GET` | `/bookings/{id}/documents` | Documents |

## Customer endpoints (Sprint 2)

Base path (logical): `/customers`

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/customers` | List (search + filters + pagination + sort) |
| `GET` | `/customers/{id}` | Detail |
| `POST` | `/customers` | Create |
| `PUT` | `/customers/{id}` | Update |
| `DELETE` | `/customers/{id}` | Delete (or soft-deactivate per rules) |

## Envelope

Every response:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {}
}
```

On failure: `success: false`, `data: null`, `error` populated, `meta` optional.

## Notes

- Validate I/O with Zod.
- Query keys in `query-keys.ts`; options in `apis.ts` (or feature folders later).
- Passenger / Flight / Payment **mutations** implied by UI flows — add endpoints when implementing those modules (document here when added).
