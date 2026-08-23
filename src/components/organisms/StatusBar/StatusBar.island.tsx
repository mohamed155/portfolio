// organisms/StatusBar/StatusBar.island.tsx — client:idle (cosmetic, never
// blocks interaction). Below 760px this renders null and never attaches the
// scroll listener — a static build can't know the viewport ahead of time,
// so "hidden below 760px" is satisfied at runtime via matchMedia rather
// than with a CSS-only hide.
import { useEffect, useState } from 'react';

export default function StatusBarIsland({ path = '~/portfolio' }: { path?: string }) {
  const [hidden, setHidden] = useState(true);
  const [percent, setPercent] = useState(0);
  const [section, setSection] = useState('');

  useEffect(() => {
    const mq = matchMedia('(max-width: 760px)');
    const sync = () => setHidden(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (hidden) return;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPercent(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const sections = document.querySelectorAll<HTMLElement>('[data-section]');
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setSection(hit.target.getAttribute('data-section') ?? '');
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );
    sections.forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-70 flex h-statusbar items-center gap-[18px] border-t border-t-bd bg-bg px-[18px] text-label-sm uppercase tracking-caps text-fg3">
      <span className="text-ac">{path}</span>
      <span>{section}</span>
      <span className="ml-auto">{'scroll ' + String(percent).padStart(2, '0') + '%'}</span>
      <span aria-hidden="true" className="h-[11px] w-[6px] flex-none bg-ac" style={{ animation: 'blink 1.4s step-end infinite' }} />
    </div>
  );
}
