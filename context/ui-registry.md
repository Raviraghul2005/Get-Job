# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Layout

#### Navbar
- **Path:** [Navbar.tsx](file:///d:/get-job/get-job/components/layout/Navbar.tsx)
- **Key Classes:** `w-full bg-surface border-b border-border h-16 sticky top-0 z-50`
- **Logo:** Image (`/images/logo.png`) rendered directly with `h-9 w-auto object-contain`
- **Center Nav Links:** `text-sm font-medium text-text-dark hover:text-accent`
- **Action Button:** `bg-text-darkest hover:bg-overlay-dark text-white text-sm font-medium rounded-md px-4 py-2`

#### Footer
- **Path:** [Footer.tsx](file:///d:/get-job/get-job/components/layout/Footer.tsx)
- **Key Classes:** `w-full bg-surface border-t border-border py-8 mt-auto`
- **Logo:** Same as Navbar
- **Links:** `text-xs font-medium text-text-secondary hover:text-accent`

### Homepage

#### Hero
- **Path:** [Hero.tsx](file:///d:/get-job/get-job/components/homepage/Hero.tsx)
- **Key Classes:**
  - Section wrapper: `relative w-full overflow-hidden bg-gradient-to-b from-accent-light/40 via-background to-surface pt-16 pb-20`
  - Headings: `text-4xl sm:text-5xl md:text-[64px] font-bold text-text-primary tracking-tight leading-[1.1]`
  - Secondary CTA: `bg-surface border border-border text-text-primary hover:bg-surface-secondary`
  - Mockup wrapper: `relative rounded-2xl overflow-hidden border border-border/80 shadow-2xl bg-surface`

#### Features
- **Path:** [Features.tsx](file:///d:/get-job/get-job/components/homepage/Features.tsx)
- **Key Classes:**
  - Section dividers: `border-b border-border`
  - Columns: `grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center`
  - Active item border highlight: `border-l-[3px] border-accent pl-6 py-4 bg-accent-muted/40`
  - Hover states: `hover:bg-surface-secondary`
  - Testimonial Quote: `text-xl sm:text-2xl md:text-[28px] font-medium text-text-primary`
  - Success Stories tag: `text-xs font-semibold text-info-dark tracking-widest uppercase`
  - Bottom CTA: `bg-gradient-to-b from-[#F3E8FF]/20 via-[#F6F7FB]/40 to-surface border-t border-border`

### Authentication (Feature 02)

#### Split-Screen Login & Signup
- **Path:** [page.tsx](file:///d:/get-job/get-job/app/(auth)/login/page.tsx)
- **Key Classes:**
  - Page wrapper: `min-h-screen bg-background bg-stripes flex items-center justify-center p-4 relative overflow-hidden`
  - Page blurs: `w-[700px] h-[700px] rounded-full bg-[#61A8FF]/10 blur-[140px] pointer-events-none absolute`
  - Outer card split container: `relative w-full max-w-[1080px] min-h-[640px] bg-surface border border-border/80 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12`
  - Left visual pane: `hidden lg:flex lg:col-span-5 bg-surface-secondary border-r border-border p-10 flex-col justify-between relative`
  - Job matched float card: `absolute -bottom-4 -left-4 bg-surface border border-border rounded-xl p-4 shadow-xl max-w-[200px] transform -rotate-2 hover:rotate-0 transition-transform duration-300`
  - Research status float badge: `absolute -top-3 -right-3 bg-surface border border-border rounded-xl px-3 py-1.5 shadow-md flex items-center gap-1.5 rotate-3`
  - Right form pane: `col-span-12 lg:col-span-7 flex flex-col justify-center items-center p-8 sm:p-12 bg-surface`
  - Google button (Standard secondary): `bg-surface border border-border hover:border-border-muted hover:bg-surface-secondary text-sm font-semibold text-text-primary rounded-xl px-5 py-3.5 shadow-sm hover:shadow transition-all`
  - GitHub button (Standard primary dark): `bg-text-darkest hover:bg-overlay-dark text-sm font-semibold text-white rounded-xl px-5 py-3.5 shadow-sm hover:shadow transition-all`

### Profile (Feature 05)

#### Profile Page

File: [page.tsx](file:///d:/get-job/get-job/app/profile/page.tsx)
Last updated: 2026-06-30

| Property         | Class                                                    |
| ---------------- | -------------------------------------------------------- |
| Background       | `bg-background` (no stripes — plain solid)               |
| Border           | none                                                     |
| Border radius    | none                                                     |
| Text — primary   | n/a (delegated to child components)                      |
| Spacing          | `max-w-3xl mx-auto px-6 md:px-8 py-10`                  |
| Section gap      | `space-y-6`                                              |
| Shadow           | none                                                     |

**Pattern notes:**
Profile page uses `bg-background` without `bg-stripes` — the stripe pattern is only for landing/auth pages. Content is narrower than other pages (`max-w-3xl` vs `max-w-[1400px]`) because it's a form-centric layout.

---

#### CompletionBanner

File: [CompletionBanner.tsx](file:///d:/get-job/get-job/components/profile/CompletionBanner.tsx)
Last updated: 2026-06-30

| Property         | Class                                                                |
| ---------------- | -------------------------------------------------------------------- |
| Background       | `bg-surface`                                                         |
| Border           | `border border-border`                                               |
| Border radius    | `rounded-2xl`                                                        |
| Text — primary   | `text-base font-semibold text-text-primary` (heading)                |
| Text — secondary | `text-sm text-text-secondary` (description)                          |
| Spacing          | `p-6`                                                                |
| Shadow           | `shadow-sm`                                                          |
| Accent usage     | `text-xs font-semibold text-accent uppercase bg-accent-muted border border-accent-light px-2 py-0.5 rounded-full` (tags) |
| Dynamic states   | **100% / >=80%**: `text-success` icon / `var(--color-success)` ring<br>**50-79%**: `text-warning` icon / `var(--color-warning)` ring<br>**<50%**: `text-error` icon / `var(--color-error)` ring |

**Pattern notes:**
Progress ring is a raw SVG (100×100 viewBox, radius 40, strokeWidth 6). Visual elements change colors, icons, titles, and descriptions dynamically based on the completion percentage ranges to provide interactive user feedback. Missing field tags use a rounded-full pill design with a light accent border.

---

#### ResumeUpload

File: [ResumeUpload.tsx](file:///d:/get-job/get-job/components/profile/ResumeUpload.tsx)
Last updated: 2026-06-30

| Property         | Class                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| Background       | `bg-surface`                                                                                   |
| Border           | `border border-border`                                                                         |
| Border radius    | `rounded-2xl`                                                                                  |
| Text — primary   | `text-sm font-medium text-text-primary`                                                        |
| Text — secondary | `text-sm text-text-secondary`, `text-xs text-text-muted`                                       |
| Spacing          | `p-6`, `space-y-5`                                                                             |
| Shadow           | `shadow-sm`                                                                                    |
| Accent usage     | `h-10 w-10 text-accent` (upload icon)                                                          |
| Upload area      | `border-2 border-dashed border-border rounded-xl p-8`                                          |
| Hover state      | `hover:border-accent/50 hover:bg-surface-secondary/50` (upload area)                           |
| Button primary   | `bg-accent text-accent-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-accent-dark` |
| Button secondary | `bg-surface border border-border rounded-md px-4 py-2 text-sm font-medium hover:bg-surface-secondary` |

**Pattern notes:**
Upload area uses `border-2 border-dashed` — this is the only place dashed borders appear. The hover on the upload area uses `/50` opacity modifiers. Generate button is the same primary button pattern used throughout.

---

#### ProfileForm

File: [ProfileForm.tsx](file:///d:/get-job/get-job/components/profile/ProfileForm.tsx)
Last updated: 2026-06-30

| Property          | Class                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Background        | `bg-surface`                                                                                                                       |
| Border            | `border border-border`                                                                                                             |
| Border radius     | `rounded-2xl`                                                                                                                      |
| Text — heading    | `text-lg font-semibold text-text-primary` (card title), `text-base font-semibold text-text-primary` (section heading)               |
| Text — secondary  | `text-sm text-text-secondary`                                                                                                      |
| Label             | `text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`                                                        |
| Spacing           | `p-6`                                                                                                                              |
| Section divider   | `mb-10 pb-10 border-b border-border` (between sections), last section uses `mb-8` with no border                                   |
| Shadow            | `shadow-sm`                                                                                                                        |
| Input             | `bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent` |
| Select            | Same as input + `appearance-none cursor-pointer` + custom chevron SVG                                                              |
| Disabled input    | `bg-surface-secondary text-text-muted cursor-not-allowed`                                                                          |
| Save button       | `w-full bg-accent text-accent-foreground rounded-md px-4 py-3 text-sm font-medium hover:bg-accent-dark`                            |

**Pattern notes:**
Section dividers use `border-b border-border` with `pb-10 mb-10` — this is the form section separator pattern. The last section before the save button uses `mb-8` with no border. All selects use a custom SVG chevron overlay (pointer-events-none absolute positioned). The save button is full-width and slightly taller than standard buttons (`py-3` vs `py-2`).

---

#### TagInput

File: [TagInput.tsx](file:///d:/get-job/get-job/components/profile/TagInput.tsx)
Last updated: 2026-06-30

| Property         | Class                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------- |
| Background       | `bg-surface` (input and tags)                                                             |
| Border           | `border border-border`                                                                    |
| Border radius    | `rounded-md` (input), `rounded-full` (tag pills)                                         |
| Text — primary   | `text-sm text-text-primary`                                                               |
| Text — muted     | `text-text-muted` (remove icon default)                                                   |
| Spacing          | `gap-2` (input + button row), `gap-2 mt-3` (tag pills)                                   |
| Hover state      | `hover:bg-surface-secondary` (Add button), `hover:text-text-primary` (remove icon)        |
| Tag pill         | `inline-flex items-center gap-1 bg-surface border border-border rounded-full px-3 py-1`   |
| Remove icon      | `h-3.5 w-3.5` (lucide X)                                                                 |

**Pattern notes:**
Tag pills always use `rounded-full` — this is the pill badge pattern. The Add button matches the secondary button pattern. Tags are displayed in a `flex-wrap` container with `gap-2`. The remove X icon is 3.5 (14px) — smaller than standard icons.

---

#### WorkExperienceCard

File: [WorkExperienceCard.tsx](file:///d:/get-job/get-job/components/profile/WorkExperienceCard.tsx)
Last updated: 2026-06-30

| Property         | Class                                                                      |
| ---------------- | -------------------------------------------------------------------------- |
| Background       | none (inherits from parent)                                                |
| Border           | `border border-border`                                                     |
| Border radius    | `rounded-xl` (slightly smaller than parent card's `rounded-2xl`)           |
| Text — label     | `text-xs font-semibold text-text-secondary uppercase tracking-wider`       |
| Spacing          | `p-5 space-y-4`                                                           |
| Shadow           | none                                                                       |
| Checkbox         | `h-3.5 w-3.5 rounded border-border text-accent focus:ring-accent`         |
| Checkbox label   | `text-xs text-text-secondary`                                             |
| Disabled state   | `bg-surface-secondary text-text-muted cursor-not-allowed`                  |
| Textarea         | Same as input + `resize-none`                                              |

**Pattern notes:**
Nested card within the ProfileForm — uses `rounded-xl` (one step smaller than the parent `rounded-2xl`). No shadow on nested cards. Checkbox is 3.5 (14px) matching the tag remove icon size. The "Currently working here" checkbox disables the End Date input.

---

#### ResumePDFTemplate

File: [ResumePDFTemplate.tsx](file:///d:/get-job/get-job/components/profile/ResumePDFTemplate.tsx)
Last updated: 2026-06-30

| Property         | Value/Styles                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Margins & Puffs  | `paddingTop: 36, paddingBottom: 36, paddingHorizontal: 40`                                                                                              |
| Header Accent    | `borderBottomWidth: 1.5, borderBottomColor: "#4f46e5"`                                                                                                 |
| Typography       | Helvetica, Helvetica-Bold, Helvetica-Oblique (Size 22 for name, 11 for title, 10 for section headings, 9 for main copy, 8 for bullets/details)         |
| Colors           | Primary: `#0f172a` (slate-900), Accent: `#4f46e5` (indigo-600), Body Text: `#334155` (slate-700), Secondary/Meta: `#64748b` (slate-500)                 |
| Spacing/Layout   | Two-column flex layout (`flexDirection: "row", gap: 18`), left column (main text) flex 1.8, right column (sidebar) flex 1.0                              |
| Skill Badges     | `backgroundColor: "#f8fafc", borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2.5, borderWidth: 0.5, borderColor: "#e2e8f0"`                    |

**Pattern notes:**
Specifically designed using `@react-pdf/renderer` primitive components (`Document`, `Page`, `Text`, `View`). Uses a custom two-column design that fits completed profiles on a single page, adhering strictly to React-PDF supported properties (no standard HTML tags or unsupported CSS properties).

---

#### Sign Out Button
- **Path:** [SignOutButton.tsx](file:///d:/get-job/get-job/components/layout/SignOutButton.tsx)
- **Key Classes:** `inline-flex items-center justify-center border border-border bg-surface hover:bg-surface-secondary text-text-dark text-sm font-medium rounded-md px-3 py-1.5 transition-colors disabled:opacity-60`

---

### Find Jobs (Feature 09)

#### FindJobsContainer
- **Path:** [FindJobsContainer.tsx](file:///d:/get-job/get-job/components/find-jobs/FindJobsContainer.tsx)
- **Key Classes:** `space-y-6`

#### SearchControls
- **Path:** [SearchControls.tsx](file:///d:/get-job/get-job/components/find-jobs/SearchControls.tsx)
- **Key Classes:**
  - Card wrapper: `bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4`
  - Input label: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`
  - Text input: `bg-surface border border-border rounded-md pl-10 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent w-full outline-none`
  - Primary button: `bg-accent text-accent-foreground hover:bg-accent-dark rounded-md px-5 py-2.5 text-sm font-medium transition-colors inline-flex items-center justify-center gap-2`
  - Success banner: `bg-success-lightest border border-success-light rounded-xl p-4 flex items-center gap-2 text-success-darker text-sm font-medium animate-fade-in`

#### JobsFilterBar
- **Path:** [JobsFilterBar.tsx](file:///d:/get-job/get-job/components/find-jobs/JobsFilterBar.tsx)
- **Key Classes:**
  - Wrapper: `bg-surface border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4`
  - Filter input: `bg-surface border border-border rounded-md pl-10 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent w-full outline-none`
  - Select input: `bg-surface border border-border rounded-md pl-4 pr-10 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors appearance-none cursor-pointer w-full md:w-auto min-w-[140px]`

#### JobsTable
- **Path:** [JobsTable.tsx](file:///d:/get-job/get-job/components/find-jobs/JobsTable.tsx)
- **Key Classes:**
  - Card wrapper: `bg-surface border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col`
  - Table: `w-full text-left border-collapse`
  - Headers: `px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider border-b border-border`
  - Row hover: `hover:bg-surface-secondary transition-colors group cursor-pointer`
  - Company icon: `bg-surface-secondary border border-border rounded-lg p-1.5 flex items-center justify-center h-9 w-9 flex-shrink-0 group-hover:bg-surface transition-colors`
  - Match score: `h-1.5 bg-border-light rounded-full flex-grow overflow-hidden`
  - Match colors: Green (`bg-success`), Blue (`bg-info`), Orange (`bg-warning`)
  - Footer wrapper: `border-t border-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4`
  - Page button active: `bg-accent-light text-accent border border-accent px-3 py-1.5 rounded-md text-xs font-semibold`
  - Page button inactive: `border border-border hover:bg-surface-secondary text-text-primary px-3 py-1.5 rounded-md text-xs font-semibold`

### Job Details (Feature 12)

#### JobInfo

File: [JobInfo.tsx](file:///d:/get-job/get-job/components/job-details/JobInfo.tsx)
Last updated: 2026-07-05

| Property         | Class                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Background       | `bg-surface` (main card), `bg-success-lightest` / `bg-info-lightest` / `bg-accent-muted` / `bg-surface-muted` (icons)                           |
| Border           | `border border-border`                                                                                                                         |
| Border radius    | `rounded-2xl` (main container and grid items), `rounded-xl` (icons and buttons)                                                                 |
| Text — primary   | `text-2xl font-bold text-text-primary` (title), `text-sm font-bold text-text-primary` (grid content)                                             |
| Text — secondary | `text-sm text-text-secondary` (company name), `text-[10px] font-bold text-text-muted tracking-wider uppercase mt-0.5` (grid labels)            |
| Spacing          | `p-6` (main container), `p-5` (grid items), `gap-4` (grid spacing), `mb-6` (page margin)                                                        |
| Hover state      | `hover:bg-surface-secondary` (View Job Post button)                                                                                             |
| Shadow           | `shadow-sm`                                                                                                                                     |
| Accent usage     | `text-accent` (view job link, back button hover)                                                                                                |

**Pattern notes:**
The layout houses a 4-column dynamic grid. To safeguard layout integrity, the text wrappers use `min-w-0` to force flex shrinking, and values use `line-clamp-2 break-words` to wrap long inputs onto two lines cleanly without overflowing.

---

#### MatchScore

File: [MatchScore.tsx](file:///d:/get-job/get-job/components/job-details/MatchScore.tsx)
Last updated: 2026-07-05

| Property         | Class                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Background       | `bg-surface` (cards), `bg-success-lightest` (sparkles badge), `bg-success-lightest` (have skills), `bg-accent-muted` (gap skills)               |
| Border           | `border border-border` (cards), `border-success-light` (have skills), `border-accent-light/50` (gap skills)                                     |
| Border radius    | `rounded-2xl` (cards), `rounded-full` (skills pills)                                                                                            |
| Text — primary   | `text-sm text-text-primary leading-relaxed whitespace-pre-line` (AI reasoning body)                                                            |
| Text — secondary | `text-[11px] font-bold text-text-secondary tracking-wider uppercase` (section headers)                                                          |
| Spacing          | `p-6` (cards padding), `space-y-6` (card list gap), `space-y-5` (skills sections gap), `gap-2` (skills wrap panel)                              |
| Hover state      | `hover:scale-[1.02]` (transition scale on skills pills hover)                                                                                   |
| Shadow           | `shadow-sm`                                                                                                                                     |
| Accent usage     | `text-success` (checkmark, sparkles), `text-accent` (gap crosses)                                                                               |

**Pattern notes:**
Renders two distinct full-width cards sequentially: one for AI reasoning and another for required skills vs candidate profile.

---

#### JobDescription

File: [JobDescription.tsx](file:///d:/get-job/get-job/components/job-details/JobDescription.tsx)
Last updated: 2026-07-05

| Property         | Class                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Background       | `bg-surface` (main card), `bg-surface-secondary` (header icon, benefits pills)                                                                  |
| Border           | `border border-border` (card), `border-b border-border` (header line), `border-border/60` (benefits pills)                                       |
| Border radius    | `rounded-2xl` (card), `rounded-lg` (header icon), `rounded-xl` (benefits cards)                                                                 |
| Text — primary   | `text-sm text-text-primary leading-relaxed whitespace-pre-line`                                                                                 |
| Text — secondary | `text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2`                                                                       |
| Spacing          | `p-6` (padding), `space-y-6` (about/responsibilities sections gap), `gap-3` (benefits card grid)                                                |
| Hover state      | `hover:text-accent-dark` (show more button hover)                                                                                               |
| Shadow           | `shadow-sm` (card), `shadow-xs` (benefits cards)                                                                                                |
| Accent usage     | `text-accent` (read more button), `text-success` (benefits check marks)                                                                         |

**Pattern notes:**
Includes smart truncation detection. If the description is a search preview snippet (ending with `...`), the client-side toggle button is suppressed, and a custom notice info box with a direct `"View Full Listing"` URL redirection link is rendered instead.

---

#### CompanyResearch

File: [CompanyResearch.tsx](file:///d:/get-job/get-job/components/job-details/CompanyResearch.tsx)
Last updated: 2026-07-05

| Property         | Class                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Background       | `bg-surface` (main card), `bg-surface-secondary` (empty icon, tech badges), `bg-success-lightest` (Your Edge box), `bg-accent-muted` (notice)  |
| Border           | `border border-border` (card), `border-b border-border` (header divider), `border-success-light/60` (Your Edge box), `border-accent-light` (notice) |
| Border radius    | `rounded-2xl` (card), `rounded-xl` (empty icon, Your Edge box, notices), `rounded-md` (tech badges)                                            |
| Text — primary   | `text-sm text-text-primary leading-relaxed`                                                                                                     |
| Text — secondary | `text-[11px] font-bold text-text-secondary uppercase tracking-wider`                                                                            |
| Spacing          | `p-6` (padding), `space-y-6` (sections gap), `py-12` (empty state padding), `gap-2` (empty container)                                           |
| Hover state      | `hover:bg-accent-dark` (research trigger button)                                                                                                |
| Shadow           | `shadow-sm` (card), `shadow-xs` (sources link wrapper)                                                                                          |
| Accent usage     | `bg-accent text-accent-foreground` (button), `text-success` (Your Edge checks), `text-accent` (warning banner)                                  |

**Pattern notes:**
Contains a dual layout rendering: an empty state with research trigger button (and mock loading handlers for Phase 13) or a structured 9-field dossier panel (Company Overview, Tech Stack, Culture, Role Context, Edge highlights, Gaps, Smart Questions, Interview Prep, and Sources).

---

#### JobActions

File: [JobActions.tsx](file:///d:/get-job/get-job/components/job-details/JobActions.tsx)
Last updated: 2026-07-05

| Property         | Class                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Background       | `bg-accent hover:bg-accent-dark`                                                                                                                |
| Border           | none                                                                                                                                            |
| Border radius    | `rounded-xl`                                                                                                                                    |
| Text — primary   | `text-accent-foreground font-bold py-4 text-sm tracking-wide`                                                                                   |
| Spacing          | `pt-2` (container padding), `py-4` (button vertical padding)                                                                                    |
| Hover state      | `hover:scale-[1.01] hover:shadow`                                                                                                               |
| Shadow           | `shadow-sm`                                                                                                                                     |
| Accent usage     | Primary brand color action button.                                                                                                             |

**Pattern notes:**
A sticky-width container housing the primary full-width Apply Now action link.

---

### Dashboard (Feature 14)

#### StatsBar
- **Path:** [StatsBar.tsx](file:///d:/get-job/get-job/components/dashboard/StatsBar.tsx)
- **Key Classes:**
  - Card background: `bg-surface border border-border rounded-2xl p-6 shadow-sm`
  - Trend badge: `text-success-darker bg-success-lightest px-2 py-0.5 rounded-sm`
  - Stat number: `text-[30px] font-semibold leading-[36px] text-text-primary`

#### RecentActivity
- **Path:** [RecentActivity.tsx](file:///d:/get-job/get-job/components/dashboard/RecentActivity.tsx)
- **Key Classes:**
  - Timeline line: `absolute left-2 top-4 w-[2px] h-[calc(100%+12px)] bg-border-light`
  - Timeline dot outer: `w-4 h-4 rounded-full border-2 border-surface flex items-center justify-center`
  - Dot colors: Purple (`bg-accent-light bg-accent`), Blue (`bg-info-light bg-info`), Green (`bg-success-light bg-success-alt`)

#### AnalyticsCharts
- **Path:** [AnalyticsCharts.tsx](file:///d:/get-job/get-job/components/dashboard/AnalyticsCharts.tsx)
- **Key Classes:**
  - SVG wrappers: `w-full h-full overflow-visible`
  - Grid lines: `stroke-[#E7EAF3] stroke-dasharray="4 4"`
  - Chart colors: Purple line (`stroke-[#7C5CFC]`), Blue research bars (`fill-[#61A8FF]`), Green match score bars (`fill-[#10B981]`)

#### ProfileBanner
- **Path:** [ProfileBanner.tsx](file:///d:/get-job/get-job/components/dashboard/ProfileBanner.tsx)
- **Key Classes:**
  - Wrapper: `bg-accent-muted border border-accent-light rounded-2xl p-5 shadow-sm`
  - Go to Profile CTA: `bg-accent hover:bg-accent-dark text-accent-foreground text-xs font-semibold rounded-md px-4 py-2.5 shadow-xs`





