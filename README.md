# MVC Boarding Tool

Veterinary boarding management system built with Next.js, TypeScript, Drizzle ORM, and PostgreSQL.

It helps clinic teams manage boarders, track medication schedules, and monitor day-to-day operations from a shared dashboard.

## Core Features

- Boarder management (animal details, owner details, stay dates)
- Medication scheduling (recurring and one-off)
- Medication status tracking (due now, due soon, overdue, completed, skipped, missed)
- Dashboard views for boarders and medication queue
- Calendar API and calendar UI route for operational scheduling
- Authentication with JWT cookies and role-aware navigation

## Tech Stack

- Next.js 16 (App Router)
- TypeScript 5 (strict mode)
- Tailwind CSS 4
- Drizzle ORM + drizzle-kit
- PostgreSQL (Docker-friendly local setup)
- jose + bcrypt for authentication

## Prerequisites

- Node.js 20+
- npm
- Docker + Docker Compose

## Quick Start

```bash
# 1) Install dependencies
npm install

# 2) Start local Postgres
docker-compose up -d

# 3) Configure env
cp .env.example .env

# 4) Push schema to database (dev)
npx drizzle-kit push

# 5) Start app
npm run dev
```

App runs at `http://localhost:3000`.

## Environment Variables

Create `.env` in the repository root.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mvc_boarding"
JWT_SECRET_KEY="replace-with-a-strong-random-secret"
BACKEND_URL="http://localhost:3000"

# Optional seed script values
TEST_ORGANISATION_NAME="Demo Vet"
TEST_ORGANISATION_EMAIL="demo@example.com"
TEST_ORGANISATION_CODE="DEMO"
TEST_USER_NAME="Admin"
TEST_USER_PASSWORD="password123"
TEST_USER_CODE="admin"
```

## Common Commands

```bash
# Development
npm run dev
npm run build
npm run start

# Quality
npm run lint
npx tsc --noEmit

# Drizzle
npx drizzle-kit push
npx drizzle-kit generate
npx drizzle-kit migrate
npx drizzle-kit studio
```

## Optional Local Data Seeding

```bash
# Seed sample org, user, boarders, and medications
npx tsx scripts/seedDatabase.ts

# Clear seeded data
npx tsx scripts/seedDatabase.ts delete
```

## Main Routes

- `/` landing page
- `/login` authentication
- `/dashboard` boarding overview
- `/dashboard/medications` shift medication queue
- `/dashboard/calendar` calendar view

## API Routes

- `POST /api/login`
- `POST /api/logout`
- `GET, POST /api/boarders`
- `POST /api/medications`
- `PATCH /api/medications/:id/administer`
- `GET /api/calendar?from=YYYY-MM-DD&to=YYYY-MM-DD`

## Project Structure

```text
app/
  api/
  dashboard/
  login/
components/
  medications/
  ui/
contexts/
db/
  drizzle.ts
  schema.ts
scripts/
types/
utils/
drizzle-migrations/
```

## Notes

- Use `npx drizzle-kit migrate` when adding migration files.
- Medication scheduling invariants are enforced in API validation and expected by the calendar/queue logic.
