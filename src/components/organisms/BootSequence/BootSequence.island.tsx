// organisms/BootSequence/BootSequence.island.tsx — client:load, home page
// only. Must run before first meaningful paint. Hand-rolls TerminalLine and
// Caret markup — a React island can't import the .astro atoms/molecules.
import { useEffect, useLayoutEffect, useState } from 'react';

const BOOT: [string, string][] = [
  ['init portfolio.mr', ''],
  ['load profile: mohamed ramadan', 'ok'],
  ['resolve stack: angular / typescript / rxjs', 'ok'],
  ['mount sections [07]', 'ok'],
  ['experience 7+ yrs · 11 roles', 'ok'],
  ['render', 'ready'],
];

export default function BootSequenceIsland() {
  // Rendered client:only (see BootSequence.astro) — there is no SSR pass to
  // mismatch against, so it's safe to branch on window/sessionStorage here.
  const [done, setDone] = useState(() => {
    if (window.location.pathname !== '/') return true;
    // A View Transitions navigation sets this; a cold load does not.
    if (sessionStorage.getItem('mr-navigated') === '1') return true;
    return matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [lines, setLines] = useState(1);

  // #mr-boot-fallback (BootSequence.astro) stands in for this component's
  // first frame until React mounts — runs before paint so there's no
  // double-frame between the static markup and this one, regardless of how
  // `done` landed.
  useLayoutEffect(() => {
    document.getElementById('mr-boot-fallback')?.remove();
    document.documentElement.removeAttribute('data-boot');
  }, []);

  useEffect(() => {
    if (done) return;
    if (lines >= BOOT.length) {
      const t = setTimeout(() => setDone(true), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLines((n) => n + 1), 230);
    return () => clearTimeout(t);
  }, [lines, done]);

  useEffect(() => {
    if (done) document.body.style.overflow = '';
    else document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [done]);

  // Hero's typing intro waits for this before it starts — otherwise it would
  // play out behind this overlay and the user would only ever see the
  // finished text.
  useEffect(() => {
    if (done) document.dispatchEvent(new CustomEvent('mr:boot-done'));
  }, [done]);

  if (done) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex flex-col justify-end gap-1 bg-bg p-[clamp(20px,6vw,64px)]"
    >
      {BOOT.slice(0, lines).map(([text, tail]) => (
        <div key={text} className="flex items-baseline gap-3 text-body-xs leading-[1.9] tracking-ui animate-[fadein_.12s_linear_both]">
          <span className="text-ac" aria-hidden="true">&gt;</span>
          <span className="text-fg2">{text}</span>
          {tail && <span className="ml-auto text-fg3">{tail}</span>}
        </div>
      ))}
      <div className="flex items-center gap-3 text-fg">
        <span className="text-ac">$</span>
        <span aria-hidden="true" className="inline-block h-[16px] w-[9px] flex-none animate-blink bg-ac" />
      </div>
    </div>
  );
}
