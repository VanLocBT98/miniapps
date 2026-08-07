# Data model

## Booking

| Field | Notes |
|-------|--------|
| `id` | string |
| `bookingNumber` | unique |
| `status` | see `07-business-rules.md` |
| `bookingType` | e.g. domestic / international |
| `createdDate` | ISO datetime |
| `updatedDate` | ISO datetime |

## Passenger

| Field | Notes |
|-------|--------|
| `id` | |
| `firstName` | |
| `lastName` | |
| `gender` | |
| `birthday` | |
| `passportNumber` | required for international (rules) |

## Flight

| Field | Notes |
|-------|--------|
| `id` | |
| `airline` | |
| `flightNumber` | |
| `departureAirport` | |
| `arrivalAirport` | |
| `departureTime` | |
| `arrivalTime` | |

## Payment

| Field | Notes |
|-------|--------|
| `id` | |
| `amount` | |
| `currency` | |
| `paymentMethod` | |
| `paymentStatus` | |

## Timeline

| Field | Notes |
|-------|--------|
| `id` | |
| `action` | |
| `user` | actor |
| `createdDate` | |

## Document

| Field | Notes |
|-------|--------|
| `id` | |
| `type` | |
| `url` | |

## Customer (Sprint 2)

| Field | Notes |
|-------|--------|
| `id` | |
| `customerCode` | unique |
| `customerType` | `Individual` \| `Company` |
| `fullName` | |
| `gender` | |
| `birthday` | |
| `nationality` | |

### Contact

| Field | Notes |
|-------|--------|
| `phone` | optional |
| `email` | optional |
| `address` | |

### Travel

| Field | Notes |
|-------|--------|
| `passportNumber` | required for international travelers (rules) |
| `passportExpiredDate` | |
| `passportCountry` | |
| `identityNumber` | optional |

### Bank

| Field | Notes |
|-------|--------|
| `bankName` | |
| `accountNumber` | |
| `accountName` | |
| `swiftCode` | optional |

### Management

| Field | Notes |
|-------|--------|
| `owner` | |
| `department` | |
| `source` | `Manual` \| `Imported` \| `Booking` \| `API` \| `CRM` |

### System

| Field | Notes |
|-------|--------|
| `status` | `Active` \| `Inactive` |
| `createdBy` | |
| `createdDate` | ISO datetime |
| `updatedBy` | |
| `updatedDate` | ISO datetime |

## Implementation

- Zod schemas in `projects/booking/src/shared/types/`
- Mappers separate from UI
- Prefer branded / typed ids where helpful
