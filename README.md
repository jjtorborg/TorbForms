# TorbForms

A dynamic form creation and submission service built with Next.js, Drizzle ORM, and Neon Postgres.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [pnpm](https://pnpm.io) 10+
- A [Neon](https://neon.tech) project with a Postgres database provisioned

### 1. Install dependencies

```bash
pnpm i
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
```

Get this value from the Neon dashboard under **Connection Details**.

### 3. Push the schema to the database

```bash
pnpm drizzle-kit push
```

This reads `drizzle.config.ts`, connects to your Neon database, and creates all tables. Run this once on first setup and again whenever `src/db/schema.ts` changes.

### 4. Start the development server

```bash
pnpm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Overview

### Routes

| Route | Purpose |
|---|---|
| `/create` | Build a form - add questions, choose types, set required flags |
| `/form?id={uuid}` | Fill out and submit a form |

### Dependencies

| Package | Role | Why |
|---|---|---|
| `next` 16 | Framework | App Router gives server components, route handlers, and file-based routing |
| `react` / `react-dom` 19 | UI runtime | - |
| `drizzle-orm` | ORM | Type-safe, generates parameterized queries |
| `drizzle-kit` | Schema migrations CLI | Diffs the TypeScript schema against the live DB and applies changes |
| `@neondatabase/serverless` | Postgres driver | Uses HTTP transport instead of persistent TCP - required for serverless DB |
| `zod` | Validation | Schema declared once in `validators.ts`, used on both the client and server |
| `react-hook-form` | Form state | Uncontrolled inputs with minimal re-renders |
| `@hookform/resolvers` | RHF - Zod bridge | Passes Zod schemas directly to RHF resolver |
| `tailwindcss` v4 | Styling | Easy to integrate, wraps standard CSS |
| `next-themes` | Dark mode | Persists preference to `localStorage` |
| `dotenv` | Env loading for CLI | `drizzle-kit` runs outside Next.js and needs explicit `.env` loading |

### Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── create/           # Form builder page
│   ├── form/             # Form viewer and submission page
│   ├── submissions/      # Form submissions viewer page
│   └── api/              # Server-side route handlers (forms, submissions)
├── components/
│   ├── create/           # Components used on the form builder page
│   ├── form/             # Components used on the form viewer page
│   └── ui/               # Reusable primitive components
├── db/                   # Drizzle schema definition and database client
└── lib/                  # Zod validators and constants
```

### Database Schema

```
┌───────────────────┐     ┌───────────────────┐
│       forms       │     │    submissions    │
├───────────────────┤     ├───────────────────┤
│ id                │     │ id                │
│ title             │ --> │ form_id           │
│ description       │ 1:N │ submitted_at      │
│ created_at        │     └────────┬──────────┘
└────────┬──────────┘              │ 1:N
         │ 1:N                     ▼
         ▼                ┌───────────────────┐
┌───────────────────┐     │      answers      │
│     questions     │     ├───────────────────┤
├───────────────────┤     │ id                │
│ id                │ --> │ submission_id     │
│ form_id           │ 1:N │ question_id       │
│ label             │     │ value             │
│ description       │     └───────────────────┘
│ type              │
│ required          │
│ position          │
│ options           │
└───────────────────┘
```

`options` and `value` are stored as `jsonb` so the schema works across question types - choice questions store a `string[]`, text questions store a plain `string`.

## Approach

### Web Accessibility
I wanted to provide web accessibility for this project, but **fast, easy and cheap**. "Move fast" platforms like Vercel and Neon were ideal, which pair very nicely with Next.js. This has the added benefit of a natural **monolithic architecture**, easier to maintain for a small team (namely me).

An obvious tradeoff is heavy **vendor lock-in**, making it harder to migrate if needed. Another downside is **cost to scale**. Hobby tiers are free... for now, but if this ever changed or the system were to grow in usage I'd have some decisions to make.

### Robust Data Implementation
For this project to be useful despite the short development timeline, the **data schema and form validation** had to be rock solid. I spent a lot of time planning the table structure and considering options for DB and form management frameworks. Went with Drizzle ORM/SDK for its simplicity, serverless Postgres compatibility, and especially query manager which parameterizes **"queries as code"** server-side.

I was unfamiliar with the latest in React form management and did some research into popular modern libraries. React-Hook-Form paired with the Zod validator was a commonly recommended option. This simplified state management (uncontrolled inputs), and allowed the same form validation to be used on both client and server. It also made available nice features like required questions, preventing empty options, etc.

### UI
I'm not a designer, but had a good experience with Tailwind building my portfolio website. A lot of the work here was "outsourced", but I tried to keep things simple. Also never could say no to a dark theme.

## Extensions

### User Identity
Currently anyone with a form link can submit any number of times. For use cases where one response per person is required (enrollment, voting, surveys), an identity layer would be needed.

### Better Form URL
Using UUID as form route key is nice to avoid collisions but isn't very user friendly. Maybe truncate the UUID somehow or use a validated user generated key.

### Media Embedding
It would be nice to be able to add images or videos to the forms. Would require blob storage.

### File Uploading
This would be very useful for forms that require additional documents like resumes, receipts, certificates, etc. Another opportunity for blob storage.
