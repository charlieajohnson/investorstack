# InvestorStack Initial Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, validate, publish and deploy the pass-1 InvestorStack directory, recommendation engine and synthetic backend scaffold.

**Architecture:** Next.js 16 App Router and React Server Components render validated static seed data through a repository interface. Client islands own compare selection, stack recommendations, stack audit, theme and forms. Supabase is a build-complete but runtime-optional adapter; Vercel runs the seed-backed product without credentials.

**Tech Stack:** Next.js 16.2.9, React 19.2.7, TypeScript strict, Tailwind CSS 4.3.1, Zod 4.4.3, YAML, Vitest, Testing Library, Supabase JS 2.108.2, Resend 6.14.0, Vercel.

---

## File map

- `src/app/**`: routes, metadata and API boundary.
- `src/components/**`: shared visual system and interactive feature modules.
- `src/lib/domain/**`: schemas, scoring, recommendations and stack-audit rules.
- `src/lib/repository/**`: seed and Supabase implementations behind one interface.
- `data/**`: validated source-of-truth seed records.
- `supabase/migrations/**`: database schema, grants, RLS and policies.
- `scripts/**`: deterministic validation and copy/logo checks.
- `tests/**`: unit, component and route-contract tests.
- `docs/**`: design concepts, architecture decisions and operating notes.

### Task 1: Bootstrap and pin the platform

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/globals.css`
- Create: `.env.example`, `.gitignore`, `.node-version`

- [ ] Run `npx create-next-app@latest . --yes --force --typescript --tailwind --eslint --app --src-dir --import-alias '@/*' --turbopack --use-npm`.
- [ ] Pin Next.js 16.2.9, React 19.2.7, Tailwind 4.3.1 and Node 24 in package metadata.
- [ ] Add `typecheck`, `test`, `validate:data`, `lint:copy` and `check` scripts.
- [ ] Run `npm run typecheck` and expect exit 0.

### Task 2: Write tested domain contracts first

**Files:**
- Create: `src/lib/domain/schemas.ts`, `src/lib/domain/scoring.ts`, `src/lib/domain/recommendations.ts`, `src/lib/domain/stack-audit.ts`
- Test: `tests/scoring.test.ts`, `tests/recommendations.test.ts`, `tests/stack-audit.test.ts`

- [ ] Write tests for weighted overall scores, deterministic ranking tie-breaks and nullable unscored records.
- [ ] Run `npm test -- tests/scoring.test.ts` and confirm failure because implementations are absent.
- [ ] Implement the score schemas and pure scoring functions; rerun and expect pass.
- [ ] Write recommendation and audit tests covering maturity weights, budget/owner penalties, fill-gap and augment-not-replace verdicts; confirm red.
- [ ] Implement the minimum deterministic engines and rerun all domain tests green.

### Task 3: Build and validate the seed repository

**Files:**
- Create: `data/categories.yaml`, `data/tools.yaml`, `data/guides.yaml`, `data/workflows.yaml`
- Create: `src/lib/repository/tool-repository.ts`, `src/lib/repository/seed-repository.ts`, `src/lib/repository/index.ts`
- Create: `scripts/validate-data.ts`
- Test: `tests/repository.test.ts`

- [ ] Seed seven categories and at least 35 current tools, with scores only for Meeting Memory and explicit provenance fields for every record.
- [ ] Write repository contract tests and run them red before adding the implementation.
- [ ] Implement YAML loading, Zod validation, lookups and static-safe caching.
- [ ] Run `npm run validate:data` and `npm test -- tests/repository.test.ts`; expect exit 0.

### Task 4: Implement the visual system and shell

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/components/nav/top-nav.tsx`, `src/components/nav/theme-toggle.tsx`
- Create: `src/components/common/footer.tsx`, `src/components/common/tool-mark.tsx`, `src/components/common/status-tag.tsx`
- Modify: `src/app/layout.tsx`, `src/app/globals.css`

- [ ] Copy the approved concept renders into `docs/concepts/` and record the design inventory in `docs/design-system.md`.
- [ ] Implement exact light/dark tokens, Fraunces plus Geist fonts, hairline structure and the orchard hero asset treatment.
- [ ] Implement keyboard-visible navigation, no-flash theme bootstrapping and a responsive mobile nav.
- [ ] Add component tests for theme control labels and primary navigation.

