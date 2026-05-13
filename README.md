# ticktock — Timesheet Dashboard

A small SaaS-style timesheet management app: log in, browse weekly timesheets, drill into a week, and add / edit / delete entries via a modal.

## Setup

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

The app expects a `NEXTAUTH_SECRET` env var. A development default is committed in `.env.local` so it works out of the box; before deploying, replace it with a real secret (`openssl rand -base64 32`).

### Demo credentials

| Email      | Password     |
| ---------- | ------------ |
| `test@dev.com` | `testing123` |

### Useful scripts

| Script             | Purpose                              |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the Next.js dev server         |
| `npm run build`    | Production build                     |
| `npm run start`    | Run the production build             |
| `npm run lint`     | ESLint                               |
| `npm test`         | Jest + Testing Library               |
| `npm run test:watch` | Jest in watch mode                  |

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** for styling, **Inter** via `next/font/google`
- **next-auth** (Credentials provider, JWT session) for login
- **react-hook-form** + **zod** for form state and validation
- **date-fns** for week math and formatting
- **lucide-react** for icons
- **Jest** + **@testing-library/react** for tests

## Project structure

```
src/
  app/
    layout.tsx                 # Root layout, Inter font, SessionProvider
    page.tsx                   # /  → redirect to /login or /dashboard
    login/page.tsx             # Split-screen login
    dashboard/
      layout.tsx               # Header + footer shell
      page.tsx                 # Timesheets list (filter, sort, paginate)
      [weekId]/page.tsx        # Week detail with day groups
    api/
      auth/[...nextauth]/      # NextAuth handler
      timesheets/              # REST routes for timesheets + entries
  components/
    ui/                        # Button, Input, Modal, Pagination, etc.
    layout/                    # Header, Footer, UserMenu
    login/LoginForm.tsx
    timesheets/                # Filters, table, day rows, modal
    providers.tsx              # Client SessionProvider wrapper
  data/                        # JSON seed (users, timesheets, entries)
  lib/
    api-client.ts              # Typed fetch wrapper for /api/*
    api-helpers.ts             # Shared route helpers (auth, errors)
    auth.ts                    # NextAuth config
    cn.ts                      # clsx wrapper
    mock-db.ts                 # In-memory store, seeded from JSON
    validators.ts              # Zod schemas
    week-utils.ts              # Status derivation, formatting
  middleware.ts                # Protects /dashboard/*
  types/                       # Shared types + next-auth augmentation
  __tests__/                   # Unit + component tests
```

## Architecture notes

- **Components never touch the mock data directly.** Every read or write goes through the typed `apiClient` (`src/lib/api-client.ts`) → an internal Next route under `/api/timesheets/*` → the in-memory store. This mirrors how the app would integrate with a real backend and was an explicit requirement of the brief.
- **Status is derived, not stored.** Weekly status is computed from the sum of entry hours: `0` → `missing`, `< 40` → `incomplete`, `≥ 40` → `completed` (see `lib/week-utils.ts`).
- **Auth.** `next-auth` Credentials provider verifies email/password against `data/users.json`. The session strategy is JWT, so the session lives in a cookie. `middleware.ts` redirects unauthenticated requests to `/dashboard/*` back to `/login`. Each API route additionally calls `requireSession()` and returns 401 if there's no session.
- **Validation.** `loginSchema` and `entrySchema` (in `lib/validators.ts`) are shared between the client-side `react-hook-form` resolver and the server-side route handlers — same rules in both places.
- **Filter behaviour.** When the date range covers any part of a week, that week is included (per the design notes). The list is sorted newest-first and paginated server-side.

## Assumptions

- A single seeded user (`test@dev.com`). The brief asked for "user data (for login)" which I interpreted as one or more demo accounts, not a full user-management UI.
- Mock data is held in-process (seeded from JSON on first import). Mutations persist for the lifetime of `next dev`; restarting the server resets the store. Acceptable for a take-home — file-based persistence would be a small change to `mock-db.ts`.
- Weeks are Monday-Friday (5-day working week). Dates in the seed reflect this; the screenshot showing "21 - 26 January" was treated as design-art; the matching list row "22 - 26 January, 2024" was used as the source of truth.
- "Remember me" is a UI toggle only — not wired to a longer session lifetime, since the brief didn't call for one.
- Project and work-type options are seeded as fixed lists in `lib/validators.ts`. Easy to swap for a `/api/projects` endpoint later.
- Screenshots show a "Date Range" dropdown; I implemented the underlying behaviour as two date inputs (From / To) for clarity. Either renders the same data.

## Time spent

~3 hours, including planning, scaffolding, UI work, API + auth, tests, and README.
