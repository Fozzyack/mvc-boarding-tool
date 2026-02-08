# AGENTS.md

MVC Boarding Tool: veterinary boarding management system with Next.js 16, TypeScript 5, Drizzle ORM, PostgreSQL, Tailwind CSS 4.

## Commands

### Development & Build
```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Run production server
npm run lint         # ESLint (eslint-config-next)
npx tsc --noEmit     # Type-check without emitting
```

### Database (Drizzle)
```bash
docker-compose up -d        # Start PostgreSQL via Docker
npx drizzle-kit push       # Push schema (dev only)
npx drizzle-kit generate   # Generate migration file
npx drizzle-kit migrate    # Run pending migrations
npx drizzle-kit studio     # Open Drizzle Studio GUI
```
Set `DATABASE_URL` in `.env`. Docker uses connection string from `docker-compose.yaml`.

## Code Style

### TypeScript
- Strict mode enabled; use explicit types for parameters/returns
- Prefer interfaces over type aliases for object shapes
- Use `any` sparingly; prefer `unknown` when uncertain
- `noEmit` enabled; Next.js handles compilation

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `LandingNav.tsx` |
| Utilities | camelCase | `getDbConnString.ts` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Variables/functions | camelCase | `isValidEmail` |
| DB tables/columns | snake_case | `user_profile` |
| Table exports | Suffix with `Table` | `dogsTable` |

### Imports
Use path aliases (`@/*`). Order groups with blank lines:
1. React / Next.js
2. Third-party libraries
3. Internal aliases (utils, types)

```typescript
import { useState } from "react";
import Link from "next/link";
import { eq, and } from "drizzle-orm";
import { db } from "@/utils/db/drizzle";
import { dogs } from "@/utils/db/schema";
import type { Dog, InsertDog } from "@/types";
```

### React Components
- Use `"use client"` only when hooks/events/browser APIs required
- Default exports for pages and reusable components
- Descriptive names; avoid `Component1`, `Widget`
- Destructure props with explicit types
- Extract complex logic to custom hooks

### Database (Drizzle ORM)
- Define schemas in `utils/db/schema.ts`
- Use `pgTable` with explicit constraints
- Export tables with `Table` suffix
- Use typed builders: `eq()`, `and()`, `or()`, `inArray()`
- Handle transactions with `db.transaction()`

#### Schema Conventions
| Field Type | Convention |
|------------|------------|
| Timestamps | `createdAt`, `updatedAt` with auto-update |
| Soft delete | `isActive: boolean().default(true).notNull()` |
| Foreign keys | `references(() => tableName.id)` |
| Varchar (names/email) | `255` characters |
| Varchar (categorical) | `63` characters |
| Varchar (phone) | `50` characters |
| Varchar (hashes) | `300` characters |
| Weights/prices | `decimal({ precision: 10, scale: 2 })` |
| Birth dates | `date()` |
| Audit fields | `timestamp()` |

### Tailwind CSS
- Use utility classes exclusively; avoid custom CSS
- Custom colors: `accent`, `emerald-*`, `slate-*`
- Mobile-first: `base`, `md:`, `lg:` prefixes

### Error Handling
- try/catch for async DB operations
- Return typed results from queries
- Early returns for edge cases
- Custom error types for domain errors
- Console error logging in development

## File Structure
```
app/                    # Next.js App Router
  (routes)/             # Route groups
  api/                  # API routes
  page.tsx              # Home page
  layout.tsx            # Root layout
components/             # Reusable components
  ui/                   # Generic UI
  features/             # Feature-specific
utils/                  # Utilities
  db/                   # DB schema & connection
    schema.ts           # Table definitions
    drizzle.ts          # DB connection
    getDbConnString.ts # Env-based connection
types/                  # TypeScript types
constants/              # App constants
scripts/                # One-off scripts
drizzle-migrations/    # Migration files
drizzle.config.ts       # Drizzle config
```

## Formatting
Configured via `eslint.config.mjs` with eslint-config-next:
- 4 spaces for tabs
- Semicolons: yes
- Trailing commas: yes
- Single quotes for strings
- Print width: 100
- End of line: LF

## Quality Checklist
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] `npx drizzle-kit migrate` after schema changes

## External Agent Rules
- No Cursor rules configured
- No Copilot rules configured
