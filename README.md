# Terminal Portfolio

Personal portfolio and case-study site for Mohamed Ramadan — Senior Frontend Engineer.

The design is terminal-inspired: two monospaced typefaces, zero rounded corners, hairline
rules instead of shadows, one high-chroma accent on a near-black (or paper) field, and
motion that behaves like text printed to a console.

Built with Astro 7, shipped as a fully static site. React is used only where a behaviour
genuinely needs JavaScript — everything else is static `.astro`.

## Stack

| | |
| --- | --- |
| Framework | [Astro 7](https://docs.astro.build) — static output, no adapter |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` |
| Islands | React 19 (`@astrojs/react`) |
| Content | `@astrojs/mdx` + content collections |
| SEO | `@astrojs/sitemap` |
| Types | TypeScript, `@astrojs/check` |

## Getting started

Requires **Node >= 22.12.0** (declared in `engines`).

```sh
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:4321`.

### Commands

All commands are run from the root of the project:

| Command | Action |
| :--- | :--- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start the local dev server at `localhost:4321` |
| `pnpm build` | Build the production site to `./dist/` |
| `pnpm preview` | Preview the build locally before deploying |
| `pnpm astro check` | Type-check every `.astro` / `.ts` / `.tsx` file |
| `pnpm astro ...` | Run CLI commands like `astro add` |

## Design system

Three rules define the brand. Breaking one doesn't read as a small deviation — it reads as
a different site.

1. **Border radius is 0.** Everywhere — buttons, chips, panels, the monogram, image frames.
2. **Box-shadow is none.** Depth comes from hairlines (`--bd`), structural rules (`--bd2`)
   and a barely-lifted panel fill (`--panel`).
3. **Two monospaces only.** Space Mono 700 for display, IBM Plex Mono for everything else.
   No sans, no third family, no icon library, no emoji.

Tailwind is configured extend-only, so off-brand utilities (`rounded-lg`, `shadow-md`,
`bg-slate-800`) still compile and look almost right. A brand-check script is the mitigation
— see [Verification](#verification).

### Tokens and theming

`src/styles/tokens.css` is the single source of truth for colour. Nothing else declares one.
Both themes live there: dark is the default, and `html[data-theme="light"]` is the paper
theme.

Swap `--acUser` to re-accent the entire site. Presets are listed in the file
(signal, flare, ice, bone).

Theme selection is persisted to `localStorage` under `mr-theme` and applied to `<html>` by a
**blocking inline script in `<head>`** before first paint — that script, not the island, is
what prevents a flash of the wrong theme. The header island only handles clicks afterwards.

Tailwind theme customisation lives in `src/styles/theme.css` via `@theme`. There is
deliberately **no `tailwind.config.mjs`** — Tailwind 4 ships as a Vite plugin.

## Project structure

Components follow an atomic ladder; each level composes only the level below it. A molecule
never writes a raw `<button>` when the `Button` atom exists, and layouts never contain page
copy.

```text
src/
├── styles/          Level 0 — tokens.css (colour) + theme.css (Tailwind @theme)
├── lib/             Shared data + browser helpers (see below)
├── components/
│   ├── atoms/       Level 1 — Button, Chip, Badge, Caret, NavLink, TabButton
│   ├── molecules/   Level 2 — Panel, SectionHeader, StatTile, MetaRow,
│   │                          TerminalLine, ScreenshotFrame, ThemeToggle, Monogram
│   └── organisms/   Level 3 — page sections; the only place islands appear
├── layouts/         Level 4 — BaseLayout, PageLayout, CaseStudyLayout
├── content/         Case studies (MDX)
├── content.config.ts
└── pages/           Level 5 — routes; content only
```

`src/lib/` holds the content that more than one page needs, so the homepage, `/work` and
`/resume` render the same data rather than drifting apart:

- `projects.ts`, `roles.ts`, `capabilities.ts` — shared content
- `sections.ts`, `useActiveSection.ts` — section registry + scroll-spy hook
- `reveal.ts` — the `IntersectionObserver` scroll-reveal, bound on `astro:page-load`
- `theme-init.ts` — the blocking pre-paint theme script, exported as a string

## Routes

| Route | Notes |
| :--- | :--- |
| `/` | Home. The only route that runs the boot sequence. |
| `/work` | Index of all projects. The in-progress project renders as a dashed block, not a link. |
| `/work/[slug]` | Case studies, generated from the content collection. |
| `/404` | Terminal-styled: a `$` prompt, `no such file or directory`, and a link home. |
| `/resume` | A real page in the design system with a print stylesheet, so it prints cleanly to PDF. |
| `/kitchen-sink` | Dev-only gallery of every atom and molecule, for visual checks. Excluded from the sitemap. |

## Islands

Five behaviours need JavaScript. Everything else is static.

| Island | Directive | Why |
| :--- | :--- | :--- |
| `Header.island.tsx` | `client:load` | Theme toggle + mobile menu must respond immediately |
| `Hero.island.tsx` | `client:load` | Stages the hero's typing sequence |
| `BootSequence.island.tsx` | `client:only="react"` | Decides from `sessionStorage`/`matchMedia` whether to render at all — an SSR pass would guarantee a hydration mismatch |
| `Capabilities.island.tsx` | `client:visible` | Tabs are below the fold on every viewport |
| `StatusBar.island.tsx` | `client:idle` | Cosmetic; never blocks interaction |

View Transitions (`<ClientRouter />`) keep the document alive across navigations, which means
any `useEffect` that animates on mount replays on every click. Islands that animate are gated
accordingly, and global listeners bind to `astro:page-load` rather than `DOMContentLoaded`.

## Content

Case studies live in `src/content/case-studies/*.mdx` and are validated by the Zod schema in
`src/content.config.ts`.

The collection is **structured frontmatter, thin body**: everything that repeats across case
studies — the meta strip, context cards, challenges, architecture layers, technical decisions,
quality grid, outcome — is typed frontmatter with exact lengths enforced, so a malformed case
study fails the build instead of rendering crooked.

Two notes when adding one:

- Set `draft: true` to keep an entry out of the build. Drafts get no route at all, so nothing
  can link to them.
- Image fields (`hero.src`, `features[].shot.src`) are optional strings resolved to
  `ImageMetadata` in `src/pages/work/[...slug].astro`. Omit one and it falls back to a hatch
  placeholder.

## Verification

There is no test suite. The verification story is:

```sh
pnpm astro check                                                  # 0 errors expected
node .claude/skills/terminal-portfolio-verification/scripts/brand-check.mjs
pnpm build
```

The brand check scans `src/` for the off-brand utilities Tailwind would otherwise compile
silently — `rounded-*`, `shadow-*`, and raw palette colours like `bg-slate-800` in place of the
token palette. A line can be exempted with a `// brand-check-ignore` comment; use it sparingly
and say why in the same comment.

New components should also be checked visually in **both themes** before being considered done.

## Design source of truth

`.claude/skills/terminal-portfolio/` is checked in and holds the design system's reference
documentation — brand rules, per-component pixel specs, breakpoints, the atomic map,
interactivity recipes and content conventions — alongside vendored copies of the files that
must not drift (`tokens.css`, `theme.css`, `content.config.ts`, `astro.config.mjs`).

If a reference doc and the live code disagree, the code is what ships — but the drift is worth
fixing in both places.

## Before deploying

`astro.config.mjs` still has the placeholder site URL:

```js
site: 'https://example.com',
```

Set it to the real domain first. The sitemap, canonical URLs and Open Graph image paths are all
absolute, and they are wrong until this is set.
