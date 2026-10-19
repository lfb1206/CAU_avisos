# CAU Avisos

> **🚧 Active development / work in progress.** This is an internal tool built for a single club (Club Andino Universitario). It is not a polished product, has no test suite, and its data model is still being iterated on. Expect breaking changes.

Web app for the **Club Andino Universitario (CAU)** to manage "avisos de salida" (mountain expedition safety notices), course/taller enrollment, and club administration. An aviso de salida records who's going where, the itinerary, risk assessment, equipment, and emergency contacts for a mountaineering trip, so a designated contact can trigger a rescue protocol if the group doesn't check back in on time.

## Status & known limitations

This project is actively evolving and has some rough edges worth knowing about before you dig in:

- **No automated tests.** CI only runs type-checking, linting, and a production build — there is no unit/integration/e2e test suite yet.
- **Data model is still shifting.** The Prisma schema (participants, avisos, talleres/courses, risk assumptions) has gone through several redesigns and will likely keep changing.
- **Real member data lives outside the repo.** The `db:seed` script expects a real member whitelist locally (see [Seeding real data](#seeding-real-data)) — none is committed, by design.
- **Authorization is mostly role-checks in API routes**, not a formal policy layer. Supabase RLS is used for some tables (see `supabase/migrations`) but not uniformly.
- **Admin panels are functional but minimal** — little validation UX, no audit log of who changed what.
- **Single club, hardcoded assumptions.** Spanish-only UI, Chilean RUT format, and CAU-specific protocols/roles are baked into the domain model rather than configurable.
- **No error monitoring / alerting** wired up beyond Vercel's defaults.

If you're picking this up, treat the code as a working draft rather than a finished system.

## Features

- **Avisos de salida** — a multi-step form (basic info → participants → itinerary/risk assumptions → equipment/transport → review) that produces a printable safety notice, including a carbon-footprint estimate for transport.
- **Coordinador panel** — manage course editions ("ediciones"), enrollments, ayudantías (assistant applications), and member points.
- **Cursos / Talleres** — course catalog, enrollment flow, and printable "fichas" (course record sheets).
- **Admin panel** — manage people, activities, equipment catalogs, checklists, and form option dictionaries backed by the database (no more hardcoded JS data files).
- **Equipo Club / Préstamos** — members browse live equipment availability, request gear tied to one of their own avisos, and a per-pool "custodio" role approves/rejects and tracks pickup/return (with borrower-uploaded return photos for traceability). Replaces a previous external Google Form + Sheet workflow.
- **Auth** — Supabase Auth (email/password) with a member email whitelist enforced at the database level, plus a per-member active-membership date gating equipment loans and course enrollment.

## Architecture & stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router) + React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL via [Prisma ORM](https://www.prisma.io/) (`prisma/schema.prisma`) for application data
- **Auth & platform**: [Supabase](https://supabase.com/) — Auth (email/password + whitelist trigger) and Postgres hosting; some tables also carry Supabase Row Level Security policies (`supabase/migrations/`) alongside the Prisma-managed schema
- **Email**: [Resend](https://resend.com/) for transactional email (aviso submission notifications)
- **Deployment**: Vercel
- **CI**: GitHub Actions — type-check, lint, and build on every push/PR to `main` (`.github/workflows/ci.yml`)

### How the pieces fit together

- Prisma owns the schema/migrations for app data (avisos, participants, courses, equipment, etc.) and talks to the same Postgres database Supabase hosts.
- Supabase is used specifically for Auth and for a handful of tables where Row Level Security is enforced directly at the database layer (see `supabase/migrations/004_profiles_whitelist.sql` for the whitelist trigger that promotes a pre-created `Profile` row to `is_registered = true` on signup).
- Next.js API routes (`src/app/api/**`) sit in front of Prisma for most reads/writes; `src/middleware.ts` handles session refresh via Supabase.

### Project structure

```
prisma/                  Prisma schema, migrations, and seed scripts
supabase/migrations/     Hand-written SQL for auth triggers & RLS policies
src/app/                 Next.js App Router: pages + API routes
  api/                   REST-ish API routes (avisos, admin, coordinador, cursos, ...)
  admin/                 Admin panels (people, activities, equipment, checklists, forms)
  aviso/, avisos/        Aviso de salida creation & viewing
  coordinador/           Course edition / enrollment management
  cursos/                Course catalog & enrollment
  prestamos/             Equipo Club browsing & loan requests (member-facing)
  custodio/              Equipment catalog & loan review (custodio-facing)
  auth/                  Login, register, password reset
src/resources/           Form steps, shared components, constants, contexts
src/lib/                 Prisma client, Supabase clients, auth helpers
```

## Getting started

### Prerequisites

- Node.js 20+
- A Postgres database (a [Supabase](https://supabase.com/) project is the easiest path, since Auth is wired to it)

### Environment variables

Create a `.env` file in the project root:

```
DATABASE_URL=postgresql://...          # pooled connection (used by Prisma at runtime)
DIRECT_URL=postgresql://...            # direct connection (used by Prisma migrations)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...          # server-only, used by admin operations
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=...                     # optional, enables all transactional email below
RESEND_FROM_AVISOS=...                 # optional, sender for aviso emails (defaults to a CAU address)
RESEND_FROM_PRESTAMOS=...              # optional, sender for Equipo Club loan emails (defaults to a CAU address)
QSTASH_TOKEN=...                       # optional, enables the overdue-return alert email (Upstash QStash)
QSTASH_CURRENT_SIGNING_KEY=...         # optional, verifies the overdue-alert webhook actually came from QStash
QSTASH_NEXT_SIGNING_KEY=...            # optional, QStash's signing-key rotation companion to the above
```

### Install & run

```bash
npm install
npm run db:migrate:deploy   # applies tracked migrations — see "Database migrations" below
npm run db:seed             # seeds equipment, courses, options, etc. (see below)
npm run dev
```

Also apply the SQL files under `supabase/migrations/` in your Supabase project's SQL editor — they set up the auth trigger and RLS policies that Prisma migrations don't manage.

### Database migrations

Schema changes are tracked under `prisma/migrations/` instead of applied ad hoc:

- **Local development**: after editing `prisma/schema.prisma`, run `npm run db:migrate` (`prisma migrate dev`) — it generates a new migration file from the diff and applies it to your dev database.
- **Production**: run `npm run db:migrate:deploy` (`prisma migrate deploy`) — applies any migrations not yet recorded in the target database's `_prisma_migrations` table. This is what CI/deploy should run instead of `prisma db push`.

`prisma/migrations/00000000000000_baseline/` is a baseline migration generated from the schema as it stood when tracked migrations were introduced — it represents everything that existed before, not a new change. **If you're pointing this at a database that was previously managed with `prisma db push`** (schema already matches, just no migration history), mark that baseline as already applied instead of re-running it, once, per database:

```bash
npx prisma migrate resolve --applied 00000000000000_baseline
```

`npm run db:push` (`prisma db push`) still exists for quick local prototyping, but avoid it against any database with real data — unlike `migrate deploy`, it applies whatever diff is needed to match the schema file directly, including destructive changes (dropped/renamed columns), with no migration file to review beforehand.

### Seeding real data

`npm run db:seed` populates most reference data (equipment, activities, talleres, risk options) automatically. Two exceptions, both intentionally excluded from this repo:

- **Member email whitelist** (`prisma/seed/people.ts`): create `prisma/seed/data/people.local.json` (gitignored) as an array of `{ name, rut, phone, email }` objects — only `email` is used, to pre-populate the whitelist that lets members register.
- **Equipo Club inventory** (`prisma/seed/inventory.ts`): create `prisma/seed/data/inventory.local.json` (gitignored) transcribed from the live spreadsheet — see the type shapes at the top of that file. Run this after seeding people, since it resolves custodian/borrower emails against already-seeded profiles; it's also where currently-outstanding loans need to be seeded so computed availability starts accurate instead of double-booking already-lent gear.

### Other scripts

```bash
npm run build         # prisma generate + next build
npm run lint           # eslint
npm run db:studio      # Prisma Studio
```
