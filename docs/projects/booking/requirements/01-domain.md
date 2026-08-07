# Domain

## Tree

```
Booking
├── Booking List
├── Booking Detail
├── Passenger
├── Flight
├── Payment
├── Timeline
├── History
└── Documents

Customer (Sprint 2)
├── Customer List
├── Customer Detail
├── Create / Edit
└── Delete / Soft deactivate
```

## Relationships

```
Booking
├── has many Passengers
├── has many Flights
├── has one Payment
├── has many Timeline Events
├── has many History entries
└── has many Documents

Customer
├── reusable profile for future bookings
└── may relate to many Bookings (enforced on delete)
```
