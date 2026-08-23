---
name: terminal-portfolio-verification
description: Use when finishing or reviewing any part of the terminal portfolio — before claiming a component, section, page or atomic level is done, before committing or opening a PR, when setting up CI or the brand-check script, or when checking theme flash, CLS, font loading, responsive fidelity or accessibility against the design sources.
---

# Terminal Portfolio — verification

The design has two rules that Tailwind cannot enforce (radius 0, no shadows) and a set of measurements that are invisible when wrong in isolation and obvious in a diff. This skill is the gate.

**Do not claim a level is done without running the checks for that level and reading the output.**

## Install the brand check

`scripts/brand-check.mjs` in this skill folder is ready to use. Copy it to `scripts/brand-check.mjs` in the repo root and wire it up:

```json
{
  "scripts": {
    "brand:check": "node scripts/brand-check.mjs",
    "verify": "astro check && npm run brand:check && astro build"
  }
}
```

Run `npm run verify` in CI. It catches:

| Pattern | Why |
| --- | --- |
| `rounded-*` | radius is 0 everywhere (`rounded-none` is allowed) |
| `shadow-*` | no drop shadows (`shadow-none` allowed) |
| `bg-slate-800`, `text-blue-500`, … | use the token palette only |
| `font-sans` / `font-serif` / `font-mono` | only `font-display` and `font-body` exist |
| `blur-*` / `backdrop-blur-*` | blur is never used |
| `max-lg:` and friends | Tailwind default widths, not this system's breakpoints — use `to-*` |
| bare `border` with no `border-bd` | Tailwind 4 defaults border-color to `currentColor` |
| `<ViewTransitions />`, `@astrojs/tailwind` | stale Astro 5 / Tailwind 3 APIs |

Exempt a line with a `brand-check-ignore` comment, and say why in the same comment.

## Per-level gates

Do not advance a level until all of these pass.

**Level 0 — Foundation.**
- Both themes switch on click and persist across reload.
- No light frame on a cold load in dark mode. Throttle CPU 4× and watch the first paint — the blocking `<head>` script is what prevents this, not the island.
- CLS is 0 with the network throttled to Slow 3G. A non-zero CLS on the hero means a font preload is missing.
- `tokens.css` is the only file declaring a colour.

**Levels 1–2 — Atoms and molecules.**
- Open `/kitchen-sink` and compare each unit against `component-specs.md` in the `terminal-portfolio` skill, with devtools: measure padding, font-size, line-height, letter-spacing and border colour on **at least one instance of every variant**.
- Check every unit in **both themes**.
- Confirm computed `border-radius` is `0px` and `box-shadow` is `none` on all of them.

**Level 3 — Organisms.**
- Compare against the `.dc.html` sources side by side at 1440px, 1024px, 768px and 390px.
- Grid column widths must match `breakpoints.md` exactly — these are the values most often eyeballed and got wrong.
- Verify hover states are colour-only: nothing scales, lifts or shadows.

**Levels 4–5 — Templates and pages.**
- Navigate between every route **twice** and confirm: the boot sequence does not replay, the mobile menu closes, scroll listeners still fire, and the status bar percent still updates.

## Font loading and CLS

Space Mono and IBM Plex Mono are both metric-unlike the system monospace fallback, so a late swap shifts the hero measurably. Self-host under `public/fonts/` rather than using the Google CDN, and preload **only** what the first screen paints.

```astro
<!-- BaseLayout.astro <head>, in this order -->
<link rel="preload" href="/fonts/space-mono-700.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/ibm-plex-mono-400.woff2" as="font" type="font/woff2" crossorigin />
```

```css
@font-face {
  font-family: "Space Mono";
  src: url("/fonts/space-mono-700.woff2") format("woff2");
  font-weight: 700;
  font-display: swap;
  size-adjust: 100%;
}
```

Preload Space Mono 700 and IBM Plex Mono 400 only — the other four weights are below the fold. Use `font-display: swap` and subset to `latin`.

## Measuring against the source

The `.dc.html` files in the design project are the reference. To compare a section:

1. Open the source file and your Astro route in two windows at the same width.
2. Screenshot both, then diff them in an image editor at 100%. Do not judge by eye at a glance — a 2px padding difference is invisible in isolation and obvious in a diff.
3. Where they differ, **the spec table wins over both.** The sources contain minor inconsistencies (the portfolio page breaks grids at 980/760, the case studies at 1080/900/680) that `breakpoints.md` deliberately normalises.

## Accessibility floor

- Everything keyboard-reachable, with `:focus-visible` showing the 2px accent outline.
- `aria-expanded` on the menu trigger.
- `role="tablist"` / `role="tab"` with arrow-key navigation on the capability tabs.
- `aria-hidden` on every decorative caret and glyph.
- Run axe on `/` and one case study.
- Check contrast in **both** themes — paper mode's derived accent is the one that fails first if `--acUser` is changed.

## Deployment

Static output, so any host works. **Set `site` in `astro.config.mjs` before building** or the sitemap and OG URLs are silently wrong.

```
npm run verify        # astro check + brand check + build
npx astro preview     # confirm the built output, not the dev server
```

Cache `/_astro/*` and `/fonts/*` immutably for a year; leave HTML uncached. Add `public/robots.txt` pointing at `/sitemap-index.xml`.

Check the built `dist/` for stray CSS — if the bundle is much over ~15KB gzipped, Tailwind is emitting utilities nothing uses.

## Reporting

State what you ran and what it printed. If a check did not run, say so rather than implying it passed. `astro check` and `brand:check` both exit non-zero on failure — quote the failure, do not summarise it away.
