# Restoration Notes

To restore the archived aesthetic, start from commit `e58c7c8c671a90a5e64a2423a2424d44fc81f6b1`.

```bash
git checkout e58c7c8c671a90a5e64a2423a2424d44fc81f6b1 -- src/styles/tokens.css src/app/globals.css src/components/nav/top-nav.tsx src/components/nav/theme-toggle.tsx src/app/layout.tsx
```

Then restore any page/component files changed by the Humanist Compute Atelier pass if the visual system needs to return wholesale.

## Theme toggle

The light/dark toggle lived in:

- `src/components/nav/theme-toggle.tsx`
- `src/components/nav/top-nav.tsx`
- `src/app/layout.tsx`
- `.dark` tokens in `src/styles/tokens.css`
- `.theme-toggle` rules in `src/app/globals.css`

Restoring it also requires the `investorstack-theme` local-storage script in `layout.tsx`.

## Screenshots

Use the screenshots in `screenshots/` as visual references. They are not source assets for the live app.
