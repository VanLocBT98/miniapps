# Business rules

1. **Booking number** must be unique.
2. **Booking status** enum:
   - `Draft`
   - `Confirmed`
   - `Ticketed`
   - `Cancelled`
   - `Completed`
3. **Cancelled** bookings cannot be edited.
4. **Completed** bookings are read-only.
5. **Payment must exist** before status can become `Ticketed`.
6. At least **one Passenger**.
7. At least **one Flight**.
8. Passenger **passport is required** for international flights (`bookingType` / flight rules).
9. **History** must record every update.

## Customer (Sprint 2)

1. **Customer Code** must be unique.
2. **Email** is optional.
3. **Phone** is optional.
4. **Passport Number** is required for international travelers.
5. Only **Active** customers can be selected during booking.
6. **Delete** soft-deletes the customer (`deleted_at` + `Inactive`) — row remains in DB.
7. Soft-deleted customers are hidden from list/detail (`deleted_at IS NULL`).

Enforce in Zod + service/domain helpers; surface clear UI errors + toasts.
