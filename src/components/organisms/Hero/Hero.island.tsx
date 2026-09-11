// organisms/Hero/Hero.island.tsx — client:load, home page only. Owns the
// typed intro (prompt → name → role/tagline), the print-stage reveal of
// the four blocks below it, and the ASCII scene cycler beside the name.
// Hand-rolls the caret markup — a React island can't import the Caret
// .astro atom.
import { useEffect, useRef, useState } from 'react';
import { startHeroArt } from '../../../lib/hero-art';

const TYPE = [
  { text: 'whoami', speed: 52, pause: 320 },
  { text: 'MOHAMED', speed: 62, pause: 90 },
  { text: 'RAMADAN', speed: 62, pause: 280 },
  { text: 'senior software engineer', speed: 22, pause: 160 },
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

  const artRef = useRef<HTMLPreElement>(null);
  const artStopRef = useRef<(() => void) | null>(null);

  // Decide once, after mount, whether to replay the intro: only on a cold
  // load of '/', only when reduced motion isn't requested, and only after
  // BootSequence's overlay has actually lifted (same three gates
  // BootSequence itself uses — see BootSequence.island.tsx) — otherwise the
  // whole animation plays hidden behind that overlay.
  useEffect(() => {
    if (window.location.pathname !== '/') return;
    if (sessionStorage.getItem('mr-navigated') === '1') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let started = false;
    let fallback: ReturnType<typeof setTimeout> | undefined;

    const start = () => {
      // Without this guard, the fallback below still fires even after
      // `mr:boot-done` already ran start() once, resetting and re-hiding
      // the hero content again six seconds into a normal load.
      if (started) return;
      started = true;
      if (fallback !== undefined) clearTimeout(fallback);

      // The mount effect below leaves these at their CSS default (visible,
      // no `is-in`) — mark them `is-out` so the print stages have
      // something to reveal as `printed` climbs back up.
      document.querySelectorAll<HTMLElement>('[data-hero-reveal]').forEach((el) => {
        el.classList.remove('is-in');
        el.classList.add('is-out');
      });
      setTi(0); setCi(0); setPrinted(0);
    };
    document.addEventListener('mr:boot-done', start);
    // Failsafe in case the event never arrives.
    fallback = setTimeout(start, 6000);

    return () => {
      document.removeEventListener('mr:boot-done', start);
      if (fallback !== undefined) clearTimeout(fallback);
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
      if (i < printed) {
        el.classList.remove('is-out');
        el.classList.add('is-in');
      }
    });
  }, [printed]);

  // The art starts once the name and role/tagline have finished typing —
  // same gate as the source design. On a cold load ti already starts at
  // TYPE.length (see the comment on its useState above), so this fires
  // immediately; on a replay it stops and clears while ti climbs back up,
  // then restarts fresh once typing completes again.
  useEffect(() => {
    if (ti < TYPE.length) {
      artStopRef.current?.();
      artStopRef.current = null;
      if (artRef.current) artRef.current.innerHTML = '';
      return;
    }
    if (artStopRef.current || !artRef.current) return;
    artStopRef.current = startHeroArt(artRef.current);
  }, [ti]);

  useEffect(() => () => artStopRef.current?.(), []);

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

      <div className="mt-[22px] grid grid-cols-[minmax(0,1.06fr)_minmax(0,.94fr)] items-center gap-10 to-md:grid-cols-1 to-md:gap-[26px]">
        <h1 className="font-display text-hero font-bold uppercase leading-[.92] tracking-hero">
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

        <pre
          ref={artRef}
          aria-hidden="true"
          className="m-0 select-none overflow-hidden whitespace-pre text-center font-body text-[clamp(11px,1.16vw,14px)] leading-[1.05] tracking-[.055em] text-fg2 to-md:justify-self-center to-md:text-[min(2.8vw,13px)]"
        />
      </div>

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
