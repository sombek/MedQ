# MedQ

Interactive medical exam platform — bilingual (English / Arabic), built with Next.js 16, shadcn/studio, and InstantDB.

## Tech stack

- **Framework:** Next.js 16 App Router (Turbopack), React 19
- **Styling:** Tailwind v4 + shadcn/studio (Maia preset on Base UI)
- **i18n:** `next-intl` with `/en` and `/ar` routes; IBM Plex Sans Arabic for Arabic typography
- **Backend:** [InstantDB](https://instantdb.com) — auth, real-time data, and permissions

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `.env` in the project root with:

```
NEXT_PUBLIC_INSTANT_APP_ID=<your-instant-app-id>
```

You get the app id by running:

```bash
npx instant-cli@latest login
npx instant-cli@latest init
```

## Schema and permissions

Schema lives in `instant.schema.ts`. Permissions live in `instant.perms.ts`.

Push changes to your Instant app with:

```bash
npx instant-cli@latest push schema
npx instant-cli@latest push perms
```

## Admin bootstrap

The first admin user must be promoted manually because the schema permissions intentionally prevent self-promotion:

1. Sign in normally at `/en/login` (or `/ar/login`) with your admin email. A `profiles` row is created automatically with `isAdmin=false`.
2. Open the [Instant dashboard](https://instantdb.com/dash) → your app → **Explorer** → `profiles`.
3. Find the row whose linked `$users.email` is yours and set `isAdmin = true`.
4. Reload `/en/admin/questions`. You now have admin access.

Any admin can toggle another user's `isActive` from the admin UI at `/admin/users`, but `isAdmin` itself must always be edited via the Instant dashboard (by design — prevents privilege escalation through the app).

## Project structure

```
app/[locale]/            # Localized routes (landing, login, practice, admin)
components/              # Feature-scoped React components
hooks/                   # Client hooks (useProfile)
i18n/                    # next-intl routing + navigation
lib/                     # db client, pure helpers, question schema
messages/                # en.json, ar.json translations
instant.schema.ts        # InstantDB entities and links
instant.perms.ts         # InstantDB rules (deny-by-default)
```
