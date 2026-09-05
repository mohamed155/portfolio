// organisms/Header/Header.island.tsx — client:load
// Owns theme state and the mobile menu. The pre-paint script in <head> has
// already set data-theme on <html>, so colours are correct from first paint
// regardless of what this component's own state starts as.
//
// Vendored from the design project's astro/examples/ and CORRECTED. The
// original used four things that do not compile against assets/theme.css —
// verified by compiling the fixture. Changes marked [fixed]:
//   max-w-container  -> max-w-page       (theme.css names it --container-page)
//   max-xs: / max-sm: -> to-xs: / to-sm: (Tailwind's max-* are 640/768/1024px) brand-check-ignore: names the banned form
//   duration-instant -> duration-200     (v4 has no named-duration namespace)
//   class=           -> className=       (React island, not an .astro file)

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useActiveSection } from '../../../lib/useActiveSection';

type Theme = 'dark' | 'light';

const NAV: [string, string][] = [
  ['01', 'about'], ['02', 'skills'], ['03', 'experience'],
  ['04', 'work'], ['06', 'education'], ['07', 'contact']
];

export default function HeaderIsland({ active }: { active?: string }) {
  // On the home page, [data-section] markers exist and this tracks scroll
  // position live. Everywhere else (case studies, /work, /404, /resume) there
  // are none, so the hook stays undefined and the page's own static `active`
  // prop — e.g. CaseStudyLayout always passing "work" — decides the highlight.
  const scrollActive = useActiveSection();
  const activeLabel = scrollActive ?? active;
  // Always starts 'dark', matching what client:load's SSR pass renders
  // (document doesn't exist there). Reading the real value in the
  // initializer instead would make the client's first render disagree with
  // the server's whenever the visitor's saved theme is 'light' — a React
  // hydration mismatch on every such page load. Sync to the true value
  // after mount instead; the toggle button's label may correct itself one
  // frame after paint, but the colours (driven by the head script) never do.
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') as Theme | null;
    if (current && current !== 'dark') setTheme(current);
  }, []);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on navigation, or the overlay survives the transition.
  useEffect(() => {
    const close = () => setMenu(false);
    document.addEventListener('astro:after-swap', close);
    return () => document.removeEventListener('astro:after-swap', close);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    if (!menu) {
      trigger.current?.focus();
      return;
    }

    const focusables = overlay.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusables?.[0]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setMenu(false); return; }
      if (e.key !== 'Tab' || !focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [menu]);

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('mr-theme', next); } catch {}
    setTheme(next);
  }

  // On the home page a click on "/" targets the current URL. Left uncaught,
  // ClientRouter still runs its same-document transition for it, which fights
  // a plain scrollTo (the browser reports this as a "refresh"-like jump).
  // stopPropagation keeps the click from ever reaching ClientRouter's own
  // document-level listener, so our scroll is the only thing that runs.
  function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (window.location.pathname !== '/') return;
    // Leave modified/non-primary clicks (new tab, new window, save-as) alone.
    // Keyboard activation also reports button 0, so it still gets caught here.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    e.stopPropagation();
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
  }

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-80 animate-print border-b bg-bg ${scrolled ? 'border-bd2' : 'border-bd'}`}
    >
      <div className="mx-auto flex h-header max-w-page items-center gap-6 px-8 to-xs:px-4.5">
        <a href="/" onClick={handleLogoClick} className="flex min-w-0 items-center gap-2.5 text-ui text-fg hover:text-ac">
          <span className="inline-flex h-[26px] w-[26px] flex-none items-center justify-center bg-ac font-display text-[12px] font-bold text-acfg">MR</span>
          <span className="truncate tracking-ui">mohamed_ramadan</span>
          <span className="text-label tracking-nav text-fg3 to-sm:hidden">/ sr. frontend engineer</span>
        </a>

        <nav aria-label="Sections" className="ml-auto flex gap-0.5 to-sm:hidden">
          {NAV.map(([n, label]) => {
            const on = activeLabel === label;
            return (
              <a
                key={n}
                href={`/#${label}`}
                className={`inline-flex items-baseline gap-[7px] border px-[11px] py-1.5 text-label uppercase tracking-nav transition-colors duration-200 ${
                  on ? 'border-ac bg-ac text-acfg' : 'border-transparent text-fg2 hover:border-ac hover:bg-ac hover:text-acfg'
                }`}
              >
                <span className="text-micro opacity-55">{n}</span>{label}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex flex-none items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle colour theme"
            className="inline-flex h-8 items-center gap-2 border border-bd px-[11px] text-[11px] uppercase tracking-[.08em] text-fg2 transition-colors duration-200 hover:border-ac hover:text-ac"
          >
            <span className="h-2 w-2 flex-none bg-ac"></span>
            <span className="to-xs:hidden">{theme === 'light' ? 'paper' : 'dark'}</span>
          </button>

          <a
            href="/resume"
            className="inline-flex h-8 items-center border border-bd px-[11px] text-[11px] uppercase tracking-[.08em] text-fg2 transition-colors duration-200 hover:border-ac hover:text-ac to-xs:hidden"
          >resume &#8599;</a>

          <button
            ref={trigger}
            type="button"
            onClick={() => setMenu(true)}
            aria-expanded={menu}
            aria-label="Open menu"
            className="hidden h-8 w-8 items-center justify-center border border-bd text-fg2 hover:border-ac hover:text-ac to-sm:inline-flex"
          >≡</button>
        </div>
      </div>
    </header>

    {menu && createPortal(
      <div ref={overlay} role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-90 animate-fadein bg-bg px-4.5 py-6">
        <button
          type="button"
          onClick={() => setMenu(false)}
          aria-label="Close menu"
          className="ml-auto flex h-8 w-8 items-center justify-center border border-bd text-fg2"
        >✕</button>
        <nav className="mt-8 flex flex-col gap-8">
          {NAV.map(([n, label], i) => (
            <a
              key={n}
              href={`/#${label}`}
              onClick={() => setMenu(false)}
              className="flex animate-rise items-baseline gap-3 font-display text-[20px] font-bold uppercase tracking-heading text-fg"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <span className="text-micro text-ac">{n}</span>{label}
            </a>
          ))}
        </nav>
      </div>,
      document.body
    )}
    </>
  );
}
