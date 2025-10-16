# Construction Firm Management System

A comprehensive web application for managing construction projects, tasks, issues, purchases, inventory, expenses, invoices, timesheets, and more.

## Features

- **Project Management**: Track projects, budgets, timelines, and progress
- **Task Management**: Create and assign tasks with dependencies and priorities
- **Issue Tracking**: Manage snags and issues with severity levels
- **Purchase Orders**: Handle purchase requests, POs, and goods received notes
- **Inventory Management**: Track materials and supplies
- **Expense Tracking**: Record and categorize project expenses
- **Invoice Management**: Generate and track invoices and payments
- **Timesheet Management**: Track employee hours and rates
- **Reporting**: Generate comprehensive reports and analytics
- **Role-Based Access Control**: Different access levels for different user types
- **File Management**: Upload and preview documents and images
- **PDF Generation**: Generate invoices, POs, and reports as PDFs

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Prisma ORM, MySQL, NextAuth, tRPC
- **UI Components**: Radix UI, Lucide React icons
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table
- **Charts**: Recharts
- **Drag & Drop**: dnd-kit
- **File Storage**: S3 compatible storage
- **PDF Generation**: React-PDF
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+ 
- MySQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd construction-firm-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database and other configuration:
```env
DATABASE_URL="mysql://username:password@localhost:3306/construction_firm_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

- **Admin**: admin@construction.com / password123
- **Employee**: employee@construction.com / password123

## Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users**: Authentication and role management
- **Projects**: Construction projects with budgets and timelines
- **Tasks**: Project tasks with dependencies and assignments
- **Issues**: Project issues and snags
- **Clients**: Project clients
- **Suppliers**: Material suppliers
- **Inventory**: Materials and supplies
- **Purchase Orders**: Purchase requests and orders
- **Expenses**: Project expenses
- **Invoices**: Client invoices and payments
- **Timesheets**: Employee time tracking

## API

The application uses tRPC for type-safe API calls. All API routes are defined in `src/server/api/trpc/routers/`.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

### Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Layout components
├── lib/                   # Utility functions and configurations
├── server/                # Backend code
│   └── api/trpc/         # tRPC API routes
├── types/                 # TypeScript type definitions
└── prisma/               # Database schema and migrations
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
