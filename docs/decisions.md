# Architecture decisions

## 2026-06-21: Current platform versions supersede the source pin

- **Decision:** Use Next.js 16.2.9, React 19.2.7, Tailwind CSS 4.3.1, Zod 4.4.3 and Supabase JS 2.108.2.
- **Why:** Registry and first-party checks show these as the current stable versions. The source build spec's Next.js 15 and Zod 3 pins are stale.
- **Rejected:** Preserve stale pins for literal spec fidelity; use canary releases.
- **Failure modes:** New major-version behaviour, particularly asynchronous route inputs and build-time service initialisation. Covered by strict types, lazy clients and a production build gate.

## 2026-06-21: Seed mode is the deployed source of truth

- **Decision:** Deploy validated YAML through `SeedRepository`; ship a real Supabase migration and adapter but keep `USE_SUPABASE=false`.
- **Why:** The portfolio build remains live without credentials while the database switch is one environment change after seeding.
- **Rejected:** Mock API routes around static data; require a hosted database for pass 1.
- **Failure modes:** Seed/database drift. Both paths parse the same schema, and the seed script copies canonical payloads.

## 2026-06-21: Make the stated spreadsheet-native re-ranking mathematically effective

- **Decision:** Weight human usability at 3.0, AI readiness at 0.4 and integration surface at 0.5 for spreadsheet-native profiles.
- **Why:** The source's 1.4 and 0.8 multipliers do not produce its stated Granola re-ranking. The implementation follows the behavioural requirement and tests it directly.
- **Rejected:** Preserve ineffective multipliers; hardcode Granola as a winner.
- **Failure modes:** Overweighting ease of use. Results are provisional, labelled and expose the profile assumption.

## 2026-06-21: Use deterministic recommendations in pass 1

- **Decision:** Compose rankings and stack verdicts from structured fields without an LLM call.
- **Why:** Lower latency and cost, reproducible outputs, and no rationale drift from editorial evidence.
- **Rejected:** Free-text LLM recommendations; static hand-authored result pages.
- **Failure modes:** Coarse heuristics. The UI labels the output provisional and preserves the evidence fields needed for later calibration.
