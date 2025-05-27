# Big Schedule

Big Schedule is a web application for creating, managing, and sharing detailed agendas or schedules. It is built with [Next.js](https://nextjs.org) and leverages modern TypeScript and React patterns with [Supabase](https://supabase.com) as the backend.

## What does it do?

Big Schedule allows users to:
- **Create and customize schedules** with a user-friendly form interface.
- **Add detailed agenda items** including title, description, start/end time, and location.
- **Preview and edit schedule details** before publishing.
- **Mark schedules as public or private**.
- **Share schedules** with other users with different permission levels.
- **(Future)** Generate schedules with AI assistance.

The app is ideal for planning events, meetings, conferences, or personal itineraries.

## Tech Stack

- **Framework:** Next.js (TypeScript)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Frontend:** React, Next.js App Router
- **Styling:** Tailwind CSS, tw-animate-css, custom CSS variables
- **State & Utilities:** React hooks, clsx, tailwind-merge

### Popular Libraries

- **UI & Components:**  
  - [shadcn/ui](https://ui.shadcn.com/) (custom components)  
  - [@radix-ui/react-*](https://www.radix-ui.com/docs/primitives/overview/introduction) (Dialog, Label, Tooltip, Separator, etc.)  
  - [lucide-react](https://lucide.dev/) (icon library)  
  - [Geist font](https://vercel.com/font) (from next/font/google)  
- **Backend & Database:**  
  - [Supabase](https://supabase.com/) (Backend-as-a-Service)  
  - [@supabase/supabase-js](https://www.npmjs.com/package/@supabase/supabase-js) (Supabase client)  
- **Animation:**  
  - [framer-motion](https://www.framer.com/motion/)  
- **Tooling:**  
  - ESLint (with next/core-web-vitals)  
  - PostCSS (with Tailwind CSS plugin)  
  - TypeScript

> The codebase is modular, using a lot of component abstraction and utility hooks.  
> All styles are managed through Tailwind CSS and custom variables.  
> You use modern React (function components, hooks) and Next.js features.  
> The project is set up for easy deployment on Vercel with Supabase integration.

To see more dependencies, check your [`package.json`](https://github.com/phalla-doll/big-schedule/blob/main/package.json) directly.

## Database Setup (Supabase)

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy your project URL and anon key from the project settings

### 2. Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Database Schema

Run the migration file in your Supabase SQL editor:
- Copy the contents of `supabase/migrations/001_initial_schema.sql`
- Paste and run it in your Supabase project's SQL editor

This will create:
- `users` table for user management
- `agendas` table for schedule data
- `agenda_items` table for schedule items
- `shared_agendas` table for sharing permissions
- `event_displays` table for customization
- Proper indexes and Row Level Security (RLS) policies

### 4. Authentication (Optional)

If you want to enable user authentication:
1. Enable authentication in your Supabase project
2. Configure authentication providers (email, Google, etc.)
3. Update the frontend to use Supabase Auth

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Supabase Documentation](https://supabase.com/docs) - learn about Supabase features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Don't forget to add your environment variables to your Vercel deployment settings.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
