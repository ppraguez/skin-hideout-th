## Why the UI keeps glitching

Two issues are stacking up, and both produce the "content jumping" you're seeing in the Lovable preview and on localhost:

1. **Google Fonts are loaded the wrong way.** `src/styles.css` uses `@import url("https://fonts.googleapis.com/...")` for Syne, DM Sans, and JetBrains Mono. Lightning CSS (the Tailwind v4 compiler) tries to resolve that URL from the filesystem and fails, which is what causes the intermittent `500 for /src/styles.css` errors you've been hitting. When that happens the page renders briefly with **no styles at all**, then snaps back once a retry succeeds — classic "glitch".
2. **No font preloading + FOUT.** Even when the import works, the fonts arrive *after* the first paint, so headings reflow from the system fallback (DM Sans/Syne are very different widths from system-ui). That's the persistent "content jumping" on every fresh load.

## The fix

### 1. Load fonts via `<link>` tags in the root route (not via CSS `@import`)

In `src/routes/__root.tsx`, extend the existing `head()` `links` array with:

- `preconnect` to `https://fonts.googleapis.com`
- `preconnect` to `https://fonts.gstatic.com` (crossOrigin: "anonymous")
- a single `stylesheet` link combining Syne + DM Sans + JetBrains Mono with `display=swap`

This is the canonical TanStack Start pattern and removes the Lightning CSS failure mode entirely.

### 2. Remove the URL `@import` from `src/styles.css`

Delete line 4 (`@import url("https://fonts.googleapis.com/...")`). Keep the `--font-sans`, `--font-display`, and `--font-mono` declarations in `@theme` — they just reference the family names, which now arrive via the `<link>` tag.

### 3. Stop the auth-state flicker on the home page (small bonus)

While verifying, also gate the header/hero auth-dependent UI (the Connect Steam vs. signed-in avatar) on the auth `isLoading` flag so it doesn't render the wrong state for one frame on hard refresh. Render a neutral placeholder (same width as the button) while loading to avoid a width jump.

## Verification

- Hard-refresh `/` in the preview a few times — no more white flash, no `/src/styles.css` 500 in the runtime errors panel.
- Headings should not visibly resize after load (fonts arrive before first meaningful paint thanks to preconnect).
- Connect Steam button area should not flip state after mount.

## Files touched

- `src/styles.css` — remove the Google Fonts `@import url(...)` line.
- `src/routes/__root.tsx` — add preconnect + stylesheet `<link>` entries to `head().links`.
- `src/routes/index.tsx` (only the header/hero auth block) — guard on `isLoading` with a same-size placeholder.

No business logic, no backend, no route changes.