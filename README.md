# MVC Boarding Tool

A digital boarding management system designed for veterinary clinic nurses to track dogs during their stay. Eliminate paper-based tracking with a streamlined, intuitive interface.

## Features

- **Dog Registration**: Quickly add new boarding dogs with owner information and contact details
- **Status Tracking**: Monitor each dog's current status (checked in, feeding, walking, ready for pickup, etc.)
- **Activity Logging**: Record feeding times, walks, medications, and other care activities
- **Daily Schedule**: View and manage daily tasks for all boarded dogs
- **Search & Filter**: Quickly find specific dogs by name or owner
- **Real-time Updates**: Keep all staff synchronized with live status changes

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM

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

## Environment Variables

Create a `.env` file in the root directory:

```env
# PostgreSQL connection string (from docker-compose)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mvc_boarding"
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle Documentation](https://orm.drizzle.team/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
