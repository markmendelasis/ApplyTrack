# ApplyTrack – Personal Job Application Tracker

ApplyTrack is a modern, responsive personal job application tracker designed to help job seekers record, organize, and monitor their job applications, with a core focus on instantly identifying whether they have previously applied to any company.

Secured with **Supabase Authentication** and PostgreSQL **Row Level Security (RLS)**.

---

## Key Features

1. **Supabase Authentication & Route Protection**:
   - Secure email and password registration and login.
   - Persistent client-side sessions with automatic token refreshing.
   - `ProtectedRoute` and `PublicRoute` route guards preventing unauthorized access or unnecessary login screens.

2. **Dashboard Overview**:
   - High-level metric cards: Total Applications, Active Applications, Interviews, Offers.
   - Quick-glance list of recent job applications with status badges and links.
   - One-click shortcuts to add applications or search companies.

3. **Complete Application Management (CRUD)**:
   - Record applications with Company Name, Job Position, Application Date, Status, Job URL, and Notes.
   - Supports recruitment statuses: `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`, `Withdrawn`.
   - Real-time search across company names and job titles.
   - Filter by status and sort by date or company name.
   - Quick inline status switcher.
   - Confirmation dialog before deleting records.

4. **Company Search (Core Feature)**:
   - Dedicated case-insensitive partial company-name search.
   - Displays all previous applications when a user applied to multiple positions at the same company.
   - Clear visual indicators whether an application was previously submitted.
   - Does **not** restrict users from adding another position to a company they've already applied to.
   - Useful empty states with direct "Record Application" pre-fill action.

5. **Security & Row Level Security (RLS)**:
   - All client database interactions enforce PostgreSQL RLS policies tied to `auth.uid()`.
   - Client queries use the public anonymous key only; service role keys are never exposed.

---

## Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Navigation**: [React Router v6](https://reactrouter.com/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (GoTrue Auth + PostgreSQL Database)

---

## Project Structure

```
ApplyTrack/
├── .env.example                       # Environment variables template
├── supabase/
│   └── migrations/
│       └── 20261105000000_create_applications_schema.sql # Database schema & RLS policies
├── src/
│   ├── components/
│   │   ├── applications/              # Application table, cards, modal form, filter bar
│   │   ├── common/                    # Button, Input, Modal, Badge, EmptyState, Spinner
│   │   ├── dashboard/                 # Metric stat cards, recent applications list
│   │   └── layout/                    # Sidebar, Header, Mobile drawer navigation
│   ├── contexts/
│   │   └── AuthContext.tsx            # Global session and user state
│   ├── hooks/
│   │   ├── useAuth.ts                 # Auth context consumer
│   │   └── useDebounce.ts             # Input debounce hook for search
│   ├── layouts/
│   │   ├── AppLayout.tsx              # Main dashboard shell (desktop sidebar + mobile drawer)
│   │   └── AuthLayout.tsx             # Centered auth container
│   ├── pages/
│   │   ├── DashboardPage.tsx          # Metrics & recent activity
│   │   ├── ApplicationsPage.tsx       # Applications table & CRUD management
│   │   ├── CompanySearchPage.tsx      # Core company search & role grouping
│   │   ├── SettingsPage.tsx           # User profile & database security status
│   │   ├── LoginPage.tsx              # Email/password login
│   │   ├── RegisterPage.tsx           # Email/password registration
│   │   └── NotFoundPage.tsx           # 404 page
│   ├── routes/
│   │   ├── AppRoutes.tsx              # Router definition
│   │   ├── ProtectedRoute.tsx         # Auth guard
│   │   └── PublicRoute.tsx            # Redirect for logged-in users
│   ├── services/
│   │   ├── supabaseClient.ts          # Supabase client instantiation
│   │   └── applicationService.ts      # Pure database service operations
│   ├── types/
│   │   ├── database.ts                # Database schema types
│   │   └── index.ts                   # Domain interfaces & DTOs
│   └── utils/
│       ├── constants.ts               # Status definitions & badge themes
│       └── formatters.ts              # Date & URL formatting helpers
```

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A [Supabase](https://supabase.com/) account and project

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your Supabase credentials from your Supabase Dashboard (**Project Settings > API**):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Database Migration
Open your Supabase project's **SQL Editor**, copy the contents of:
`supabase/migrations/20261105000000_create_applications_schema.sql`
and click **Run**. This will create:
- The `applications` table with all constraints and check rules.
- Fast indexes for user queries, sorting, and case-insensitive company search.
- Triggers for automatic `updated_at` and `created_by`/`updated_by` audit fields.
- Complete Row Level Security (RLS) policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.

### 4. Install Dependencies & Start the App
```bash
npm install
npm run dev
```

### 5. Production Build
```bash
npm run build
npm run preview
```
