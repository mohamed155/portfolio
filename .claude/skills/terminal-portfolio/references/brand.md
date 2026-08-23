# Terminal Portfolio — brand law

The design language of **Mohamed Ramadan's personal portfolio site** (senior frontend engineer, Alexandria, Egypt). A terminal-inspired system: two monospaced typefaces, zero rounded corners, hairline rules instead of shadows, one high-chroma accent on a near-black (or paper) field, and motion that behaves like text being printed to a console.

Primary source of truth: `Portfolio v2.dc.html` in the design project. The older `Portfolio.dc.html` (Plus Jakarta Sans, JetBrains Mono, blue/cyan/violet, rounded cards) is **superseded and not part of this system** — do not take anything from it.

## The three non-negotiables

1. **Border radius is 0.** Everywhere. Buttons, chips, panels, avatars, the monogram, image frames. This is the single most identifying rule of the system — a rounded corner reads as a different brand.
2. **Box-shadow is none.** Depth comes from 1px hairlines (`--bd`), a stronger rule for structural divisions (`--bd2`), and a barely-lifted panel fill (`--panel`).
3. **Two monospaces, no third family.** Space Mono 700 for display weight; IBM Plex Mono 300–600 for everything else. No sans, ever.

`npm run brand:check` enforces 1, 2 and the palette mechanically. See the `terminal-portfolio-verification` skill.

## Colour

One field colour, one accent, three text greys. Dark is default (`--bg #08090a` on `--fg #e9ebe8`); light is a warm paper (`--bg #f4f1e9` on `--fg #14150f`) — **not a white**.

Accent defaults to signal green `#00e5a0`. In light mode it is *derived, not literal*: `color-mix(in oklab, var(--acUser) 52%, #0b0d08)`. Keep it derived so swapping `--acUser` still produces a legible paper-mode accent.

Presets: signal green `#00e5a0`, flare orange `#ff5c1a`, ice `#7dd3fc`, bone `#e8e2d4`. Only ever **one** accent is live at a time.

There are no semantic red/amber/green states in the source. Availability is an accent dot plus words (`● available`, `● open to work`).

## Type

Display type is uppercase, letter-spacing `-.045em` at hero scale, line-height `.92`. Body copy runs 14–14.5px at line-height 1.8–1.85, capped at `62ch`. Labels run 10–11.5px uppercase, tracked `.1em`–`.2em`. Exact table in `component-specs.md`.

## Casing is a system, not a mood

- `lowercase` — chrome and navigation: `mohamed_ramadan`, `/ sr. frontend engineer`, `resume ↗`, `~/portfolio`, `background.md`, file paths, boot lines.
- `UPPERCASE` (via `text-transform`, tracked `.1em`–`.2em`) — section names, button labels, eyebrows, metadata keys, the hero `H1`.
- `Sentence case` — every piece of real prose: headings, body copy, role summaries, project descriptions.

## Voice

First person, plain, engineering-literal. Claims are specific and verifiable ("11 roles · 7+ yrs", "Rust/Axum API with pgvector") rather than adjectival. No hype words, no exclamation marks, **no emoji anywhere** — not in copy, not as icons.

"I" for everything the author did. "You" is never used. Companies and projects are named directly.

One idea per sentence, em-dash used sparingly to attach a qualifier. Technology lists are comma-joined inside prose and become chips outside it. Verbs are concrete: *built, led, architected, integrated, delivered, shipped*.

Verbatim examples from the site:
- Hero: `MOHAMED RAMADAN` / `senior frontend engineer` / `// building scalable digital experiences`
- Note panel: "Frontend engineering is my specialty. Full-stack and AI expand what I can build."
- Section header row: `01` · `About` · `background.md`
- Status bar: `~/portfolio` · `03 experience` · `scroll 42%`

**Numbering.** Sections, roles, projects and highlights are always zero-padded two-digit strings (`01`, `02`, … `11`) in accent or quiet grey. Counts appear as `06 domains`, `11 roles · 7+ yrs`.

**Terminal vocabulary.** `$` prompt, `>` boot marks, `whoami`, `//` comment prefix, `~/path`, `file.md`, `ok` / `ready` tails. Chrome and labels only — never actual prose.

## Borders and rules

