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
    name: 'System Design', level: 'Core Specialty', primary: true, lead: 4,
    blurb: 'Deciding the shape of a system before building it: bounded contexts and the direction of their dependencies, how tenants are isolated, what runs in a request and what runs in a worker, and which failures the design absorbs. I record each decision as an ADR with the alternatives I rejected.',
    applied: 'AI Customer Service Platform — 16 ADRs, 23 domain modules, api / gateway / worker run modes',
    skills: ['Modular Monoliths', 'Hexagonal Architecture', 'Multi-tenancy', 'Transactional Outbox', 'Domain-Driven Design', 'Event-driven Design', 'API Design', 'Architecture Decision Records', 'Threat Modeling'],
  },
  {
    name: 'Frontend', level: 'Core Specialty', primary: true, lead: 4,
    blurb: 'The core of my work: Angular applications built with typed, reactive component architecture — signals and RxJS side by side, OnPush by default, and styling systems that stay predictable at scale. Alongside Angular, five years building React and React Native apps and two years in Flutter for mobile.',
    applied: 'SNB Retailer e-banking apps · AI Customer Service Platform · Retailer/Ads Portal',
    skills: ['Angular', 'TypeScript', 'JavaScript', 'RxJS', 'Signals', 'React', 'React Native', 'Flutter', 'HTML', 'CSS', 'Tailwind CSS'],
  },
  {
    name: 'Frontend Architecture', level: 'Core Specialty', primary: true, lead: 3,
    blurb: 'Deciding where state lives and how features stay independent — store boundaries, feature-sliced modules, shared design-system layers, and reactive data flow that is easy to trace. Boundaries are enforced by lint rules and bundle budgets, not by convention.',
    applied: 'Multi-tenant state isolation · Portal feature boundaries · SNB e-banking apps',
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
    applied: 'Banking transaction flows · Portal regression suites · tenant-isolation and real-backend suites',
    skills: ['Unit Testing', 'Integration Testing', 'E2E Testing', 'Playwright', 'Load Testing (k6)', 'CI Quality Gates', 'Testing Strategy'],
  },
  {
    name: 'Backend & Data', level: 'Advanced', primary: false, lead: 3,
    blurb: 'Services with the invariants in the type system and the database: tenant-scoped transactions, Row-Level Security, UUIDv7 keys, a PostgreSQL-backed job queue, Redis for caching and fan-out, and OpenAPI contracts checked in CI. Rust first, with Node and NestJS behind it.',
    applied: 'Rust/Axum workspace for the AI Customer Service Platform — 77 migrations, 6 CI workflows',
    skills: ['Rust', 'Axum', 'PostgreSQL', 'SQLx', 'Redis', 'OpenAPI', 'Node.js', 'NestJS', 'Prisma'],
  },
  {
    name: 'AI Systems', level: 'Advanced', primary: false, lead: 2,
    blurb: 'Treating a model as an unreliable dependency: a provider port with OpenAI, Anthropic and Gemini adapters, a circuit breaker and bulkhead around each one, a fallback chain, retrieval over pgvector, tool calls gated by approval, and human handoff when the model should not answer.',
    applied: 'AI conversation engine and RAG pipeline · Local Ollama transcription',
    skills: ['LLM Integration', 'RAG', 'Provider Abstraction', 'Tool Calling', 'pgvector', 'Ollama', 'Local Models', 'AI-assisted Engineering'],
  },
];
