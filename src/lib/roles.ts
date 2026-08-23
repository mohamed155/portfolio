// Shared by ExperienceList (home) and resume.astro — the full 11-role
// history, ported verbatim from Portfolio v2.dc.html's `roles` array.
export interface Role {
  company: string;
  title: string;
  dates: string;
  place: string;
  current?: boolean;
  summary: string;
  tech: string[];
  index: string;
}

const RAW: Omit<Role, 'index'>[] = [
  { company: 'eSpace / Crealogix', title: 'Senior Frontend Engineer', dates: 'dec 2025 — present', place: 'Alexandria / Zurich', current: true, summary: 'Building desktop and mobile e-banking web applications for Saudi National Bank clients, with the accessibility, correctness and browser-support constraints that regulated banking interfaces require.', tech: ['Angular', 'TypeScript', 'RxJS', 'Design Systems'] },
  { company: 'Intouch.com', title: 'Senior Software Engineer', dates: 'mar 2024 — sep 2025', place: 'El-Gouna', summary: 'Led frontend work on an advertising media player and its retailer/ads portal, including camera integration and an in-browser TensorFlow model for audience demographics and ad-view counting.', tech: ['Angular', 'TypeScript', 'TensorFlow.js', 'NgRx'] },
  { company: 'Governance House', title: 'Senior Frontend Developer', dates: 'feb 2024 — jun 2024', place: 'Cairo', summary: 'Frontend engineering on governance and compliance web applications: data-dense interfaces, forms and reporting views.', tech: ['Angular', 'TypeScript', 'RxJS'] },
  { company: 'UrWave Solutions', title: 'Senior Frontend Engineer', dates: 'dec 2023 — mar 2024', place: 'Dubai', summary: 'Delivered client-facing web application features with a focus on component structure and responsive implementation.', tech: ['Angular', 'PrimeNG', 'SurveyJS', 'TypeScript', 'SCSS'] },
  { company: 'Optus', title: 'Senior Frontend Developer → Flutter Developer → Frontend Developer', dates: 'nov 2021 — oct 2023', place: 'Australia', summary: 'Progressed through frontend and mobile roles across telecom product surfaces, working in Angular on the web and Flutter on mobile, and growing into senior frontend ownership.', tech: ['Angular', 'TypeScript', 'Flutter', 'Dart', 'SignalR'] },
  { company: 'Meets Up Events', title: 'Mobile Developer', dates: 'dec 2019 — may 2022', place: 'Alexandria', summary: 'Built and maintained cross-platform mobile apps for event management products.', tech: ['Ionic', 'Angular', 'React Native', 'Cordova'] },
  { company: 'Salam Software', title: 'Frontend Developer', dates: 'jan 2019 — mar 2020', place: 'Alexandria', summary: 'Developed frontend features and UI components for web applications.', tech: ['Angular', 'React', 'React Native', 'Vue', 'jQuery', 'JavaScript', 'CSS'] },
  { company: 'Volcano Agency', title: 'Ionic Developer', dates: 'sep 2019 — dec 2019', place: 'Cairo', summary: 'Built cross-platform mobile apps with Ionic for agency clients.', tech: ['Ionic', 'Angular', 'Cordova'] },
  { company: 'Upwork', title: 'Web UI Developer', dates: 'jan 2018 — aug 2019', place: 'Freelance · US clients', summary: 'Freelance web UI development for US-based clients.', tech: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'React', 'React Native'] },
  { company: 'FLYFOX Software', title: 'Mobile Developer', dates: 'mar 2019 — jun 2019', place: 'Alexandria', summary: 'Built mobile app features on Ionic/Cordova-based products.', tech: ['Ionic', 'Cordova'] },
  { company: 'IronDoT', title: 'Frontend Developer', dates: 'jul 2018 — oct 2018', place: 'Alexandria', summary: 'Developed web interfaces and UI components as part of the frontend team.', tech: ['HTML', 'CSS', 'JavaScript', 'Ionic'] },
];

export const ROLES: Role[] = RAW.map((r, i) => ({ ...r, index: String(i + 1).padStart(2, '0') }));

export const EDUCATION = [
  { dates: 'oct 2015 — jun 2019', school: 'Alexandria University', degree: 'B.Sc. Computer Science (Major), Statistics (Minor)' },
  { dates: 'oct 2014 — jun 2015', school: 'Aswan University', degree: 'Natural Sciences' },
];
