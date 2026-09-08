# Jubileum Engine

Ambachtio — anniversary research and outreach for Dutch companies.

A Sales MVP built with Next.js 14, TypeScript, Tailwind, Prisma, and PostgreSQL.

## Features

- Company CRM with foundation-date confidence tracking
- Anniversary calculation engine
- Explainable lead scoring
- Research source / claim / event workflow
- Private timeline preview generator
- Personalized outreach drafts with approve/send gate
- Lightweight CRM pipeline
- Metrics dashboard

## Local development

Requirements:
- Node.js 20+
- PostgreSQL (local Docker or installed Postgres)

```bash
npm install

# Start Postgres, then create the database and run migrations:
npx prisma migrate dev

# Optional: seed a demo company
npx prisma db seed
# or visit http://localhost:3000/setup

npm run dev
```

Login at `http://localhost:3000/login` with the password from `ADMIN_PASSWORD` in `.env`.

## Deploy to Vercel

1. Create a Vercel project and connect your Git repository.
2. Add a PostgreSQL database (Vercel Postgres, Neon, or Supabase).
3. Add environment variables in the Vercel dashboard:
   - `DATABASE_URL` — your Postgres connection string
   - `ADMIN_PASSWORD` — strong admin password
   - `NEXT_PUBLIC_APP_URL` — `https://your-domain.vercel.app`
4. Push to your default branch. Vercel will run `npm run build`, which applies migrations automatically.
5. Log in with `ADMIN_PASSWORD`, then visit `https://your-domain.vercel.app/setup` to seed the demo company.

## Environment variables

Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL="postgresql://..."
ADMIN_PASSWORD="replace-with-a-long-unique-password"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Tests

```bash
npm run test
```

## Docs

See `docs/JUBILEUM_ENGINE.md` for architecture, decisions, and next steps.
