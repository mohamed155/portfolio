// Shared by Header and StatusBar so both track scroll position off the same
// [data-section] markers instead of running independent copies of the same
// IntersectionObserver logic. Returns the bare section label (e.g. 'about')
// of whichever [data-section] element currently satisfies the viewport band,
// or undefined when none does (above the hero, or a page with no
// [data-section] markers at all — every case-study/utility page).
import { useEffect, useState } from 'react';

export function useActiveSection(enabled = true): string | undefined {
  const [section, setSection] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
    if (!els.length) return;

    // IntersectionObserver callbacks only report entries whose status just
    // changed, not every observed element — a naive `entries.find(isIntersecting)`
    // never fires again once the last section scrolls out of the band, leaving
    // `section` stuck at whatever it last was. Track membership explicitly and
    // recompute from the full set on every callback instead.
    const intersecting = new Set<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) intersecting.add(e.target);
          else intersecting.delete(e.target);
        });
        const active = els.find((el) => intersecting.has(el));
        setSection(active?.getAttribute('data-section') ?? undefined);
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );
    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [enabled]);

  return section;
}
