# InvestorStack

InvestorStack is a workflow-oriented software directory and stack-recommendation engine for investment firms. It maps 35 tools across seven categories, exposes AI-readiness evidence, and produces deterministic profile recommendations and current-stack audits.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Seed mode requires no external services. Open `http://localhost:3000`.

## Verify

```bash
npm run check
```

```bash
npm run build
```

`check` validates all YAML, enforces external-copy rules, lints, type-checks and runs the test suite.

## Architecture

- Next.js 16 App Router and React Server Components for directory routes.
- Small client islands for theme, compare, stack builder, audit and lead forms.
- YAML data validated by Zod behind `ToolRepository`.
- Pure scoring, profile-ranking and stack-audit functions.
- Supabase schema and repository adapter ready but optional at runtime.
- Resend delivery ready but optional; missing credentials produce a validated synthetic path.

See [backend.md](docs/backend.md), [architecture decisions](docs/decisions.md) and the [implementation plan](docs/superpowers/plans/2026-06-21-initial-build.md).

## Data trust

Only Meeting Memory carries provisional numeric scores. Every other tool is deliberately unscored and shows qualitative fit plus API, MCP, webhook, export and authentication signals. Paid activity never changes rank or verdict.

## Environment

| Variable | Required | Purpose |
|---|---:|---|
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical metadata and sitemap URL |
| `USE_SUPABASE` | No | Select hosted data instead of validated YAML |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase only | Hosted project URL |
| `SUPABASE_SECRET_KEY` | Supabase only | Server-only repository and seed access |
| `RESEND_API_KEY` | Email only | Lead notification delivery |
| `RESEND_FROM_EMAIL` | Email only | Verified sender |
| `LEAD_NOTIFICATION_EMAIL` | Email only | Internal destination |

## Deployment

The repository is Vercel-ready. A credential-free production deployment uses seed mode; connect Supabase and Resend later without changing page code.
