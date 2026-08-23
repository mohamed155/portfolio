// Scroll-reveal for any element marked [data-reveal]. Re-bound on
// astro:page-load (fires on every navigation, unlike DOMContentLoaded) so it
// survives View Transitions.
export function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)');
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

  // Failsafe: if the observer never fires for an above-fold element (a script
  // error elsewhere on the page, a slow-to-settle layout), don't leave it at
  // opacity:0 forever — force it in.
  setTimeout(() => {
    document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)').forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
    });
  }, 6000);
}

document.addEventListener('astro:page-load', initReveal);
