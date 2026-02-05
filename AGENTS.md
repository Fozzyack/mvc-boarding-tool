# AGENTS.md

This document provides guidelines for AI agents working on the MVC Boarding Tool codebase.

## Project Overview

MVC Boarding Tool is a veterinary boarding management system built with Next.js 14 (App Router), TypeScript, Drizzle ORM, PostgreSQL, and Tailwind CSS. The app helps clinic nurses track dogs during their stay with features for dog registration, status tracking, activity logging, and scheduling.

## Commands

### Development
```bash
npm run dev          # Start development server at http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database (Drizzle)
```bash
docker-compose up -d         # Start PostgreSQL via Docker
npx drizzle-kit push         # Push schema changes
npx drizzle-kit generate     # Generate new migration
npx drizzle-kit studio       # Open Drizzle Studio GUI
```

### Database URL
Set `DATABASE_URL` in `.env` (Docker uses connection string from `docker-compose.yaml`).

## Code Style Guidelines

### TypeScript
- Strict mode is enabled in `tsconfig.json`
- Use explicit types for function parameters and return values
- Prefer interfaces over type aliases for object shapes
- Use `any` sparingly; use `unknown` when type is uncertain

### Naming Conventions
- **Components**: PascalCase for React components (`LandingNav.tsx`)
- **Files**: camelCase for utility files (`getDbConnString.ts`)
- **Constants**: SCREAMING_SNAKE_CASE for config constants
- **Variables/functions**: camelCase
- **Database tables**: snake_case (enforced by Drizzle)
- **Table/column names**: singular for tables (`users`, not `user`)

### Imports and Organization
- Use path aliases (`@/*`) for absolute imports
- Order imports: React imports → Next.js imports → Third-party → Internal aliases
- Group imports with blank lines between groups
- Default exports for page components and reusable components

```typescript
import Link from "next/link";
import { db } from "@/utils/db/drizzle";
import type { Dog } from "@/types";
```

### React Components
- Use `"use client"` directive at the top for client components
- Default export for page components
- Use descriptive component names (avoid `Component1`, `Widget`)
- Destructure props explicitly
- Keep components focused; extract complex logic to custom hooks

### Server vs Client Components
- Default to server components (App Router default)
- Add `"use client"` only when:
  - Using React hooks (`useState`, `useEffect`, `useCallback`)
  - Using event handlers (`onClick`, `onChange`)
  - Using browser-only APIs
- Minimize client components for better performance

### Database (Drizzle ORM)
- Define schemas in `utils/db/schema.ts`
- Use `pgTable` with explicit constraints (`notNull`, `unique`)
- Export table definitions for use in queries
- Database logic in dedicated files under `utils/db/`

### Tailwind CSS
- Use utility classes for all styling
- Custom colors available: `accent`, `emerald-*`, `slate-*`
- Mobile-first responsive design (`md:`, `lg:` prefixes)
- Avoid custom CSS; use Tailwind utilities

### Error Handling
- Use try/catch for async database operations
- Return typed results from database queries
- Handle edge cases explicitly

### File Structure
```
app/                    # Next.js App Router pages
  layout.tsx            # Root layout
  page.tsx              # Home page
  login/                # Login route
components/             # Reusable React components
utils/db/               # Database schema and connection
  schema.ts
  drizzle.ts
  getDbConnString.ts
drizzle.config.ts       # Drizzle configuration
next.config.ts          # Next.js configuration
```

### Formatting (Prettier)
- Tab width: 4 spaces
- Semicolons: yes
- Trailing commas: as configured by ESLint/Prettier

## Code Quality
- Run `npm run lint` before committing
- Ensure TypeScript compiles without errors
- Verify database migrations work with `docker-compose up -d`
