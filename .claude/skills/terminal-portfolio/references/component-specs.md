# Exact component specs

Build against these numbers. Every value is lifted from the source design, not approximated. Radius is `0` and box-shadow is `none` on every unit below — those two are not repeated per row.

## Type

| Role | Family | Weight | Size | Line height | Tracking | Transform |
| --- | --- | --- | --- | --- | --- | --- |
| Hero | Space Mono | 700 | `clamp(38px,9.4vw,132px)` | .92 | -.045em | uppercase |
| Display | Space Mono | 700 | `clamp(28px,6vw,76px)` | 1 | -.045em | uppercase |
| H2 | Space Mono | 700 | `clamp(24px,3.5vw,44px)` | 1.12 | -.04em | sentence |
| H3 | Space Mono | 700 | `clamp(21px,2.6vw,32px)` | 1.15 | -.035em | sentence |
| H4 | Space Mono | 700 | `clamp(19px,2.1vw,26px)` | 1.14 | -.02em | sentence |
| Card title | Space Mono | 700 | 15.5px | 1.15 | -.01em | sentence |
| Section name | Space Mono | 700 | 13px | 1.6 | .2em | uppercase |
| Lead | IBM Plex Mono | 400 | `clamp(14px,1.7vw,20px)` | 1.6 | .02em | lowercase |
| Body lg | IBM Plex Mono | 400 | 14.5px | 1.85 | 0 | sentence |
| Body | IBM Plex Mono | 400 | 14px | 1.8 | 0 | sentence |
| Body sm | IBM Plex Mono | 400 | 13.5px | 1.8 | 0 | sentence |
| Body xs | IBM Plex Mono | 400 | 13px | 1.75 | 0 | sentence |
| Meta value | IBM Plex Mono | 400 | 12.5px | 1.6 | 0 | sentence |
| Nav item | IBM Plex Mono | 400 | 11.5px | 1.6 | .06em | uppercase |
| Section meta | IBM Plex Mono | 400 | 10.5px | 1.6 | .1em | uppercase |
| Eyebrow | IBM Plex Mono | 400 | 10px | 1.6 | .16em | uppercase |
| Badge | IBM Plex Mono | 400 | 10px | 1.6 | .12em | uppercase |

Measures: body copy `62ch`, narrow copy `56ch`, headings `24ch`.

Tailwind v4 equivalents live in `assets/theme.css` — `text-hero`, `text-h2`, `text-body-sm`, `tracking-caps-widest`, `font-display`, `font-body`, `max-w-copy`, and so on. Use the utility, not a raw px value, so a token change propagates.

## Button

| Variant | Background | Text | Border | Hover |
| --- | --- | --- | --- | --- |
| solid | `--ac` | `--acFg` | transparent | bg `--fg`, text `--bg` |
| outline | transparent | `--fg` | 1px `--bd2` | bg `--fg`, text `--bg`, border `--fg` |
| ghost | transparent | `--fg2` | transparent | text `--ac` |
| quiet | transparent | `--fg2` | 1px `--bd` | text `--ac`, border `--ac` |

| Size | Padding | Height | Font size | Tracking |
| --- | --- | --- | --- | --- |
| sm | `0 11px` | 32px | 11px | .08em |
| md | `14px 20px` | auto | 12px | .1em |

Ghost overrides padding to `14px 16px` (md) / `0 8px` (sm). Gap between label and glyph 10px. Weight 500, uppercase. Transition `background .2s, color .2s, border-color .2s`. Disabled: `opacity .4`, `cursor not-allowed`, no hover. No press state.

Renders `<a>` when `href` is set, `<button>` otherwise.

## Chip

| Variant | Size | Padding | Font | Border | Background | Text |
| --- | --- | --- | --- | --- | --- | --- |
| default | md | `8px 11px` | 11.5px | 1px `--bd` | transparent | `--fg2` |
| default | sm | `4px 8px` | 10.5px | 1px `--bd` | transparent | `--fg2` |
| quiet | sm | `4px 8px` | 10.5px | 1px `--bd` | transparent | `--fg3` |
| lead | — | `9px 13px` | 13px / 500 | 1px `--ac` | `--acDim` | `--fg` |

Tracking .04em. Animation `rise .3s ease both`, stagger 30ms per item. Layout: flex + `gap: 8px` (6px for sm). Never interactive.

## Badge

| Variant | Background | Text | Border |
| --- | --- | --- | --- |
| accent | `--ac` | `--acFg` | 1px `--ac` |
| outline | transparent | `--ac` | 1px `--ac` |
| muted | transparent | `--fg3` | 1px `--bd` |
| status | — | `--ac` | none — `●` glyph + 6px gap, 10.5px, .1em |

Non-status: `3px 8px`, 10px, .12em, uppercase.

## Caret

| Size | Dimensions |
| --- | --- |
| sm | 6 × 11px |
| md | 7 × 13px |
| lg | 9 × 16px |
| inline | `.46em × .72em`, `vertical-align: -.02em` |

Background `--ac`, `animation: blink 1s step-end infinite` (1.4s in the status bar), `flex: none`, `aria-hidden`.

## NavLink

Padding `6px 11px`, gap 7px, font 11.5px, tracking .06em, uppercase. Index at 10px, `opacity .55`. Inactive `--fg2`; active/hover background `--ac`, text `--acFg`, border 1px `--ac`. Nav gap between items **2px** — they read as a strip. Transition `.18s`. No underline anywhere.

## TabButton

