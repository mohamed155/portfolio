#!/usr/bin/env node
// Terminal Portfolio brand check.
//
// Tailwind is configured extend-only, so off-brand utilities (rounded-lg,
// shadow-md, bg-slate-800) compile silently and look almost right. This script
// is the mitigation. Wire it into CI.
//
//   node scripts/brand-check.mjs
//
// Add `// brand-check-ignore` to a line to exempt it (use sparingly, and say
// why in the same comment).

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src';
const EXTS = /\.(astro|tsx|jsx|ts|js|mdx|css)$/;

const FORBIDDEN = [
  [
    /\brounded(?!-none\b)(-[a-z0-9[\].\/-]+)?\b/,
    'border-radius must be 0 in this system',
  ],
  [
    /\bshadow-(?!none\b)[a-z0-9[\].\/-]+\b/,
    'this system has no drop shadows',
  ],
  [
    /\b(?:bg|text|border|ring|outline|decoration|divide|from|via|to|fill|stroke|accent|caret|shadow)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/,
    'use the token palette (bg, panel, panel2, fg, fg2, fg3, ac, acfg, acdim, bd, bd2)',
  ],
  [
    /\b(?:font-sans|font-serif|font-mono)\b/,
    'only font-display and font-body exist here',
  ],
  [
    /\bbackdrop-blur(-[a-z0-9]+)?\b/,
    'blur is never used in this system',
  ],
  [
    /(?<!backdrop-)\bblur-(?!none\b)[a-z0-9]+\b/,
    'blur is never used in this system',
  ],
  [
    /\bmax-(?:sm|md|lg|xl|2xl):/,
    "that is a Tailwind default width (640/768/1024/1280), not a design breakpoint — use to-xl:/to-lg:/to-md:/to-sm:/to-xs:",
  ],
  [
    /<ViewTransitions\b/,
    'Astro 7 renamed this to <ClientRouter /> from astro:transitions',
  ],
  [
    /@astrojs\/tailwind/,
    'deprecated — Tailwind 4 is a Vite plugin (@tailwindcss/vite)',
  ],
];

// Tailwind 4's default border colour is currentColor, so a bare `border`
// utility paints the text colour instead of the hairline.
const BORDER_OK = /\bborder-(?:bd2?|ac|acfg|fg[23]?|panel2?|bg|transparent|current|inherit|\[)/;
const BARE_BORDER = /\bborder(?:-[xytrbles]|-\d+)?(?=\s|"|'|`|$)/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXTS.test(name)) out.push(p);
  }
  return out;
}

let files;
try {
  files = walk(ROOT);
} catch {
  console.error(`brand check: no ${ROOT}/ directory to scan`);
  process.exit(1);
}

const problems = [];

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, i) => {
    if (line.includes('brand-check-ignore')) return;

    for (const [re, msg] of FORBIDDEN) {
      const m = line.match(re);
      if (m) problems.push(`${file}:${i + 1}  ${m[0]} — ${msg}`);
    }

    // Bare-border pass: only inside class-ish attributes, and only when no
    // explicit token colour appears alongside it.
    for (const attr of line.matchAll(/(?:class|className|class:list)\s*=\s*["'{`]([^"'}`]*)/g)) {
      const value = attr[1];
      if (BARE_BORDER.test(value) && !BORDER_OK.test(value)) {
        problems.push(
          `${file}:${i + 1}  border — Tailwind 4 defaults border-color to currentColor; write "border border-bd"`
        );
      }
    }
  });
}

if (problems.length) {
  for (const p of problems) console.error(p);
  console.error(`\n${problems.length} brand violation(s).`);
  process.exit(1);
}

console.log(`brand check passed (${files.length} files)`);
