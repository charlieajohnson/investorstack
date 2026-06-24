# Theme Notes

## Previous aesthetic

The archived system presented InvestorStack as a warm institutional product surface:

- paper and orchard imagery
- deep olive and ochre accents
- Fraunces display type
- rounded panels and audit-cockpit cards
- animated stack audit vignette
- optional dark theme via `.dark` tokens
- visible sun/moon theme toggle in the nav

The product framing already moved away from a generic directory toward stack audit and recommendation, but the live UI still retained dashboard and form-cockpit habits.

## Preserved decisions

- Workflow-first positioning.
- Directory as evidence layer.
- Deterministic recommendations without an LLM call.
- Incumbent-aware verdicts: keep, add alongside, consider replacing and fill gap.
- Explicit provisional labels for incomplete scoring.
- Seed YAML as the deployed source of truth.

## Replaced decisions

- Optional dark theme is removed from the live app.
- The old toggle and local-storage persistence are removed.
- The Stack Builder becomes a guided one-question sequence with a persistent operating-stack preview.
- The visual metaphor moves from pastoral institutional software to atlas, ledger, cabinet, slips and stack bricks.
