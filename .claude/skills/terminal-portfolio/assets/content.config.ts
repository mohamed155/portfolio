// Terminal Portfolio — case-study collection.
// Corrected from the design guide for Astro 7 / Zod 4:
//   z now imports from 'astro/zod', not 'astro:content'
//   z.string().url() -> z.url()
// See references/astro-7-deltas.md.

import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Structured frontmatter / thin body: everything that repeats is typed here.
// The MDX body carries ONLY the lead paragraph and the two narrative sections
// (see references/content-collections.md).

const kv = z.object({ k: z.string(), v: z.string() });

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/case-studies' }),
  schema: z.object({
    index: z.string().regex(/^\d{2}$/, 'zero-padded, e.g. "01"'),
    title: z.string(),
    kind: z.string(),          // 'ai · multi-tenant saas'
    lead: z.string(),          // the paragraph under the title
    order: z.number(),
    draft: z.boolean().default(false),

    // 4-up meta strip
    meta: z.array(kv).length(4),

    // 01 product context — exactly three cards
    context: z.array(kv).length(3),

    // 02 the challenge
    challenges: z.array(z.object({
      n: z.string(),
      t: z.string(),
      d: z.string()
    })).min(3).max(6),

    // 03 my role
    role: z.object({
      heading: z.string(),
      blurb: z.string(),
      items: z.array(z.object({ t: z.string(), d: z.string() })).length(4)
    }),

    // 04 architecture — stacked layer rows
    architecture: z.array(z.object({
      layer: z.string(),
      title: z.string(),
      desc: z.string(),
      tags: z.array(z.string()).min(1).max(3)
    })).min(3).max(8),

    // 05 technical decisions
    decisions: z.array(z.object({
      n: z.string(),
      problem: z.string(),
      decision: z.string(),
      reason: z.string(),
      tradeoff: z.string()
    })).length(4),

    // 06 / 07 narrative + screenshot pairs
    features: z.array(z.object({
      n: z.string(),
      section: z.string(),
      heading: z.string(),
      body: z.string(),
      flip: z.boolean().default(false),
      shot: z.object({
        path: z.string(),
        caption: z.string(),
        ratio: z.string().default('16/10'),
        src: z.string().optional()   // omit -> hatch placeholder
      })
    })).length(2),

    // 08 engineering quality — always eight
    quality: z.array(z.object({ t: z.string(), d: z.string() })).length(8),

    // 09 outcome
    outcome: z.array(kv).length(4),
    status: z.string(),        // '● in active development'

    hero: z.object({
      path: z.string(),
      caption: z.string(),
      src: z.string().optional()
    }),

    links: z.object({
      github: z.url().optional(),
      live: z.url().optional(),
      liveNote: z.string().optional()
    }),

    next: z.object({ slug: z.string(), title: z.string() }).nullable()
  })
});

export const collections = { 'case-studies': caseStudies };
