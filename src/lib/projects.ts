// Shared by SelectedWork (home) and work/index.astro (the /work index) so
// both render the same promotional copy for each project — the case-study
// content collection carries the full case-study prose, not this shorter
// card copy, so it lives here instead of being derived from the collection.
export interface Project {
  index: string;
  kind: string;
  title: string;
  slug: string;
  path: string;
  shot: string;
  image?: string;
  description: string;
  contribution: string;
  tech: string[];
  flip?: boolean;
}

export const PROJECTS: Project[] = [
  {
    index: '01', kind: 'AI · multi-tenant saas', title: 'AI Customer Service Platform',
    slug: 'ai-customer-service-platform', path: 'app.support / inbox', shot: 'conversation inbox + AI assistant',
    image: '/images/aria.png',
    description: 'A multi-tenant AI customer-service platform: businesses configure AI agents, knowledge bases and integrations, and serve their customers through an embeddable chat widget and WhatsApp, with human handoff when the AI cannot help.',
    contribution: 'The system architecture, end to end: a Rust modular monolith of 23 domain modules, tenancy on Row-Level Security, a transactional outbox, and the Angular dashboard — recorded in 16 ADRs.',
    tech: ['Rust', 'Axum', 'PostgreSQL', 'pgvector', 'Redis', 'Angular', 'NgRx'],
  },
  {
    index: '02', kind: 'desktop · local-first', title: 'Inventory Desktop Application',
    slug: 'inventory-desktop-application', path: 'Inventory.app — stock', shot: 'stock table + item form', flip: true,
    image: '/images/IMS.png',
    description: 'Desktop inventory management software built for offline use: local-first storage, dense data entry, validated forms and packaged distribution for real workstation workflows.',
    contribution: 'A typed data layer from SQLite through Prisma into the renderer, and a form system that keeps validation rules in one place.',
    tech: ['Electron', 'React', 'TypeScript', 'Prisma', 'SQLite'],
  },
];

// The third project has no case-study content anywhere — only this name,
// kind and index (see content-collections.md). /work renders it as the
// dashed in-progress block from the design, never as a link.
export const IN_PROGRESS_PROJECT = {
  index: '03',
  kind: 'ai · local-first',
  title: 'Local AI Audio Transcription',
};
