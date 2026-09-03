# Jubileum Engine — Project Documentation

## Current Architecture

Greenfield Next.js 14 application using the App Router.

- **Framework:** Next.js 14 + React + TypeScript
- **Styling:** Tailwind CSS
- **Database ORM:** Prisma
- **Database:** PostgreSQL (configured for Vercel/production; use local Postgres for development)
- **Authentication:** Simple environment-password admin gate (MVP only)
- **AI/Research:** Adapter-based architecture; first implementation uses manual entry + deterministic helpers so the workflow works without API credentials.
- **Deployment target:** Vercel

## Important Assumptions

- Sales MVP focus: company → anniversary → research → claims/events → score → preview → outreach → CRM.
- Production engine (asset uploads, OCR, interviews, story generation) is NOT built in Phase 1.
- External research APIs (search, LinkedIn, chamber of commerce) are not required to complete the MVP; clean adapters are provided so they can be connected later.
- Foundation dates are modeled with confidence and evidence, never as a single unquestionable year.
- Outreach requires explicit human approval; no automatic sending.
- Demo/seed data will be clearly marked as DEMO.

## Implementation Phases

### Phase 1 — Sales MVP (current)

- [x] Project setup
- [x] Prisma schema (Company, Contact, Anniversary, Lead, ResearchSource, HistoricalClaim, HistoricalEvent, Preview, OutreachMessage, OutreachActivity, CostRecord)
- [x] Company CRUD + CSV import
- [x] Anniversary engine with tests
- [x] Lead scoring engine with configurable weights
- [x] Research source / claim / event model
- [x] Private preview generator
- [x] Outreach draft generator with approval gate
- [x] Lightweight CRM stages and next-best-action
- [x] Metrics dashboard
- [x] Tests for critical logic
- [x] Vercel-ready PostgreSQL configuration

### Phase 2 — Validation (after Phase 1)

- Import first real prospects
- Generate previews
- Send approved outreach
- Measure reply / meeting / proposal rates
- Iterate on targeting and copy

### Phase 3 — Production engine (only after sales validation)

- Asset upload / OCR / classification
- Interview workflow
- Story generation
- Customer approval and export

## Decisions Made

- PostgreSQL configured as the production database. `DATABASE_URL` switches between local Postgres and Vercel Postgres.
- Minimal auth for MVP to avoid external provider setup.
- AI functions return structured objects with explicit `NOT_FOUND` / `NEEDS_RESEARCH` when data is missing, preventing hallucinated facts.
- Lead score is deterministic and explainable, not an opaque AI number.
- Private previews are served from `/preview/[token]` with opaque tokens; no public index.

## Unresolved External Dependencies

- Production PostgreSQL connection string (configure in Vercel).
- OpenRouter API key (or other LLM provider) for automated research/drafting.
- Search provider credentials when automated research is desired.
- Email sending provider for approved outreach.

## Validation Metrics

- Qualified leads added
- Previews generated
- Outreach drafts approved
- Outreach sent
- Replies / positive replies
- Meetings booked
- Proposals sent
- Customers won
- Human minutes per prospect
- Automation cost per lead

## Vercel Deployment

### 1. Create a Vercel project

```bash
npm i -g vercel
vercel
```

### 2. Add a PostgreSQL database

Recommended: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or [Neon](https://neon.tech).

Copy the connection string.

### 3. Set environment variables

In the Vercel dashboard, go to **Project Settings → Environment Variables** and add:

| Name | Value |
|------|-------|
| `DATABASE_URL` | your Postgres connection string |
| `ADMIN_PASSWORD` | a strong admin password |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` |

Optional: set `ADMIN_PASSWORD_HASH` (bcrypt) instead of `ADMIN_PASSWORD`.

### 4. Deploy

Push to git or run:

```bash
vercel --prod
```

The build command runs `prisma generate && prisma migrate deploy && next build`, which applies migrations automatically.

### 5. Seed demo data

After the first deploy, visit:

```
https://your-domain.vercel.app/setup
```

Then log in at `/login` with your admin password.

### Local development

```bash
npm install
# Start local PostgreSQL, then:
npx prisma migrate dev
npm run db:seed
npm run dev
```

Visit `http://localhost:3000/setup` if you skipped seeding.
