# Interactivity recipes

Four behaviours need JavaScript. Everything else is static `.astro`.

| Behaviour | Island | Directive | Why |
| --- | --- | --- | --- |
| Theme + mobile menu | `Header.island.tsx` | `client:load` | Toggle must respond immediately; the flash is already prevented by the head script |
| Capability tabs | `Capabilities.island.tsx` | `client:visible` | Below the fold on every viewport |
| Boot sequence | `BootSequence.island.tsx` | `client:load` | Must run before first meaningful paint, home page only |
| Scroll status bar | `StatusBar.island.tsx` | `client:idle` | Cosmetic; never blocks interaction |

## View Transitions will replay your mount effects

Astro keeps the document alive across navigations, so an animation in `useEffect(..., [])` fires again on every click. Two consequences:

**Gate the boot sequence.** It runs only on a direct load of `/`. `sessionStorage` is not enough on its own — the check must also exclude transition-driven navigation.

```tsx
// BootSequence.island.tsx
const [done, setDone] = useState(() => {
  if (typeof window === 'undefined') return true;
  if (window.location.pathname !== '/') return true;
  // A View Transitions navigation sets this; a cold load does not.
  if (sessionStorage.getItem('mr-navigated') === '1') return true;
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
});
```

And in `BaseLayout.astro`, mark every subsequent navigation:

```astro
<script>
  document.addEventListener('astro:after-swap', () => {
    sessionStorage.setItem('mr-navigated', '1');
  });
</script>
```

**Re-bind global listeners on `astro:page-load`, not `DOMContentLoaded`.** `DOMContentLoaded` fires once per cold load; `astro:page-load` fires on every navigation including the first.

```ts
// src/lib/reveal.ts
export function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!els.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.style.animationDelay = Math.min(i * 55, 220) + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.06 }
  );
  els.forEach((el) => io.observe(el));
}

document.addEventListener('astro:page-load', initReveal);
```

The paired CSS is already in `assets/tokens.css`:

```css
[data-reveal] { opacity: 0 }
[data-reveal].is-in { opacity: 1; animation: print .5s steps(22, end) both }
```

## Theme toggle

The head script already set `data-theme`. The island reads it rather than assuming a default, or the button label desynchronises from the page on first render.

```tsx
const [theme, setTheme] = useState<'dark' | 'light'>(() =>
  (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') ?? 'dark'
);

function toggle() {
  const next = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('mr-theme', next); } catch {}
  setTheme(next);
}
```

The label names the theme you are **in** (`dark` / `paper`), not the one you would switch to. Persist under `mr-theme` — the same key the head script reads. Theme must survive View Transitions: since it lives on `<html>` and Astro preserves that element, it does, but **do not move it to `<body>`**.

## Capability tabs

Plain `useState` index. Requirements that are easy to miss:

- `role="tablist"` on the container, `role="tab"` + `aria-selected` on each button, `aria-controls` pointing at the panel.
- Arrow-key navigation between tabs (Left/Right or Up/Down, since the list is vertical on desktop and horizontal below 980px).
- The panel needs `min-height: 340px` so switching between a 9-skill and a 5-skill category does not jump the page.
- Chips re-run their `rise` stagger on each tab change — key the chip list on the active index so React remounts them.

## Mobile menu

Below 760px the nav collapses to `≡`. The overlay is **opaque `--bg`**, not a scrim — no blur, no transparency. Uppercase Space Mono links at 20px, rows 32px apart, each animating in with `rise` at a 30ms stagger. Close glyph is `✕`.

Trap focus while open, restore it to the trigger on close, set `aria-expanded`, close on `Escape`, and lock body scroll. Close it on `astro:after-swap` too, or it stays open behind the next page.

## Status bar

Scroll percent from `scrollY / (scrollHeight - innerHeight)`, zero-padded to two digits. Listen `{ passive: true }`, and read the section name from whichever `[data-section]` is currently intersecting. Hidden below 760px — **do not render it at all there** rather than hiding with CSS, so the listener never attaches on mobile.
