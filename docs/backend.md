# Backend scaffold

## Current runtime

The production-safe default is `USE_SUPABASE=false`. Pages read validated YAML through `ToolRepository`, so a fresh clone and Vercel deployment render without credentials. The lead endpoint validates, rate-limits and records a redacted synthetic event in function logs when delivery is unconfigured.

## Activate Supabase

1. Create or select a Supabase project.
2. Apply `supabase/migrations/20260621171542_initial_schema.sql` with the CLI.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and server-only `SUPABASE_SECRET_KEY` locally.
4. Run `npm run seed:supabase`.
5. Set the same variables in Vercel and change `USE_SUPABASE=true`.

The adapter parses every database payload through the same Zod contracts as seed mode. A malformed row fails explicitly rather than leaking shape drift into a page.

## Security model

- Categories, tools, workflows and guides receive explicit read-only grants for `anon` and `authenticated` plus permissive read policies.
- Every public-schema table has RLS enabled.
- Lead events have no public Data API grant or policy and are accessible only through server credentials.
- The server secret is never prefixed with `NEXT_PUBLIC_`.
- The migration follows Supabase's April 2026 opt-in Data API change by pairing explicit grants with RLS.

## Activate email delivery

Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL` and `LEAD_NOTIFICATION_EMAIL`. Resend is initialised lazily inside the route, so missing variables cannot break static generation.

## Remaining production hardening

Replace the per-instance memory rate limiter with Vercel Firewall or a durable rate-limit store before marketing traffic. Add consent and retention policy text before persisting personal data. Run the Supabase security advisors after the hosted project exists.
