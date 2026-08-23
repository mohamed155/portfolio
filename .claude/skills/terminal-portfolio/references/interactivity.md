# Interactivity recipes

Four behaviours need JavaScript. Everything else is static `.astro`.

| Behaviour | Island | Directive | Why |
| --- | --- | --- | --- |
| Theme + mobile menu | `Header.island.tsx` | `client:load` | Toggle must respond immediately; the flash is already prevented by the head script |
| Capability tabs | `Capabilities.island.tsx` | `client:visible` | Below the fold on every viewport |
| Boot sequence | `BootSequence.island.tsx` | `client:only="react"` | Decides whether to render at all from `sessionStorage`/`matchMedia` — see the hydration-mismatch note below |
| Scroll status bar | `StatusBar.island.tsx` | `client:idle` | Cosmetic; never blocks interaction |

## Boot sequence must be `client:only`, not `client:load`

`client:load` still server-renders the component once before hydrating it. A `useState` initializer that branches on `typeof window === 'undefined'` to decide whether to render therefore produces **different output on the server than on the client's first render** — the server takes the `undefined` branch, the client immediately evaluates the real condition. React throws a hydration-mismatch error for exactly this pattern (it's one of the causes listed in React's own mismatch warning: "A server/client branch `if (typeof window !== 'undefined')`"). Discovered building Level 3 — the first real page assembly threw this on every load.

`client:only="react"` skips the SSR pass for this component entirely, so there's nothing to mismatch against — the `window`/`sessionStorage`/`matchMedia` checks in the initializer are then safe exactly as written below. The tradeoff is that the underlying page (which *does* SSR normally) is visible for a brief moment before the boot overlay mounts and covers it; for a full-page takeover overlay that only exists on JS-enabled cold loads of `/`, that's the right side of the tradeoff.

## View Transitions will replay your mount effects

Astro keeps the document alive across navigations, so an animation in `useEffect(..., [])` fires again on every click. Two consequences:

**Gate the boot sequence.** It runs only on a direct load of `/`. `sessionStorage` is not enough on its own — the check must also exclude transition-driven navigation.

```tsx
// BootSequence.island.tsx — rendered client:only, so there's no SSR pass to
// mismatch against and branching on window here is safe (see above).
const [done, setDone] = useState(() => {
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

The head script already set `data-theme` on `<html>` before first paint, so colours are always correct immediately — this island's own state is only for the toggle button's label, and getting its initializer wrong causes two different bugs.

**Don't crash SSR.** `client:load` still server-renders the component once before hydrating it, and a `useState` lazy initializer runs during that SSR pass too — `document` is undefined there. A bare `document.documentElement...` read throws on every request.

**Don't read the real value in the initializer either — even guarded.** The obvious fix (`typeof document === 'undefined' ? 'dark' : <real value>`) stops the crash but creates a *hydration mismatch* instead: the server always falls back to `'dark'` (no `document`), while the client's first render reads the visitor's actual saved theme. Whenever that's `'light'`, the server and client disagree and React throws — on every full-page load for every paper-theme visitor, not just once. This is the same class of bug as the boot sequence's (see above): a browser-only value read inside a lazy initializer that a `client:load` component also has to SSR.

The fix is the same shape too: start from a fixed value that matches what SSR renders, then sync to the truth in an effect **after** mount, not during render.

```tsx
// Always starts 'dark' — matching client:load's SSR pass, where document
// doesn't exist. Reading the real theme in the initializer instead would
// make the client's first render disagree with the server's whenever the
// visitor's saved theme is 'light': a hydration mismatch on every such load.
const [theme, setTheme] = useState<'dark' | 'light'>('dark');

useEffect(() => {
  const current = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' | null;
  if (current && current !== 'dark') setTheme(current);
}, []);

function toggle() {
  const next = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('mr-theme', next); } catch {}
  setTheme(next);
}
```

The label may show `dark` for one frame before correcting itself on a paper-theme visitor's first load — acceptable, since it's only the button text; the page's actual colours never flash, because those come from the head script on `<html>`, not from this component's state.

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
