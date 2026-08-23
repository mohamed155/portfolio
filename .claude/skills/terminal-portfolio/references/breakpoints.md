# Responsive specs

## Container

| Property | Value |
| --- | --- |
| Max width | 1360px |
| Gutter | 32px; 18px below 680px |
| Header | 58px, fixed |
| Status bar | 28px, fixed; hidden below 760px |
| Section padding | 84px vertical |

## Breakpoints

The source files use six breakpoints, and not entirely consistently — the portfolio page breaks grids at 980/760 while the case studies use 1080/900/680. **Consolidate to these five** and apply them uniformly:

| Token | Width | Tailwind variant | What changes |
| --- | --- | --- | --- |
| `xl` | ≤1080px | `to-xl:` | Two-column splits (hero, about, narrative pairs) collapse to one; gap drops to 40px; `order` overrides clear so image/text pairs stack in source order |
| `lg` | ≤980px | `to-lg:` | Capability sidebar (284px) becomes a horizontally scrolling row; experience grid goes `40px 1fr`; 4-up strips go 2-up |
| `md` | ≤900px | `to-md:` | Remaining 4-up grids go 2-up |
| `sm` | ≤760px | `to-sm:` | Header nav → `≡` mobile menu; status bar hides; experience rows go single-column |
| `xs` | ≤680px | `to-xs:` | All grids single column; gutter 18px; theme-toggle label hides, leaving a 34px square; architecture rows stack their tag column |

These are **max-width** queries. The design was authored desktop-down; fighting that costs fidelity, so do not invert it to mobile-first.

## Why `to-*` and not `max-*`

Tailwind already ships `max-sm` / `max-md` / `max-lg` / `max-xl`, bound to **its own** breakpoints of 640 / 768 / 1024 / 1280px. This system's `xl` / `lg` / `md` / `sm` / `xs` are 1080 / 980 / 900 / 760 / 680px — different numbers under the same names.

Redefining `--breakpoint-xl` to 1080px would silently change what every built-in `xl:` and `max-xl:` means, and a reader could not tell which vocabulary a class belonged to. So `assets/theme.css` registers a separate, unambiguous set:

```css
@custom-variant to-xl (@media (width <= 1080px));
@custom-variant to-lg (@media (width <=  980px));
@custom-variant to-md (@media (width <=  900px));
@custom-variant to-sm (@media (width <=  760px));
@custom-variant to-xs (@media (width <=  680px));
```

Write `to-xl:grid-cols-1`, never `max-xl:grid-cols-1`. If you see `max-*` in this codebase it is a bug — it is pointing at a Tailwind default width, not a design breakpoint.

## Grid specs

| Surface | Desktop | Collapse |
| --- | --- | --- |
| Hero | `1.15fr .85fr`, gap 56px | 1 col at xl |
| About | `1.05fr .95fr` | 1 col at xl |
| Capabilities | `284px 1fr` | scrolling tab row at lg |
| Experience row | `40px 200px 240px 1fr`, gap 26px | `40px 1fr` at lg, 1 col at sm |
| Highlights strip | `repeat(4,1fr)` | 2-up at lg, 1 col at xs |
| Project article | `1fr 1fr`, gap 52px | 1 col at xl |
| Case-study meta | `repeat(4,1fr)` | 2-up at md, 1 col at xs |
| Quality grid | `repeat(4,1fr)` | 2-up at md, 1 col at xs |
| Decisions | `1fr 1fr`, gap 16px | 1 col at xl |
| Outcome row | `132px 1fr`, gap 20px | 1 col at xs |

These uneven fractional splits have no Tailwind utility. Use arbitrary values — `grid-cols-[1.15fr_.85fr]` — or a scoped `<style>` block. Do not round them to `grid-cols-2`; the asymmetry is part of the design.

## Minimum sizes

Body copy never below 13px. Labels never below 10px. Touch targets on mobile at least 44px — the `TabButton` at `min-height: 50px` already clears this; `Button` at `size="sm"` is 32px and **must not be used as a primary mobile action**.
