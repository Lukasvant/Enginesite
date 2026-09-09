# Jubileum Engine handoff

## Current state

- Repository: `Lukasvant/jubileum-engine`, branch `main`; working tree was clean when this handoff was made.
- Production: https://jubileum-engine.vercel.app
- Vercel project root: `thetenmethodapp/jubileum-engine` (the directory intentionally has no spaces).
- Database: Neon/Postgres via Vercel. Prisma migrations run during Vercel builds.
- Authentication uses `ADMIN_PASSWORD`; keep it configured only as a Vercel secret.

## Product capabilities

- 22,352 companies were imported from Ambachtregister, with 22,352 corresponding leads. Import code is `scripts/import-ambachtregister.ts`.
- Historical research has added 29 verified foundation claims. Treat public company history and the legal KvK date as different facts.
- `/leads` is a capped work queue (100 results). It supports a persistent daily selection stored in `DailyOutreachBatch` / `DailyOutreachItem`.
- `Maak dagconcepten` prepares one preview and one email draft per selected company without sending anything.
- Lead detail supports editing, approving, copying, manually recording a sent message, pipeline activities and follow-up.
- Published previews include a CSS product mock-up, company timeline, and a separately labelled “De wereld toen…” era-context card. Era context is general editorial context, never a company claim. Data: `app/lib/era-context.ts`.
- Example preview: https://jubileum-engine.vercel.app/preview/c5ff220d-bd7e-42ac-849d-0d77d300d5b6

## Email integration

- Infomaniak SMTP support is implemented in `app/lib/email.ts` and used by `sendOutreach`.
- It sends only after an approved draft, an explicit user click, and a contact with an email address. A successful SMTP send is then recorded in the lead timeline.
- It uses `mail.infomaniak.com`, port 587, STARTTLS, with `lukas@ambachtio.nl` as default user/from address.
- Required Vercel secret (not configured by the code): `INFOMANIAK_SMTP_PASSWORD`. Optional variables are `INFOMANIAK_SMTP_USER` and `OUTREACH_FROM_EMAIL`; defaults are already `lukas@ambachtio.nl`.
- Never ask the user to paste a mail password into chat or commit it to the repository. Do not send a test email without a real recipient and explicit user direction.

## Important files

- `app/actions/companies.ts` — company/lead actions, daily selection, preview generation, draft and SMTP send flow.
- `app/actions/leads.ts` — work-queue data and today’s batch.
- `app/components/DailyOutreachSelector.tsx` — daily selection UI.
- `app/components/OutreachWorkspace.tsx` — draft review, manual/SMTP send UI.
- `app/lib/preview.ts` and `app/preview/[token]/page.tsx` — generated preview content and public preview page.
- `prisma/schema.prisma` and `prisma/migrations/20260908183000_add_daily_outreach_batches/` — daily batch persistence.

## Best next action

Set `INFOMANIAK_SMTP_PASSWORD` in the production Vercel environment, redeploy, then add one real contact email to a lead and send a single approved test message only after the user explicitly chooses the recipient.
