# AGENTS.md

This document provides guidelines for AI agents working on the MVC Boarding Tool codebase.

## Project Overview

MVC Boarding Tool is a veterinary boarding management system built with Next.js 16 (App Router), TypeScript 5, Drizzle ORM, PostgreSQL, and Tailwind CSS 4. The app helps clinic nurses track dogs during their stay with features for dog registration, status tracking, activity logging, and scheduling.

## Commands

### Development
```bash
npm run dev          # Start development server at http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint with auto-fix
npx tsc --noEmit     # Type-check without emitting files
```

### Testing
```bash
npm test             # Run all tests (if tests exist)
npm test -- --testNamePattern="filter"  # Run tests matching pattern
npm test -- --watch  # Watch mode for development
```

### Database (Drizzle)
```bash
docker-compose up -d         # Start PostgreSQL via Docker
npx drizzle-kit push         # Push schema changes to database
npx drizzle-kit generate     # Generate new migration file
npx drizzle-kit studio       # Open Drizzle Studio GUI at localhost:4983
npx drizzle-kit migrate       # Run pending migrations
```

### Database URL
Set `DATABASE_URL` in `.env` (Docker uses connection string from `docker-compose.yaml`).

## Code Style Guidelines

### TypeScript
- Strict mode is enabled in `tsconfig.json`
- Use explicit types for function parameters and return values
- Prefer interfaces over type aliases for object shapes
- Use `any` sparingly; use `unknown` when type is uncertain
- Enable `noEmit` - compilation happens via Next.js build

### Naming Conventions
- **Components**: PascalCase for React components (`LandingNav.tsx`)
- **Files**: camelCase for utility files (`getDbConnString.ts`)
- **Constants**: SCREAMING_SNAKE_CASE for config constants
- **Variables/functions**: camelCase
- **Database tables/columns**: snake_case (enforced by Drizzle)
- **Table names**: singular form (`users`, not `user`)

### Imports and Organization
- Use path aliases (`@/*`) for absolute imports
- Order imports: React → Next.js → Third-party → Internal aliases
- Group imports with blank lines between groups
- Default exports for page components and reusable components
- Named exports for utilities and helpers

```typescript
import Link from "next/link";
import { useState } from "react";
import { eq, and } from "drizzle-orm";
import { db } from "@/utils/db/drizzle";
import { dogs } from "@/utils/db/schema";
import type { Dog, InsertDog } from "@/types";
```

### React Components
- Use `"use client"` directive at the top for client components
- Default export for page components
- Use descriptive component names (avoid `Component1`, `Widget`)
- Destructure props explicitly with type annotations
- Keep components focused; extract complex logic to custom hooks
- Use Server Components by default, only add `"use client"` when necessary

### Server vs Client Components
- Default to server components (App Router default)
- Add `"use client"` only when:
  - Using React hooks (`useState`, `useEffect`, `useCallback`)
  - Using event handlers (`onClick`, `onChange`)
  - Using browser-only APIs (window, document, etc.)
- Minimize client components for better performance

### Database (Drizzle ORM)
- Define schemas in `utils/db/schema.ts`
- Use `pgTable` with explicit constraints (`notNull`, `unique`, `default`)
- Export table definitions for use in queries
- Database logic in dedicated files under `utils/db/`
- Use typed query builders: `eq()`, `and()`, `or()`, `inArray()`
- Handle transactions with `db.transaction()`

#### Database Schema Conventions
- **Table exports**: Suffix with `Table` (`businessTable`, `usersTable`, `boardersTable`)
- **Timestamps**: Always include `createdAt` and `updatedAt` with auto-update
- **Soft delete**: Use `isActive: boolean().default(true).notNull()` instead of hard deletes
- **Foreign keys**: Use `references(() => tableName.id)` for relationships
- **Varchar lengths**:
  - `255` - Names, emails, addresses, longer text
  - `63` - Short categorical values (breed, species, animalType)
  - `50` - Phone numbers (accommodates extensions)
  - `300` - Password hashes, encoded data
- **Numeric precision**: Use `decimal({ precision: 10, scale: 2 })` for weights, prices
- **Dates**: Use `date()` for birth dates, DOBs; `timestamp()` for audit fields

### Tailwind CSS
- Use utility classes for all styling
- Custom colors available: `accent`, `emerald-*`, `slate-*`
- Mobile-first responsive design (`base`, `md:`, `lg:` prefixes)
- Avoid custom CSS; use Tailwind utilities exclusively
- Use `@apply` sparingly; prefer direct utility classes

### Error Handling
- Use try/catch for async database operations
- Return typed results from database queries
- Handle edge cases explicitly with early returns
- Use custom error types for domain-specific errors
- Log errors appropriately (console.error in development)

### File Structure
```
app/                    # Next.js App Router pages
  (routes)/             # Route groups
  layout.tsx            # Root layout
  page.tsx              # Home page
components/             # Reusable React components
  ui/                   # Generic UI components
  features/             # Feature-specific components
utils/db/               # Database schema and connection
  schema.ts             # Table definitions
  drizzle.ts            # Database connection
  getDbConnString.ts    # Environment-based connection string
drizzle.config.ts       # Drizzle configuration
next.config.ts          # Next.js configuration
postcss.config.mjs      # PostCSS for Tailwind
tailwind.config.ts      # Tailwind configuration
```

### Formatting (ESLint + Prettier)
- Tab width: 4 spaces
- Semicolons: yes
- Trailing commas: yes
- Single quotes for strings
- Print width: 100 characters
- End of line: LF

## Code Quality
- Run `npm run lint` before committing changes
- Run `npx tsc --noEmit` to verify TypeScript compilation
- Run database migrations after schema changes: `npx drizzle-kit migrate`
- Keep dependencies updated via `npm outdated`
- Review ESLint warnings and fix them promptly

## External Agent Rules
- No Cursor rules (.cursor/rules/ or .cursorrules) configured
- No Copilot rules (.github/copilot-instructions.md) configured
