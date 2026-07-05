# Memory — API Rate Limiting & Source Link Bug Fix

Last updated: 2026-07-05 21:58 (Local Time)

## What was built

- **Database-Backed Rate Limiter (`lib/rate-limit.ts`)**: Built a utility that enforces daily action limits per user. It performs a self-cleaning daily reset check (UTC-aligned) and updates usage counters atomically in the `profiles` table.
- **Table Schema Migration**: Altered the `profiles` table in InsForge to add `searches_today`, `researches_today`, `resumes_today` (integers), and `last_reset_date` (date).
- **Endpoint Protection**:
  - `/api/agent/find`: Rate limited to **5** searches per day.
  - `/api/agent/research`: Rate limited to **2** researches per day.
  - `/api/resume/generate` and `/api/resume/extract`: Combined rate limit of **5** resume actions per day.
- **Source Link Bug Fix (`components/job-details/CompanyResearch.tsx`)**: Refactored the source renderer so that only strings starting with `http://` or `https://` are rendered as clickable `<a>` tags. All other non-URL source strings (e.g., `"JOB POSTING"`, `"CANDIDATE PROFILE"`) are rendered as styled plain-text badges.
- **SEO & WhatsApp Previews (`app/layout.tsx`)**: Configured dynamic Next.js Metadata including Open Graph (OG) properties and Twitter Cards. Integrated a lightweight logo preview image (`/logo.png`, 35KB) for reliable WhatsApp link sharing previews, and large-card previews (`/images/dashboard-demo.png`) for Slack and Twitter.

## Decisions made

- **No Redis Dependency**: Chose database-backed rate limiting over Upstash Redis to keep the architecture simple, cost-free, and contained within the existing InsForge setup.
- **Pessimistic Incrementing**: Counters are incremented at the *start* of the request (before expensive API operations run). This prevents users from bypassing limits by making concurrent API requests before a single request completes.
- **Plain-Text Badges for Meta-Sources**: Kept semantic inputs from Gemini readable while disabling link-based routing for non-URL strings.

## Problems solved

- **Browserbase & Stagehand Cost Protection**: Strictly limited the headless company research agent to 2 runs/day, as Browserbase sessions are highly resource-intensive.
- **Redirect loop / 404 Bug**: Fixed the issue where clicking semantic sources (like `"JOB POSTING"`) redirected the user to `/find-jobs/JOB%20POSTING` (displaying a "Job listing not found" error page).
- **DOMMatrix Undefined Error on Vercel**: Fixed by adding `pdf-parse` to `serverExternalPackages` in `next.config.ts` and importing `pdf-parse/worker` directly in the extract endpoint, avoiding Vercel serverless bundle evaluation crashes.

## Current state

- All 17 core features from the build plan, the rate limiting system, and the source links fix are fully completed.
- Next.js production build (`npm run build`) compiles successfully without warnings.

## Next session starts with

- **Vercel Production Deployment**: Deploying the Next.js application to Vercel and configuring environment variables (Adzuna, Browserbase, Gemini, InsForge, PostHog).

## Open questions

- None.
