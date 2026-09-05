// @ts-check
// Terminal Portfolio — Astro 7 config.
// Differs from the design guide's config, which targeted Astro 5 + Tailwind 3.
// See .claude/skills/terminal-portfolio/references/astro-7-deltas.md for the full list.

import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Required for sitemap, canonical URLs and OG image absolute paths.
  // Set to the real domain before shipping — the sitemap and OG URLs are
  // wrong until then.
  site: 'https://mohamed-ramadan.net',

  integrations: [
    react(),
    mdx(),
    sitemap({ filter: (page) => !page.includes('/kitchen-sink') }),
  ],

  // Tailwind 4 ships as a Vite plugin. The @astrojs/tailwind integration is
  // deprecated — do not add it, and do not create a tailwind.config.mjs.
  // Theme customisation lives in src/styles/theme.css via @theme.
  vite: { plugins: [tailwindcss()] },

  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  // Code blocks in case studies are styled by this system, not by Shiki.
  markdown: { syntaxHighlight: false },
});

// Static output is the default when no adapter is configured — no `output`
// key needed. The sharp image service is also the default.
