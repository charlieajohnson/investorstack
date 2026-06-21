# Verification record

## Automated gates

- `npm run check`: data validation, copy lint, ESLint, TypeScript and 23 Vitest tests passed.
- `npm run build`: 59 routes generated successfully with Next.js 16.2.9.
- `npm audit --audit-level=high`: no high-severity vulnerabilities. Two moderate upstream PostCSS findings remain; the suggested forced fix would downgrade Next.js to 9.
- Lighthouse home: performance 95, accessibility 100, FCP 0.8s, LCP 2.9s, TBT 20ms and CLS 0.
- Lighthouse tool page: performance 95, accessibility 100, FCP 0.8s, LCP 2.9s, TBT 60ms and CLS 0.

The retained Lighthouse reports are `lighthouse-home-final6.json` and `lighthouse-tool-final.json`.

## Browser flows

Verified in the in-app browser against the production build at desktop and 390 by 844 mobile dimensions:

1. Directory navigation from home to category and tool detail.
2. URL-backed comparison with two tools.
3. Profile-based stack recommendation.
4. Current-stack audit with incumbent-aware add-alongside guidance.
5. Synthetic lead submission, including validation and redacted server logging.
6. Dark-mode persistence and no-flash initialisation.
7. No horizontal overflow or console errors on the final mobile pass.

## Visual fidelity

Accepted source concepts:

- `docs/concepts/home-concept.png`
- `docs/concepts/stack-builder-concept.png`

Rendered evidence:

- `docs/verification/home-desktop-final.png`
- `docs/verification/home-mobile-final.png`
- `docs/verification/granola-desktop.png`
- `docs/verification/stack-audit-desktop-final.png`

The final home rendering preserves the concept's editorial three-line headline, warm paper palette, restrained serif and sans typography, orchard image band, rule-led navigation, workflow sequence and compact category preview. Mobile reflows the sequence and trims the hero band without changing hierarchy. Product copy follows the written specification rather than generated concept copy. The builder uses a full-width form before the health table instead of the concept's split form-and-summary arrangement; this keeps the 1320px audit table legible and avoids a compressed input column.
