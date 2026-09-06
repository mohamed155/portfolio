// Shared by Header and StatusBar so both track scroll position off the same
// [data-section] markers instead of running independent copies of the same
// IntersectionObserver logic. `section` is the bare label (e.g. 'about') of
// whichever [data-section] element currently satisfies the viewport band, or
// undefined when none does — that happens both above the hero / in a
// section-less gap (e.g. Also Shipped) on the home page, AND on every page
// with no [data-section] markers at all (case studies, /work, /404,
// /resume). `hasSections` tells those two apart: true once the page's own
// markers have been found, so a caller can tell "genuinely no section active
// right now" from "this page never tracks sections, fall back to a static
// value" — see Header.island.tsx.
import { useEffect, useState } from 'react';

export function useActiveSection(enabled = true): { section: string | undefined; hasSections: boolean } {
  const [section, setSection] = useState<string | undefined>(undefined);
  const [hasSections, setHasSections] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
    if (!els.length) return;
    setHasSections(true);

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

  return { section, hasSections };
}
