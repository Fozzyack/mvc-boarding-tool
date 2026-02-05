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

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **State Management**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd mvc-boarding-tool

# Install dependencies
npm install

# Set up the database
npx prisma db push

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# View database in Prisma Studio
npx prisma studio
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
├── components/             # Reusable UI components
├── lib/                    # Utility functions and configurations
├── prisma/                 # Database schema and migrations
└── types/                  # TypeScript type definitions
```

## Usage

### Checking In a Dog
1. Click "Add Dog" button
2. Enter dog name, breed, age, and owner information
3. Add any special instructions or care requirements
4. Confirm to check in the dog

### Updating Status
1. Select a dog from the dashboard
2. Choose a new status from the status dropdown
3. Add optional notes if needed
4. Status updates immediately for all users

### Logging Activities
1. Click on a dog's card to view details
2. Navigate to the Activity Log section
3. Select activity type (feeding, walk, medication, etc.)
4. Enter details and save

## Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
