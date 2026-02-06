# MVC Boarding Tool

A digital boarding management system designed for veterinary clinic nurses to track dogs during their stay. Eliminate paper-based tracking with a streamlined, intuitive interface.

## Features

- **Dog Registration**: Quickly add new boarding dogs with owner information and contact details
- **Status Tracking**: Monitor each dog's current status (checked in, feeding, walking, ready for pickup, etc.)
- **Activity Logging**: Record feeding times, walks, medications, and other care activities
- **Daily Schedule**: View and manage daily tasks for all boarded dogs
- **Search & Filter**: Quickly find specific dogs by name or owner
- **Real-time Updates**: Keep all staff synchronized with live status changes
- **Secure Authentication**: JWT-based auth with bcrypt password hashing

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT (jose) + bcrypt

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun
- Docker (for PostgreSQL)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd mvc-boarding-tool

# Install dependencies
npm install

# Start the PostgreSQL database
docker-compose up -d

# Push schema changes to database
npx drizzle-kit push

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Database Commands

```bash
# Start PostgreSQL via Docker
docker-compose up -d

# Push schema changes to database
npx drizzle-kit push

# Generate a new migration
npx drizzle-kit generate

# Run migrations
npx drizzle-kit migrate

# Open Drizzle Studio GUI
npx drizzle-kit studio
```

### Generate Password Hash for Testing

```bash
# With default password (password123)
npx tsx scripts/saltPassword.ts

# With custom password
npx tsx scripts/saltPassword.ts "mysecretpassword"
```

Or set `TEST_PASSWORD` in `.env` and run the script without arguments.

## Project Structure

```
app/                    # Next.js App Router pages and layouts
  (routes)/             # Route groups
  layout.tsx            # Root layout
  page.tsx              # Home page
  login/                # Login page
  dashboard/            # Protected dashboard routes
  api/                  # API route handlers
components/             # Reusable React components
  ui/                   # Generic UI components
  features/             # Feature-specific components
constants/              # App-wide constants
hooks/                  # Custom React hooks
utils/                  # Utility functions
  db/                   # Database schema and connection
    schema.ts
    drizzle.ts
    getDbConnString.ts
  auth/                 # Authentication utilities
    auth.ts             # JWT create/verify functions
scripts/                # Standalone scripts
  saltPassword.ts       # Password hash generator
middleware.ts           # Next.js middleware for auth
drizzle.config.ts       # Drizzle configuration
```

## Authentication

The app uses JWT-based authentication with HTTP-only cookies.

- **Token cookie name**: `barkboard`
- **JWT secret**: Set via `JWT_SECRET_KEY` in `.env`
- **Password hashing**: bcrypt with salt rounds of 10

### Protected Routes

Routes under `/dashboard` require authentication via middleware. Unauthorized users are redirected to `/login`.

## Environment Variables

Create a `.env` file in the root directory:

```env
# PostgreSQL connection string (from docker-compose)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mvc_boarding"

# JWT secret key (generate a strong random string)
JWT_SECRET_KEY="your-secret-key-here"

# Backend URL for API requests (development)
BACKEND_URL="http://localhost:3000"
```

## Code Quality

```bash
# Run ESLint
npm run lint

# Type-check without emitting
npx tsc --noEmit
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle Documentation](https://orm.drizzle.team/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [jose (JWT)](https://github.com/panva/jose)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
```

The application will be available at `http://localhost:3000`.

### Database Commands

```bash
# Start PostgreSQL via Docker
docker-compose up -d

# Push schema changes to database
npx drizzle-kit push

# Generate a new migration
npx drizzle-kit generate

# Open Drizzle Studio GUI
npx drizzle-kit studio
```

## Project Structure

```
app/                    # Next.js App Router pages and layouts
  layout.tsx            # Root layout
  page.tsx              # Home page
  login/                # Login route
components/             # Reusable React components
utils/db/               # Database schema and connection
  schema.ts
  drizzle.ts
  getDbConnString.ts
drizzle.config.ts       # Drizzle configuration
```


## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle Documentation](https://orm.drizzle.team/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