Padding `15px 18px`, min-height 50px, font 13px, tracking .02em, `border-bottom: 1px solid var(--bd)`, full width, text left. Active: background `--ac`, text `--acFg`, weight 600. Inactive `--fg2`. Leading glyph gap 9px: `>` active, `*` primary, blank otherwise. Count right-aligned, 10.5px, `opacity .65`. Transition `.18s`.

## Panel

Padding `18px 20px`. Border 1px `--bd`; `accentRule` replaces the left border with `3px solid var(--ac)`. Background `--panel` (or `--panel2` raised / `--bg` page). Label: 10px, .16em, uppercase, `--ac`. Body: 13.5px / 1.75, `--fg2`, 9px below the label.

## SectionHeader

Flex, `align-items: baseline`, gap 18px, `padding-bottom: 14px`, `border-bottom: 1px solid var(--bd)` (`--bd2` when `strong`). Index 11px / .1em / `--ac`. Title Space Mono 700, 13px, .2em, uppercase, `--fg`. Meta `margin-left: auto`, 10.5px, .1em, `--fg3`. Sits 32–56px above its content.

## StatTile

Padding `28px 24px 26px`, `border-left: 1px solid var(--bd)`, flex column, gap 10px. Index 10.5px / .16em / `--ac`. Value Space Mono 700 `clamp(17px,1.9vw,23px)` / 1.15 / -.03em / `--fg`. Label 10.5px / .13em / uppercase / `--fg3`. Description 12.5px / 1.7 / `--fg2`. The containing grid takes `border-top` and `border-bottom` of 1px `--bd2`.

## MetaRow

Grid `132px 1fr`, gap 16px, padding `11px 0`, `border-bottom: 1px solid var(--bd)`. Key 10.5px / .1em / uppercase / `--fg3`, `padding-top: 2px`. Value 12.5px / 1.6 / `--fg`. Animation `print .34s steps(16,end) both`, stagger 75ms.

## TerminalLine

Flex, gap 12px, font 13px / 1.9 / .02em. Mark `--ac`. Text `--fg2` (or `--fg` strong). Tail `margin-left: auto`, `--fg3`. Animation `fadein .12s linear both`. Boot reveal interval 230ms.

## ScreenshotFrame

Outer: 1px `--bd`, background `--panel`. Title bar: `10px 13px`, `border-bottom: 1px solid var(--bd)`, path 10.5px / .06em / `--fg3`; three 7×7px squares on the right with 5px gap — first two `1px solid var(--bd2)`, third filled `--ac`. Body: `aspect-ratio` 4/3 (project) or 16/9 / 16/10 (secondary), centred column, gap 12px, background `--hatch`. Labels: `SCREENSHOT` 10.5px / .2em / `--fg3`; caption `6px 12px`, 1px `--bd`, background `--bg`, 12px, `--fg2`.

With an image: render `<Image>` filling the body, `object-fit: cover`, and drop both hatch labels. Keep the title bar in both states.

## ExperienceRow

Grid `40px 200px 240px 1fr`, gap 26px, padding `24px 8px`, `align-items: start`, `border-bottom: 1px solid var(--bd)`. Index 11px / .08em / `--fg3`, `padding-top: 3px`. Dates 12px / .06em / `--fg2`; place 11px / .06em / `--fg3`, 6px below. Company Space Mono 700 15.5px / -.01em / `--fg`; title 12.5px / 1.6 / `--ac`, 7px below. Summary 13.5px / 1.8 / `--fg2`, max `62ch`; chips 14px below at `gap: 6px`.

Hover: row background → `--panel`, index → `--ac`. Transition `background .2s`. Nothing moves, scales or lifts.

## StatusBar

Height 28px, fixed bottom, `z-index: 70`, background `--bg`, `border-top: 1px solid var(--bd)`. Flex, gap 18px, padding `0 18px`. Font 10.5px / .1em / uppercase / `--fg3`. Path in `--ac`. Percent `margin-left: auto`, zero-padded. Trailing caret 6×11px at `blink 1.4s`.

## Header

Height 58px, fixed, `z-index: 80`, background `--bg`, `border-bottom: 1px solid var(--bd)` — thickening to `--bd2` once `scrollY > 16`. Container 1360px, padding `0 32px`, gap 24px. Monogram 26×26px, Space Mono 700 12px, `--acFg` on `--ac`; wordmark 12.5px / .02em; role suffix 11.5px / .04em / `--fg3`. Nav `margin-left: auto`. Reveal `print .5s steps(24,end)`.

## Motion

| Name | Definition | Used for |
| --- | --- | --- |
| `print` | `clip-path: inset(0 100% 0 0)` → full, `steps(16–26, end)` | Text, headers, meta rows — the house reveal |
| `rise` | 14px translate + fade, .3s `cubic-bezier(.2,.8,.2,1)` | Chips, menu items; 30ms stagger |
| `fadein` | linear .12–.25s | Overlays, boot lines |
| `blink` | `1s step-end` infinite | Carets (1.4s in status bar) |
| `flow` | 2.4s linear infinite, 26px travel | Architecture connector dots; 350ms stagger |

Scroll reveals: `IntersectionObserver`, `rootMargin: 0px 0px -10% 0px`, threshold .06, stagger `min(i × 55ms, 220ms)`, unobserve after firing.

Boot sequence: 6 lines at 230ms, 700–900ms hold, then hero types — 52ms prompt, 62ms per hero letter, 22ms role line, 14ms comment line — then four content blocks print at 170ms.

`prefers-reduced-motion: reduce` collapses every duration to .01ms and skips the boot sequence entirely.
