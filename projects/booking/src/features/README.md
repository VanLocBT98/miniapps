# Booking features

Domain-aligned feature modules. Cross-feature imports go through each feature's public `index.ts` only.

| Folder | Domain |
|--------|--------|
| `booking-list` | List + search + filters + table + pagination |
| `booking-detail` | Detail shell + tabs host |
| `passengers` | Passenger management |
| `flights` | Flight information |
| `payment` | Payment |
| `timeline` | Timeline events |
| `history` | Booking history |
| `documents` | Documents |

Pages under `src/pages/<PageName>/index.tsx` stay thin and compose these modules. Shared reusable cards live in `src/components/molecules/`.
