# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the JobPilot Next.js App Router project. Changes include client-side initialization via `instrumentation-client.ts` (Next.js 15.3+ pattern), a reverse proxy through Next.js rewrites in `next.config.ts`, a shared server-side PostHog client in `lib/posthog-server.ts`, and targeted event captures across all key user flows — homepage CTA engagement, OAuth login initiation, authentication failures, user identification on the profile page, and sign-out.

| Event Name | Description | File |
|---|---|---|
| `oauth_initiated` | User clicks a social login button (Google or GitHub) on the login page. | `app/(auth)/login/page.tsx` |
| `oauth_error_displayed` | The login page renders with an auth error query param after a failed OAuth callback. | `app/(auth)/login/page.tsx` |
| `auth_callback_failed` | Server-side event captured when the OAuth callback returns an error or code exchange fails. | `app/api/auth/callback/route.ts` |
| `user_signed_out` | User clicks the sign out button and is successfully signed out. | `components/layout/SignOutButton.tsx` |
| `get_started_clicked` | User clicks the primary Get Started CTA button in the hero section. | `components/homepage/Hero.tsx` |
| `find_first_match_clicked` | User clicks the Find Your First Match secondary CTA button in the hero section. | `components/homepage/Hero.tsx` |
| `cta_clicked` | User clicks a call-to-action button in the bottom Features section. | `components/homepage/Features.tsx` |
| `profile_viewed` | Authenticated user successfully loads their profile page, marking post-login engagement. | `app/profile/page.tsx` (via `components/PostHogUser.tsx`) |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://eu.posthog.com/project/211667/dashboard/781922)
- [Signup Conversion Funnel](https://eu.posthog.com/project/211667/insights/l5gs47Du)
- [Homepage CTA Clicks Over Time](https://eu.posthog.com/project/211667/insights/v8xzDTyB)
- [OAuth Provider Breakdown](https://eu.posthog.com/project/211667/insights/lL9VTXE0)
- [Auth Failures Over Time](https://eu.posthog.com/project/211667/insights/Sn9Rwzkz)
- [User Sign-outs Over Time](https://eu.posthog.com/project/211667/insights/4BtLhQNF)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `posthog.identify()` fires when the profile page loads. If users stay logged in across sessions, ensure the `PostHogUser` component is rendered on every authenticated page so returning visitors are always identified.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
