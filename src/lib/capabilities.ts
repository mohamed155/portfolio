// Shared by Capabilities (home, interactive tabs) and resume.astro (static
// print list) — one domain-grouped skills taxonomy for both.
export interface Capability {
  name: string;
  level: string;
  primary: boolean;
  lead: number;
  blurb: string;
  applied: string;
  skills: string[];
}

export const CATS: Capability[] = [
  {
    name: 'Frontend', level: 'Core Specialty', primary: true, lead: 4,
    blurb: 'The core of my work: Angular applications built with typed, reactive component architecture — signals and RxJS side by side, OnPush by default, and styling systems that stay predictable at scale.',
    applied: 'SNB Retailer e-banking apps · AI Customer Service Platform · Retailer/Ads Portal',
    skills: ['Angular', 'TypeScript', 'JavaScript', 'RxJS', 'Signals', 'React', 'HTML', 'CSS', 'Tailwind CSS'],
  },
  {
    name: 'Architecture & State', level: 'Core Specialty', primary: true, lead: 3,
    blurb: 'Deciding where state lives and how features stay independent — store boundaries, feature-sliced modules, shared design-system layers, and reactive data flow that is easy to trace.',
    applied: 'Multi-tenant state isolation · Portal feature boundaries',
    skills: ['NgRx', 'Signal Store', 'Component Architecture', 'Design Systems', 'Reactive Architecture', 'Micro Frontends'],
  },
  {
    name: 'UI Engineering', level: 'Advanced', primary: false, lead: 3,
    blurb: 'Turning design intent into resilient interface code: responsive composition, keyboard and screen-reader support, render performance budgets, and motion that carries meaning.',
    applied: 'Banking flows on desktop and mobile · Media player UI',
    skills: ['Responsive Design', 'Accessibility', 'Web Performance', 'Animation', 'Design Systems', 'UX Implementation'],
  },
  {
    name: 'Testing', level: 'Advanced', primary: false, lead: 2,
    blurb: 'A layered strategy rather than a coverage number: fast unit tests around logic, integration tests around component contracts, and end-to-end coverage on the flows that must never break.',
    applied: 'Banking transaction flows · Portal regression suites',
    skills: ['Unit Testing', 'Integration Testing', 'E2E Testing', 'Playwright', 'Frontend Testing Strategy'],
  },
  {
    name: 'Backend', level: 'Supporting', primary: false, lead: 0,
    blurb: 'Supporting capability. I build the services my frontends consume — typed APIs, relational schemas and migrations — in Node, NestJS and Rust.',
    applied: 'Rust/Axum API for the AI Customer Service Platform',
    skills: ['Node.js', 'NestJS', 'Rust', 'Axum', 'PostgreSQL', 'SQLx', 'Prisma'],
  },
  {
    name: 'AI', level: 'Supporting', primary: false, lead: 0,
    blurb: 'Supporting capability. Integrating hosted and local models into product surfaces: retrieval over real data, model selection, streaming responses and graceful failure.',
    applied: 'Retrieval assistant with pgvector · Local Ollama transcription',
    skills: ['LLM Integration', 'Ollama', 'Local Models', 'RAG Concepts', 'AI Product Development', 'AI-assisted Engineering'],
  },
];
