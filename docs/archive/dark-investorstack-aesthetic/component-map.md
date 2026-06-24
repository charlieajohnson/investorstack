# Component Map

## Global shell

- `src/app/layout.tsx`: fonts, metadata, theme initialisation script and shell composition.
- `src/components/nav/top-nav.tsx`: primary navigation, audit CTA and theme toggle placement.
- `src/components/nav/theme-toggle.tsx`: dark-mode button and local-storage persistence.
- `src/components/common/footer.tsx`: footer copy and route links.

## Theme and layout

- `src/styles/tokens.css`: canvas, surface, ink, olive, teal, ochre, dark-mode and shadow tokens.
- `src/app/globals.css`: global layout, nav, hero, cards, tables, forms, animation and responsive rules.

## Product surfaces

- `src/app/page.tsx`: home hero, mode selector, workflow map, category cabinet, audit cockpit and methodology sections.
- `src/components/home/stack-audit-vignette.tsx`: animated audit preview.
- `src/components/stack/stack-builder.tsx`: two-tab profile/audit builder.
- `src/components/directory/category-grid.tsx`: category browse cards.
- `src/components/directory/category-ranking-table.tsx`: category ledger table.
- `src/components/compare/compare-explorer.tsx`: side-by-side comparison table.

## Preserved data and logic

The overhaul should not change the seed data contracts or deterministic recommendation logic unless explicitly required.

- `data/*.yaml`
- `src/lib/domain/recommendations.ts`
- `src/lib/domain/stack-audit.ts`
- `src/lib/domain/scoring.ts`
