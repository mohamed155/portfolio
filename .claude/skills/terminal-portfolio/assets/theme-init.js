// Inline this in <head> BEFORE any stylesheet or markup — do not load it as a
// separate file, and do not defer it. It runs synchronously so the correct
// theme is on <html> before the first paint. Without it, dark-mode visitors
// see one light frame on every cold load, and a client:load island is too late
// to prevent it.
//
// In BaseLayout.astro:
//   <script is:inline set:html={themeInit} />
// where themeInit is the contents of this file as a string.

(function () {
  try {
    var t = localStorage.getItem('mr-theme');
    if (t !== 'light' && t !== 'dark') t = 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