Every section is separated by a full-width `--bd2` rule; every section opens with a header row (number · name · right-aligned meta) sitting on a `--bd` rule. Grid cells are divided by `border-left: 1px solid var(--bd)` **rather than gaps** — reaching for `gap` where the design uses a rule changes the look noticeably. Emphasis panels take `border-left: 3px solid var(--ac)`.

## Cards and panels

1px `--bd` border, `--panel` fill, square corners, 18–20px padding, an optional 10px uppercase accent eyebrow, then 13.5px body at line-height 1.75. Interactive cards change `border-color` to `--ac` and fill to `--panel` on hover — **nothing moves**.

## Imagery

There is no photography in the source. Images are represented by a **hatch placeholder**: a 45° 1px repeating stripe (`--stripe`) inside a bordered frame with a mock title bar (file path left, three 7px squares right, the last filled with accent). Ratios: 4/3 for project shots, 16/9 for the smaller "also shipped" grid.

Keep the placeholder rather than dropping in stock imagery; replace it only with a real product screenshot.

## Layout

Max width 1360px, 32px gutters (18px under 760px). Fixed 58px header, fixed 28px status bar at the bottom. Sections are 84px vertical padding. Content grids favour **uneven splits** (1.15fr / .85fr hero, 1.05fr / .95fr about, 284px sidebar + fluid panel for capabilities). Full table in `breakpoints.md`.

## Motion

Everything is a printer, not a spring.

- `print` — `clip-path: inset(0 100% 0 0)` wiping to full with `steps(16–26, end)`; the house reveal for text, header, meta rows.
- `rise` — 14px translate + fade, `.3–.35s`, `cubic-bezier(.2,.8,.2,1)`; chips and menu items, 30ms stagger.
- `fadein` — linear, `.12–.25s`; overlays and boot lines.
- `blink` — `1s step-end` infinite on every block caret; the status-bar caret runs at `1.4s`.
- Scroll reveals are IntersectionObserver-driven, `rootMargin: 0 0 -10% 0`, staggered up to 220ms.
- `prefers-reduced-motion` collapses all of it to 0.01ms and skips the boot sequence entirely.

## Hover, press, focus

Two hover patterns only: (1) *invert* — background goes `--ac` (or `--fg`), text goes `--acFg` (or `--bg`); (2) *warm* — text and border go from `--fg2`/`--bd` to `--ac`. Table rows warm their background to `--panel` and turn their row number accent. **Nothing scales, lifts, or shadows.** Transitions are `.18–.2s ease` on colour properties only.

No dedicated press state — the invert hover carries the interaction. Focus is `outline: 2px solid var(--ac); outline-offset: 2px` on `:focus-visible`, globally.

## Selection, scrollbar, transparency

`::selection` is accent fill with `--acFg` text. Scrollbars are 8px, track `--bg`, thumb `--bd`, accent on hover — part of the aesthetic, keep them.

**Blur is never used.** The only transparency is in the border and stripe tokens and `--acDim` (13% accent) behind lead chips. Overlays (mobile menu, boot screen) are **opaque** `--bg`, not scrims.

## Iconography

There is no icon library in this system, and none should be added. Glyphs are typographic:

- **Arrows and marks** — `→` (forward action), `↗` (external link), `✕` (close), `≡` (mobile menu), `●` (availability dot), `$` (prompt), `>` (boot line / active tab), `*` (primary category), `//` (comment).
- **Shapes** — hard squares standing in for indicators: the 8×8 accent square in the theme toggle, the 7×7 bordered squares in a screenshot title bar, the 6–9px accent block caret.
- **No emoji, ever.** No SVG icon set, no icon font, no PNG icons. The earlier portfolio version used Lucide; v2 removed it deliberately.

If a future surface genuinely needs a pictographic icon, use a monospace-compatible unicode glyph at the same size and colour as adjacent text before reaching for a library.

## No logo

There is no logo file anywhere in the sources. The mark is the **monogram tile**: the letters `MR` in Space Mono 700, white-on-accent, in a hard square (26×26 in the header, 24×24 in the footer). Do not draw or invent anything else.

## The "inline styles only" rule does not apply here

That constraint belongs to the component-authoring environment these designs were made in. In Astro, use Tailwind utilities and scoped `<style>` blocks. The *visual* rules above absolutely do apply.
