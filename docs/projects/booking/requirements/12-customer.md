# Customer Management (Sprint 2)

## Goal

Introduce a Customer Management module for storing reusable customer profiles.

Customers represent people or organizations that frequently make bookings.

This module centralizes passenger information, banking details, and ownership metadata, allowing future bookings to reuse existing customer records.

---

## Features (Sprint 2)

- Customer List
- Customer Detail
- Create Customer
- Update Customer
- Delete Customer
- Search Customer
- Customer Status

## Features (Future — not Sprint 2)

- Customer Timeline
- Customer Booking History
- Loyalty
- Documents
- Notes
- Attachments
- Audit Log
- Customer Merge
- Customer tags
- CRM integration
- Duplicate detection

---

## Scope

Sprint 2 only includes **CRUD** functionality.

Out of scope: customer tags, loyalty programs, CRM integration, duplicate detection, audit history, timeline, booking history.

---

## Customer Information

### General

- Customer Code
- Customer Type: `Individual` | `Company`
- Full Name
- Gender
- Birthday
- Nationality

### Travel Information

Only information required for airline booking.

- Passport Number
- Passport Expired Date
- Passport Country
- Identity Number (optional)

### Contact

- Phone Number
- Email
- Address

### Bank Information

- Bank Name
- Account Number
- Account Name
- Swift Code (optional)

### Internal Management

- Owner
- Department
- Source: `Manual` | `Imported` | `Booking` | `API` | `CRM`

### Status

- `Active`
- `Inactive`

---

## Permissions (suggested)

- `customer:view`
- `customer:manage`

See also: `03-routing.md`, `04-data-model.md`, `06-ui.md`, `07-business-rules.md`, `05-api.md`.
