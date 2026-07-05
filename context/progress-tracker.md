# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 5 — Dashboard
**Last completed:** 16 Recent Activity — Real Data
**Next:** 17 Analytics Charts — PostHog Data

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [x] 05 Profile Page — Full UI
- [x] 06 Profile Save Logic
- [x] 07 AI Profile Extraction from Resume
- [x] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [x] 09 Find Jobs Page — Full UI
- [x] 10 Adzuna Job Discovery
- [x] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [x] 12 Job Details Page — Full UI
- [x] 13 Company Research Agent

### Phase 5 — Dashboard

- [x] 14 Dashboard Page — Full UI
- [x] 15 Stats Bar — Real Data
- [x] 16 Recent Activity — Real Data
- [ ] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

_Add decisions here as they are made during implementation._

- **SDK Package:** `@insforge/ssr` does not exist as a standalone package. The SSR API lives inside `@insforge/sdk@1.4.3` at `@insforge/sdk/ssr` (createBrowserClient, createServerClient, createAuthActions) and `@insforge/sdk/ssr/middleware` (updateSession).
- **Next.js 16 Proxy:** `middleware.ts` is renamed to `proxy.ts` in Next.js 16, with the export function renamed from `middleware` to `proxy`. Same API otherwise.
- **OAuth Flow:** Browser client (createBrowserClient) only exposes getCurrentUser/getProfile. OAuth initiation uses createClient from `@insforge/sdk` base package.
- **Upsert vs Update:** Profile records are saved using `.upsert()` rather than `.update()` to support accounts created before the auth database trigger was established.
- **RLS INSERT Policy:** Created an `INSERT` RLS policy on `public.profiles` allowing authenticated users to insert their own profile to resolve upsert failures.
- **Dynamic Progress Colors**: The CompletionBanner circular progress ring dynamically transitions colors (Red < 50%, Orange 50-79%, Green >= 80%) and changes titles/descriptions/icons based on percentage thresholds.
- **Secure Resume Download Proxy**: Created an authenticated API route `/api/resume/download` to stream private resumes from storage to resolve the 401 unauthorized issue when viewing resumes.
- **State-Sharing Component**: Created `ProfileContainer` client component to coordinate and share state between `ResumeUpload` and `ProfileForm` dynamically.
- **React Key Form Reset**: Leveraged a React `key` prop on `ProfileForm` to cleanly force-remount and populate the form states with parsed data when resume extraction succeeds.
- **PDF.js Worker Resolution**: Configured absolute `pdf.worker.mjs` path at runtime via `PDFParse.setWorker()` to bypass Turbopack dynamic resolution constraints on the server.
- **LLM Output Sanitization**: Implemented robust JSON cleaning (markdown stripping, outer brackets extraction, and trailing comma removal) combined with higher output token limits (4096 tokens) to guarantee resilient extraction parsing.
- **PDF Generation Engine**: Implemented `@react-pdf/renderer` to generate clean, professionally designed single-page resumes via `renderToBuffer` within a Next.js API Route Handler (`/api/resume/generate`).
- **Blob Casting for Storage**: Node `Buffer` from `@react-pdf/renderer` was wrapped as `new Blob([new Uint8Array(pdfBuffer)])` to match InsForge SDK's `File | Blob` signature.
- **Storage Consistency & Secure URLs**: Added explicit `remove` operation to delete existing resume files from the bucket prior to new uploads/generation. Set `resume_pdf_url` reference in the database to point to the authenticated route `/api/resume/download` rather than direct private storage URL to ensure secure user downloads.
- **Find Jobs Page & Navigation Links**: Built a client component `<NavLinks />` for the navbar to dynamically highlight the active route. Implemented client-side pagination, searching, sorting, and match scoring filters on a dataset of 24 realistic mock jobs to visually verify Feature 09.
- **Adzuna & Gemini Client-Server Pipeline**: Developed complete pipeline to fetch jobs from Adzuna API, score them in parallel with Gemini 2.5 Flash, write structured outputs to database using `insforge.database.from()`, log agent status to `agent_logs`, and trigger server-side PostHog events. Wired Find Jobs button to call this real API handler and render dynamic banners.
- **Real Database Jobs Wiring & Search Refinements**: Replaced all frontend `MOCK_JOBS_DATA` in `FindJobsContainer` with real database records queried in the `FindJobsPage` Server Component. Wired state updates using Next.js `router.refresh()` to fetch newly discovered jobs dynamically after search submission. Enhanced the client-side active query filter to use term-splitting for fuzzy/forgiving search results.
- **Interactive Research Agent Loading & Fallback**: Designed the `CompanyResearch` component to support both the loaded AI dossier structure and empty states. Integrated active loading/research state triggers and built a graceful 404/rejection fallback mechanism to prepare the UI for the Phase 13 agent integration.
- **Dynamic SEO Title/Description tags**: Integrated a `generateMetadata` exports block in the dynamic Server Component to fetch the job title/company names on demand, ensuring SEO standards.
- **Smart Description Ellipsis & Redirection**: Programmed `JobDescription` to identify already truncated search snippets (ending with `...` from the Adzuna API). It suppresses the redundant client-side expander toggle button and instead exposes a styled notice card with a direct `"View Full Listing"` redirection link, leading the user directly to the source URL.
- **Stagehand & Browserbase Integration**: Set up a server-side route `/api/agent/research` running a single Browserbase session controlled by Stagehand to scrape the company homepage and up to 3 relevant subpages sequentially, and then synthesize a structured 9-field company research dossier using Gemini 2.5 Flash.


