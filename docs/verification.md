# Verification record

## 2026-06-24 Humanist Compute Atelier rebuild

Status: local and live production verification passed.

### Passed

- `npm run check`: data validation, copy lint, ESLint, TypeScript and 24 Vitest tests passed.
- `npm run build`: 59 routes generated successfully with Next.js 16.2.9.
- `npm audit --audit-level=high`: passed. Two moderate upstream Next/PostCSS findings remain; the forced fix would downgrade Next.js.
- Targeted whitespace and conflict-marker scans passed for changed source, tests, docs and SVG assets.
- Production browser QA passed against `next start` on `127.0.0.1:3012`: no console/page errors and no horizontal overflow at 1440 by 1100 or 390 by 844.
- Browser flow verified firm name or URL input, local concept-only preview update, current-tool bricks, gap slips, recommendation sequence, evidence slips, Stack health output and mobile Compare cards.
- Pushed commit `d339276` to `origin/main`; production alias `https://investorstack.vercel.app` served the new Stack Builder copy.
- Live route checks returned 200 for `/`, `/stack-builder`, `/compare`, `/methodology`, `/categories/meeting-memory` and `/sitemap.xml`.
- Live browser smoke passed for Stack Builder desktop and Compare mobile with no console/page errors and no horizontal overflow.

### Evidence retained

- Source concept: `docs/concepts/humanist-compute-atelier-stack-builder-concept.png`.
- Archived previous aesthetic: `docs/archive/dark-investorstack-aesthetic/`.
- New favicon and graphic assets: `public/favicon.svg`, `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`, `public/graphics/stack-builder-bricks.svg`.
- Production screenshots:
  - `docs/verification/humanist-compute-atelier-home-desktop.png`
  - `docs/verification/humanist-compute-atelier-home-mobile.png`
  - `docs/verification/humanist-compute-atelier-builder-desktop.png`
  - `docs/verification/humanist-compute-atelier-builder-result.png`
  - `docs/verification/humanist-compute-atelier-compare-mobile.png`

### Scope verified by source inspection

- The theme toggle, `.dark` tokens and local-storage theme initialisation were removed from live source.
- Stack Builder is now a six-step guided ledger with concept-only firm name or URL input, local stack preview updates, current-tool bricks, gap slips, recommendation sequence and evidence slips.
- Category tables and Compare now include mobile card renderings.
- Humanist Compute Atelier tokens are the only live visual system.

## 2026-06-22 aesthetic overhaul

Verified the Institutional Pastoral Intelligence pass against production deployment `dpl_3ZKyS4wXB2KuppkFx6MGzsCQRnyN`.

- `npm run check`: data validation, copy lint, ESLint, TypeScript and 23 Vitest tests passed.
- `npm run build`: 59 routes generated successfully with Next.js 16.2.9.
- `npm audit --audit-level=high`: no high-severity vulnerabilities. The same two moderate upstream PostCSS findings remain; the forced fix would downgrade Next.js.
- Vercel production alias: `https://investorstack.vercel.app`, status Ready.
- Route checks returned 200 for `/`, `/stack-builder`, `/compare`, `/methodology`, `/categories/meeting-memory` and `/sitemap.xml`.
- Vercel production error logs: no logs found for the final deployment window.
- In-app browser production QA: desktop home, 390 by 844 mobile home, stack audit interaction, and console error checks passed.
- Local in-app browser access to `127.0.0.1` was blocked by Browser URL policy, so visual QA was performed against the deployed HTTPS production alias.

Fidelity ledger:

| Point | Result |
|---|---|
| Palette | Updated to parchment canvas, ivory surfaces, forest actions, teal intelligence accents, ochre labels and softer hairlines. |
| Typography | Preserved serif authority with tighter but readable home hero line-height, clean sans UI, and mono research labels. |
| Hero composition | Reworked from full-width orchard postcard to editorial/product split with a pastoral product scene. |
| Product proof | Added animated stack audit vignette with current stack, health, recommendation and evidence cards. |
| Information architecture | Added mode selector and moved the homepage towards workflow-first routing. |
| Audit surface | Added live stack map preview and softened cockpit treatment while keeping the full-width result table for legibility. |
| Mobile | Verified no horizontal overflow at 390px and preserved headline, CTAs and product scene hierarchy. |

Intentional deviation: the hero product proof is CSS-native animation rather than MP4/WebM for this pass. It keeps the workflow visible, avoids new video production overhead, and remains compatible with reduced-motion handling.
