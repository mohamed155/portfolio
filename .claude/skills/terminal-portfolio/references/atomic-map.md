# Atomic map & file tree

Classic five levels. Tokens are config, not components.

**Composition rule.** A unit may only compose units from levels below it. A molecule that needs a button imports `Button`; it never writes a raw `<button>`. If you find yourself needing a sibling at the same level, the thing you actually need belongs one level down.

**Island rule.** An island may live at any level, but it must live at the *highest* level that owns the state. `ThemeToggle` is a molecule, but its state belongs to the header — so there is no `ThemeToggle.island.tsx`; `Header.island.tsx` owns it. Islands are named `X.island.tsx` and sit beside `X.astro`.

## Atoms (6)

| Unit | Variants | Notes |
| --- | --- | --- |
| `Button` | solid, outline, ghost, quiet × sm, md | Renders `<a>` when `href` is set |
| `Chip` | default, quiet, lead × sm, md | Static, never interactive |
| `Badge` | accent, outline, muted, status | `status` is the `●` availability line |
| `Caret` | sm, md, lg, inline | `aria-hidden`, decorative |
| `NavLink` | active / inactive | Numbered, inverts to accent on hover |
| `TabButton` | active, primary, count | Leading glyph `>` / `*` / blank |

## Molecules (8)

| Unit | Composes | Notes |
| --- | --- | --- |
| `Panel` | — | Optional accent eyebrow, optional 3px accent left rule |
| `SectionHeader` | — | Index · name · right-aligned meta, on a hairline |
| `StatTile` | — | Cell in the 4-up strip; divided by left hairlines |
| `MetaRow` | — | 132px key column + value |
| `TerminalLine` | — | Accent mark, lowercase text, right-aligned result |
| `ScreenshotFrame` | — | Optional `ImageMetadata`, hatch fallback |
| `ThemeToggle` | — | 8px accent square + theme name; state owned by Header |
| `Monogram` | — | `MR` tile, 26px header / 24px footer |

## Organisms

Home: `Header` (+island), `BootSequence` (+island), `Hero`, `ProfilePanel`, `HighlightsStrip`, `Capabilities` (+island), `ExperienceList`, `ExperienceRow`, `SelectedWork`, `ProjectArticle`, `AlsoShipped`, `ContactSection`, `Footer`, `StatusBar` (+island), `MobileMenu` (inside Header island).

Case study: `CaseStudyHero`, `ContextGrid`, `ChallengeList`, `RoleGrid`, `ArchitectureDiagram`, `DecisionGrid`, `FeatureSplit`, `QualityGrid`, `OutcomeList`, `NextProject`.

`ExperienceRow` sits at organism level, not molecule: it is a four-column compound with its own hover behaviour and it composes `Chip` and `Badge`.

## Templates (3)

`BaseLayout` — `<head>`, fonts, the blocking theme script, `theme.css`, `<ClientRouter />`, a bare slot. Nothing visible.
`PageLayout` — BaseLayout + Header + StatusBar + Footer + the 1360px container.
`CaseStudyLayout` — PageLayout, plus the numbered-section rhythm and the scroll-reveal observer.

> The design guide says `<ViewTransitions />` here. That component was renamed. On Astro 7 it is `<ClientRouter />` from `astro:transitions` — see `astro-7-deltas.md`.

## Pages (5)

`index.astro`, `work/index.astro`, `work/[...slug].astro`, `404.astro`, `resume.astro`.

## File tree

```
src/
  styles/
    tokens.css             # copy verbatim from assets/
    theme.css              # copy verbatim from assets/ — imports tailwind + tokens
  lib/
    theme-init.ts          # exported string, inlined by BaseLayout
    reveal.ts              # IntersectionObserver helper
    og.tsx                 # 1200×630 type-only card
  components/
    atoms/
      Button/Button.astro
      Chip/Chip.astro
      Badge/Badge.astro
      Caret/Caret.astro
      NavLink/NavLink.astro
      TabButton/TabButton.astro
    molecules/
      Panel/Panel.astro
      SectionHeader/SectionHeader.astro
      StatTile/StatTile.astro
      MetaRow/MetaRow.astro
      TerminalLine/TerminalLine.astro
      ScreenshotFrame/ScreenshotFrame.astro
      ThemeToggle/ThemeToggle.astro
      Monogram/Monogram.astro
    organisms/
      Header/Header.astro
      Header/Header.island.tsx
      BootSequence/BootSequence.astro
      BootSequence/BootSequence.island.tsx
      Capabilities/Capabilities.astro
      Capabilities/Capabilities.island.tsx
      StatusBar/StatusBar.astro
      StatusBar/StatusBar.island.tsx
      Hero/Hero.astro
      ...
  layouts/
    BaseLayout.astro
    PageLayout.astro
    CaseStudyLayout.astro
  content/
    case-studies/*.mdx
  pages/
    index.astro
    work/index.astro
    work/[...slug].astro
    work/[...slug]/og.png.ts
    404.astro
    resume.astro
    kitchen-sink.astro       # dev only, excluded from sitemap
src/content.config.ts
astro.config.mjs
```

Each unit gets its own folder so tests and stories can sit beside it later without a restructure.

Note there is **no `tailwind.config.mjs`** — Tailwind 4 is configured in `src/styles/theme.css`.
