# Where the design guide is stale

The design project's `astro/` folder was written against **Astro 5.x + Tailwind 3**. This repo runs **Astro 7** (`package.json`: `"astro": "^7.2.4"`, Node ≥22.12.0) and has **no Tailwind installed yet**, so it will land on Tailwind 4.

Every row below is a place where following the design guide literally produces broken or deprecated code. The **Use** column wins. The visual specs in `brand.md`, `component-specs.md` and `breakpoints.md` are unaffected — those are measurements, not APIs.

| Area | Design guide says | Use instead | Why |
| --- | --- | --- | --- |
| View transitions | `<ViewTransitions />` | `<ClientRouter />` from `astro:transitions` | Renamed. The old name no longer resolves. |
| Tailwind install | `@astrojs/tailwind` integration + `tailwind.config.mjs` | `npx astro add tailwind` → `@tailwindcss/vite` in `vite.plugins` | `@astrojs/tailwind` is deprecated; it exists only for legacy Tailwind 3. |
| Tailwind theme | `theme.extend` in `tailwind.config.mjs` | `@theme { ... }` in `src/styles/theme.css` | Tailwind 4 is CSS-first. There is no JS config file. See `assets/theme.css`. |
| Tailwind content glob | `content: ['./src/**/*.{astro,...}']` | *(nothing)* | v4 detects sources automatically. |
| Preflight opt-out | `tailwind({ applyBaseStyles: false })` | Keep Preflight; import `tokens.css` **after** `tailwindcss` | See "Preflight" below. |
| Breakpoints | `max-lg:` etc. against custom `--breakpoint-*` | `to-xl:` … `to-xs:` custom variants | Tailwind's own `max-*` variants use 640/768/1024/1280px. Overriding them makes every class ambiguous. See `breakpoints.md`. |
| Zod import | `import { defineCollection, z } from 'astro:content'` | `import { defineCollection } from 'astro:content'` + `import { z } from 'astro/zod'` | `z` is no longer re-exported from `astro:content`. |
| URL validation | `z.string().url()` | `z.url()` | Zod 4. The old chained form is deprecated. |
| Collection config path | `src/content.config.ts` | unchanged — still correct | Only flagged because `src/content/config.ts` is the older path. |
| `output` | `output: 'static'` | omit | Static is the default with no adapter configured. |
| Image service | `service: { entrypoint: 'astro/assets/services/sharp' }` | omit | Already the default. |

## The design project's example files do not compile as written

`astro/examples/Header.island.tsx` in the design project uses four class names that produce **no CSS** against `assets/theme.css`. Verified by compiling a fixture with Tailwind 4.3.3: `max-w-container`, `duration-instant` and `max-xs:*` emit nothing at all — they fail silently, so the layout is subtly wrong with no error anywhere.

| Original | Use | Why |
| --- | --- | --- |
| `max-w-container` | `max-w-page` | `theme.css` registers `--container-page: 1360px` |
| `max-xs:` / `max-sm:` | `to-xs:` / `to-sm:` | Tailwind's `max-*` are 640/768/1024/1280px, and `max-xs` does not exist at all |
| `duration-instant` | `duration-200` | Tailwind 4 has no named-duration theme namespace |
| `class=` (in `.tsx`) | `className=` | React island, not an `.astro` file |

Corrected copies of both worked examples live in `assets/examples/`. Use those, not the originals.

## Preflight

The design guide disables Tailwind's base styles (`applyBaseStyles: false`) on the reasoning that `tokens.css` owns the resets.

**Keep Preflight on.** `tokens.css` is not a complete reset — it sets `box-sizing`, `body` margin, and the scrollbar/selection rules, but it does not zero heading margins, does not set `img { display: block }`, and does not normalise lists. Dropping Preflight reintroduces browser default `h1`–`h6` margins, which the tight display type spec (line-height `.92`, `-.045em`) does not account for.

The ordering in `assets/theme.css` gives you both:

```css
@import "tailwindcss";   /* Preflight first */
@import "./tokens.css";  /* then tokens — they win on body, scrollbar, selection */
```

If Preflight ever does fight a token rule, opt out of that one layer rather than all base styles:

```css
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
/* preflight.css deliberately omitted */
```

## Default border colour changed

Tailwind 3 defaulted `border` to `gray-200`; the design's config overrode it to `var(--bd)`. **Tailwind 4 defaults to `currentColor`**, and `@theme` has no `--default-border-color` equivalent to that old `borderColor.DEFAULT` override.

So a bare `border` class paints the *text* colour — a bright hairline in dark mode, and badly wrong. Always write `border border-bd`, or use the `hairline` utility defined at the bottom of `assets/theme.css`.

`brand:check` flags a `border` utility with no `border-bd`/`border-ac`/`border-bd2` companion on the same element.

## Spacing scale

The v3 config hand-declared `1.5`, `2.5`, `4.5`, `5.5`, `6.5`, `11`, `14`, `21`. Tailwind 4's dynamic spacing scale generates all of these from `--spacing: 0.25rem` — `p-4.5` is 18px, `py-21` is 84px, `gap-6.5` is 26px. Only the named structural sizes (`header`, `statusbar`, `sidebar`) need declaring, and `assets/theme.css` does that.

## What did not change

Content collections keep the Astro 5+ shape: `defineCollection` with a `loader`, `glob()` from `astro/loaders`, `entry.id` as the slug, `render(entry)` rather than `entry.render()`, and `getEntry()` over the removed `getEntryBySlug()`. The lifecycle events `astro:page-load` and `astro:after-swap` are unchanged, so `interactivity.md` is accurate as written.

## When in doubt

Verify against current docs rather than assuming either source is right — use the `docs-lookup` skill, or context7 against `/withastro/docs`. Astro 7 is newer than most training data.
