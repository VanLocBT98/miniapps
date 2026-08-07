# Booking Module

## Goal

Develop a production-ready Booking module as an independently deployable Mini App.

The Booking module must work **standalone** and also be **mountable** into the Main SSR application.

This module represents an **airline / travel booking management** system.

Architecture must prioritize scalability, maintainability, and SSR compatibility.

## Objectives

- SSR compatible
- Streaming SSR ready
- SEO friendly
- Modular
- Type-safe
- Independent routing
- Independent API layer
- Independent state
- Shared UI components (`@repo/ui`)
- Lazy loaded

## Features

- Booking List
- Booking Detail
- Passenger Management
- Flight Information
- Payment Information
- Booking Timeline
- Booking History
- Booking Search
- Booking Filters
- **Customer Management** (Sprint 2 — CRUD; see `12-customer.md`)

## Package / paths

| Item | Value |
|------|--------|
| Package | `@repo/booking` |
| Code | `projects/booking` |
| Host base | `/booking` |
| Standalone | `pnpm dev:booking` |
| Living index | `../REQUIREMENTS.md` |
| Process log | `../CHANGELOG.md` |

## Doc index

| File | Topic |
|------|--------|
| `00-overview.md` | This file |
| `01-domain.md` | Domain model |
| `02-user-flow.md` | User flows |
| `03-routing.md` | Routes |
| `04-data-model.md` | Entities / fields |
| `05-api.md` | HTTP API contract |
| `06-ui.md` | Pages & components |
| `07-business-rules.md` | Business rules |
| `08-state-management.md` | Query + UI state |
| `09-ssr.md` | SSR / SEO |
| `10-testing.md` | Test plan |
| `11-todo.md` | Development order (current focus) |
| `12-customer.md` | Customer Management (Sprint 2) |
| `13-database.md` | Postgres customers DDL + local run |
