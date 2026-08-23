// organisms/Hero/Hero.island.tsx — client:load, home page only. Owns the
// typed intro (prompt → name → role/tagline) and the print-stage reveal of
// the four blocks below it. Hand-rolls the caret markup — a React island
// can't import the Caret .astro atom.
import { useEffect, useState } from 'react';

const TYPE = [
  { text: 'whoami', speed: 52, pause: 320 },
  { text: 'MOHAMED', speed: 62, pause: 90 },
  { text: 'RAMADAN', speed: 62, pause: 280 },
  { text: 'senior frontend engineer', speed: 22, pause: 160 },
  { text: '// building scalable digital experiences', speed: 14, pause: 220 },
] as const;

const PRINTS = 4;

export default function HeroIntro() {
  // Starts fully typed — matches what client:load's SSR pass renders (no
  // window/sessionStorage there), so hydration never disagrees with the
  // server. The same hazard the theme toggle and boot sequence hit; see
  // interactivity.md. Retyping from scratch only ever happens after a
  // client-only effect below decides to run it.
  const [ti, setTi] = useState<number>(TYPE.length);
  const [ci, setCi] = useState(0);
  const [printed, setPrinted] = useState(PRINTS);

  // Decide once, after mount, whether to replay the intro: only on a cold
  // load of '/', only when reduced motion isn't requested, and only after
  // BootSequence's overlay has actually lifted (same three gates
  // BootSequence itself uses — see BootSequence.island.tsx) — otherwise the
  // whole animation plays hidden behind that overlay.
  useEffect(() => {
    if (window.location.pathname !== '/') return;
    if (sessionStorage.getItem('mr-navigated') === '1') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const start = () => {
      // The mount effect below already marked these .is-in, matching the
      // fully-typed SSR default — undo that so the print stages have
      // something to reveal as `printed` climbs back up.
      document.querySelectorAll<HTMLElement>('[data-hero-reveal]').forEach((el) => el.classList.remove('is-in'));
      setTi(0); setCi(0); setPrinted(0);
    };
    document.addEventListener('mr:boot-done', start);
    // Failsafe in case the event never arrives.
    const fallback = setTimeout(start, 6000);

    return () => {
      document.removeEventListener('mr:boot-done', start);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (ti >= TYPE.length) return;
    const item = TYPE[ti];
    const t = ci < item.text.length
      ? setTimeout(() => setCi((c) => c + 1), item.speed)
      : setTimeout(() => { setTi((v) => v + 1); setCi(0); }, item.pause);
    return () => clearTimeout(t);
  }, [ti, ci]);

  useEffect(() => {
    if (ti < TYPE.length || printed >= PRINTS) return;
    const t = setTimeout(() => setPrinted((p) => p + 1), 170);
    return () => clearTimeout(t);
  }, [ti, printed]);

  useEffect(() => {
    document.querySelectorAll<HTMLElement>('[data-hero-reveal]').forEach((el, i) => {
      if (i < printed) el.classList.add('is-in');
    });
  }, [printed]);

  function typed(i: number) {
    if (ti > i) return TYPE[i].text;
    if (ti === i) return TYPE[i].text.slice(0, ci);
    return '';
  }

  return (
    <>
      <div className="flex items-center gap-2 text-[11.5px] uppercase tracking-caps text-fg3">
        <span className="text-ac">$</span><span>{typed(0)}</span>
        {ti === 0 && (
          <span aria-hidden="true" className="inline-block h-[13px] w-[7px] flex-none animate-blink bg-ac" />
        )}
      </div>

      <h1 className="mt-[22px] font-display text-hero font-bold uppercase leading-[.92] tracking-hero">
        {typed(1)}
        {ti === 1 && (
          <span aria-hidden="true" className="inline-block h-[.72em] w-[.46em] align-[-.02em] animate-blink bg-ac" />
        )}
        <br />
        {typed(2)}
        {ti === 2 && (
          <span aria-hidden="true" className="inline-block h-[.72em] w-[.46em] align-[-.02em] animate-blink bg-ac" />
        )}
      </h1>

      <div className="mt-[26px] flex flex-wrap items-baseline gap-[14px] border-b border-b-bd2 pb-[26px]">
        <span className="text-lead tracking-ui text-ac">
          {typed(3)}
          {ti === 3 && (
            <span aria-hidden="true" className="ml-[2px] inline-block h-[.95em] w-[.5em] align-[-.12em] animate-blink bg-ac" />
          )}
        </span>
        <span className="text-[clamp(13px,1.5vw,17px)] text-fg3">
          {typed(4)}
          {ti === 4 && (
            <span aria-hidden="true" className="ml-[2px] inline-block h-[.95em] w-[.5em] align-[-.12em] animate-blink bg-ac" />
          )}
        </span>
      </div>
    </>
  );
}
