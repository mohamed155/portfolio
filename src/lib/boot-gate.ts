// Inline this in <head>, right after themeInit — runs synchronously so
// <html> carries the boot decision before <body> is parsed. Without it,
// BootSequence's client:only island (see interactivity.md) is the earliest
// thing that can decide whether to show the overlay, and by the time its
// bundle loads and mounts, the already-SSR'd Hero has already painted —
// a visible flash on every cold load of "/". #mr-boot-fallback (in
// BootSequence.astro) is a static stand-in for the island's first frame;
// this script is the only thing that ever makes it visible, via
// data-boot="run" on <html>, so JS-disabled visitors and anyone the boot
// sequence would skip (SPA nav, prefers-reduced-motion) never see it.
//
// In BaseLayout.astro:
//   <script is:inline set:html={bootGateInit} />

export const bootGateInit = `
(function () {
  try {
    if (
      location.pathname === '/' &&
      sessionStorage.getItem('mr-navigated') !== '1' &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      document.documentElement.setAttribute('data-boot', 'run');
    }
  } catch (e) {}
})();
`;
