// organisms/Header/Header.island.tsx — client:load
// Owns theme state and the mobile menu. The pre-paint script in <head> has
// already set data-theme; this reads it rather than assuming a default.
//
// Vendored from the design project's astro/examples/ and CORRECTED. The
// original used four things that do not compile against assets/theme.css —
// verified by compiling the fixture. Changes marked [fixed]:
//   max-w-container  -> max-w-page       (theme.css names it --container-page)
//   max-xs: / max-sm: -> to-xs: / to-sm: (Tailwind's max-* are 640/768/1024px) brand-check-ignore: names the banned form
//   duration-instant -> duration-200     (v4 has no named-duration namespace)
//   class=           -> className=       (React island, not an .astro file)

import { useEffect, useRef, useState } from 'react';

type Theme = 'dark' | 'light';

const NAV: [string, string][] = [
  ['01', 'about'], ['02', 'skills'], ['03', 'experience'],
  ['04', 'work'], ['06', 'education'], ['07', 'contact']
];

export default function HeaderIsland({ active }: { active?: string }) {
  const [theme, setTheme] = useState<Theme>(
    () => (document.documentElement.getAttribute('data-theme') as Theme) ?? 'dark'
  );
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

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
    if (!menu) trigger.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [menu]);

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('mr-theme', next); } catch {}
    setTheme(next);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-80 animate-print border-b bg-bg ${scrolled ? 'border-bd2' : 'border-bd'}`}
    >
      <div className="mx-auto flex h-header max-w-page items-center gap-6 px-8 to-xs:px-4.5">
        <a href="/" className="flex min-w-0 items-center gap-2.5 text-ui text-fg hover:text-ac">
          <span className="inline-flex h-[26px] w-[26px] flex-none items-center justify-center bg-ac font-display text-[12px] font-bold text-acfg">MR</span>
          <span className="truncate tracking-ui">mohamed_ramadan</span>
          <span className="text-label tracking-nav text-fg3 to-sm:hidden">/ sr. frontend engineer</span>
        </a>

        <nav aria-label="Sections" className="ml-auto flex gap-0.5 to-sm:hidden">
          {NAV.map(([n, label]) => {
            const on = active === label;
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

      {menu && (
        <div className="fixed inset-0 z-90 animate-fadein bg-bg px-4.5 py-6">
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
        </div>
      )}
    </header>
  );
}
