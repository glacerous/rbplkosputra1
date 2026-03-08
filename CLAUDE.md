# CLAUDE.md — Kos Putra Friendly

Next.js 16 dormitory management system (kos/boarding house) for student housing with reservation, payment, complaint, and attendance management.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint
pnpm format       # Prettier (formats all files)
pnpm test:unit    # Vitest unit tests
pnpm test:e2e     # Playwright e2e tests
pnpm db:seed      # Seed database via prisma/raw-seed.ts
```

## Architecture

**App Router** with route groups:
- `(public)` — unauthenticated pages: `/login`, `/signup`, `/rooms`, `/403`
- `(admin)` — admin/owner dashboard: `/admin/**`
- `(user)` — authenticated user home: `/` (dynamic routing logic)

**API routes:**
- `/api/auth/[...nextauth]` — NextAuth handler
- `/api/public/**` — No role restriction
- `/api/admin/**` — ADMIN role only (enforced in middleware)

**Service layer** at `src/server/services/`:
- `room.service.ts`, `user.service.ts`, `admin.service.ts`
- `reservation.service.ts`, `payment.service.ts`, `lease.service.ts`
- All business logic lives here; API routes delegate to services

## Authentication

- NextAuth v4 with Credentials provider + JWT strategy
- Token includes `role` field (ADMIN | OWNER | CUSTOMER | CLEANER)
- Middleware (`src/middleware.ts`) enforces route protection:
  - `/admin/**` → requires ADMIN or OWNER role
  - `/api/admin/**` → requires ADMIN role
  - `/api/public/**` → no auth required
  - `/login`, `/403`, `/` → always public

## Database

Prisma + PostgreSQL (`@prisma/adapter-neon` for serverless, `@prisma/adapter-pg` for local).

Key models: `User`, `Room`, `Reservation`, `Payment`, `Transaction`, `Complaint`, `Attendance`, `Notification`

Enums:
- `Role`: ADMIN, OWNER, CUSTOMER, CLEANER
- `RoomStatus`: AVAILABLE, OCCUPIED, MAINTENANCE
- `ReservationStatus`: RESERVED, CHECKED_IN, CHECKED_OUT, CANCELLED
- `PaymentStatus`: PENDING, CONFIRMED, REJECTED
- `ComplaintStatus`: OPEN, IN_PROGRESS, RESOLVED

## Testing

- **Unit**: Vitest + `@testing-library/react` + `vitest-mock-extended`
  - Tests co-located at `__tests__/route.test.ts` next to API routes
- **E2E**: Playwright

Mock pattern for Prisma: use `vitest-mock-extended` to mock the Prisma client.

## Key Patterns

**Home page routing** (`src/app/(user)/page.tsx`):
Client component that renders one of four views based on session + active reservation state:
1. `PublicLandingView` — no session
2. `LoggedInNoRoomView` — authenticated, no active reservation
3. `PendingPaymentView` — reservation status is `RESERVED`
4. `UserDashboardView` — reservation status is `CHECKED_IN`

**Validation**: Zod schemas for all API inputs.

**UI**: Tailwind CSS v4 + shadcn/ui (Radix UI) + `react-hook-form` with `@hookform/resolvers/zod`.

**Images**: Cloudinary for payment proof uploads.

**Email**: Resend for transactional email.

**Logging**: Pino.
