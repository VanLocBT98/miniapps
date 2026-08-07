# Routes

## Booking

| Path | Page |
|------|------|
| `/booking` | Booking List |
| `/booking/new` | Create Booking |
| `/booking/:bookingId` | Booking Detail (Overview) |
| `/booking/:bookingId/passengers` | Passenger List |
| `/booking/:bookingId/flights` | Flights |
| `/booking/:bookingId/payment` | Payment |
| `/booking/:bookingId/documents` | Documents |
| `/booking/:bookingId/history` | History |

## Customer (Sprint 2)

| Path | Page |
|------|------|
| `/customer` | Customer List |
| `/customer/new` | Create Customer |
| `/customer/:customerId` | Customer Detail |
| `/customer/:customerId/edit` | Edit Customer |

## Notes

- Host mounts under the same paths (auth-gated via Main App).
- Standalone mini-app uses the same relative paths under its own router base.
- Legacy `/booking/calendar` is **out of current spec** (remove or keep as non-goal until product reintroduces it).
- Documents live as detail tab + `/booking/:bookingId/documents`.
- Customer module is a sibling surface under `/customer` (same `@repo/booking` package unless split later).