### Task 5: Build the public directory and scorecards

**Files:**
- Create: `src/app/page.tsx`, `src/app/categories/page.tsx`, `src/app/categories/[slug]/page.tsx`, `src/app/tools/[slug]/page.tsx`
- Create: `src/components/directory/**`, `src/components/tool/**`

- [ ] Build the home sections in design-spec order with exact approved copy.
- [ ] Build category pages with real semantic tables, provisional/unscored states and best-for matrices.
- [ ] Build tool scorecards with seven score dimensions, AI-readiness signal grid, provenance, stack fit and update links.
- [ ] Add `generateStaticParams`, not-found handling and route-contract tests.

### Task 6: Build compare, recommendations and stack audit

**Files:**
- Create: `src/app/compare/page.tsx`, `src/app/stack-builder/page.tsx`
- Create: `src/components/compare/**`, `src/components/stack/**`

- [ ] Implement URL-backed comparison for two to four tools, with no fabricated scores.
- [ ] Implement the firm-profile flow and shareable result state.
- [ ] Implement current-stack mapping, qualitative health summary and deterministic per-category verdicts.
- [ ] Add interaction tests for compare selection, builder completion and audit output.

### Task 7: Complete content, lead and platform routes

**Files:**
- Create: `src/app/guides/page.tsx`, `src/app/guides/[slug]/page.tsx`, `src/app/methodology/page.tsx`, `src/app/submit-update/page.tsx`
- Create: `src/app/api/leads/route.ts`, `src/lib/leads.ts`, `src/components/lead/lead-capture-form.tsx`
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`, `src/app/not-found.tsx`, `src/app/error.tsx`
- Test: `tests/leads.test.ts`

- [ ] Write lead-validation tests for valid, honeypot, malformed and rate-limited submissions; confirm red.
- [ ] Implement lazy Resend initialisation and a synthetic success path when delivery is unconfigured.
- [ ] Implement three useful guides, methodology, correction flow and metadata.
- [ ] Run unit tests and verify all content routes build statically.

### Task 8: Add the Supabase backend scaffold safely

**Files:**
- Create: `supabase/migrations/20260621000000_initial_schema.sql`
- Create: `src/lib/repository/supabase-repository.ts`, `src/lib/supabase.ts`
- Create: `docs/backend.md`

- [ ] Mirror categories, tools, scores, guides and lead events in SQL with constraints and indexes.
- [ ] Revoke automatic grants, enable RLS everywhere, explicitly grant anonymous read-only access to public display tables, and keep lead-event writes server-only.
- [ ] Implement lazy client creation and seed fallback when environment variables are absent.
- [ ] Parse and smoke-check the migration locally; document the exact plug-in sequence.

### Task 9: Verify production quality and fidelity

**Files:**
- Create: `scripts/lint-copy.ts`, `docs/verification.md`

- [ ] Run `npm run check`, `npm audit --audit-level=high` and `npm run build`; require exit 0.
- [ ] Start the production build and use the in-app browser to test home, category, tool, compare, builder, audit, lead and dark mode flows.
- [ ] Capture desktop and mobile screenshots, inspect them with `view_image`, compare against both approved concepts, and fix every material mismatch.
- [ ] Run accessibility checks and Lighthouse on home and one tool route; record actual results.

### Task 10: Publish, deploy and update project records

**Files:**
- Create: `README.md`, `docs/decisions.md`, `vercel.json`
- Modify: `projects/investorstack/README.md`, `projects/investorstack/status.md`, `projects/investorstack/decisions.md`, `projects/investorstack/updates.md`, `ORIENTATION.md`

- [ ] Initialise Git, create a private `charlieajohnson/investorstack` GitHub repository, and commit the verified build as one coherent initial-build commit.
- [ ] Push `main`, link the Vercel project, deploy production and inspect the live deployment.
- [ ] Smoke-test the production URL and scan recent deployment logs for errors.
- [ ] Link the application repo from the workspace and record the version/deployment decisions and remaining credential/content open items.

