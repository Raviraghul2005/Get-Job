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

#### Profile Placeholder Page
- **Path:** [page.tsx](file:///d:/get-job/get-job/app/profile/page.tsx)
- **Key Classes:**
  - Page wrapper: `flex flex-col min-h-screen bg-background bg-stripes`
  - Content container: `flex-grow max-w-[1400px] mx-auto w-full px-6 md:px-8 py-10`
  - Card container: `bg-surface border border-border rounded-2xl p-8 shadow-sm`
  - Avatar placeholder circle: `h-16 w-16 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-semibold`
  - Profile header divider: `flex items-center gap-4 mb-6 pb-6 border-b border-border`
  - Highlight note box: `bg-surface-secondary border border-border-light rounded-xl p-4 mt-6`

#### Sign Out Button
- **Path:** [SignOutButton.tsx](file:///d:/get-job/get-job/components/layout/SignOutButton.tsx)
- **Key Classes:** `inline-flex items-center justify-center border border-border bg-surface hover:bg-surface-secondary text-text-dark text-sm font-medium rounded-md px-3 py-1.5 transition-colors disabled:opacity-60`

