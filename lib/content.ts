/**
 * Structured, locale-independent data.
 *
 * Anything the user reads lives in messages/*.json. What lives here are the
 * keys, ordering and non-translatable values (slugs, hrefs, tech names) —
 * so a section can iterate without hardcoding a list in JSX.
 */

export const CONTACT = {
  name: 'Soltani Fedi',
  email: 'soltanifedi68@gmail.com',
  /** Both reachable; the first is the one printed on the CVs. */
  phones: ['+21653064275', '+21655517224'],
  location: 'Laouina, Tunis',
  linkedin: 'https://linkedin.com/in/fedi-soltani1',
  cv: { fr: '/cv/CV_FEDI_SOLTANI_FR.pdf', en: '/cv/CV_FEDI_SOLTANI_EN.pdf' },
} as const;

/**
 * Figures shown under the manifesto statement. Order matters: it runs from
 * the broadest claim to the most specific. Each one is backed by the CV —
 * an unverifiable number here would undo the point of showing numbers.
 */
export const MANIFESTO_FIGURES = [
  'years',
  'handlers',
  'versions',
  'companies',
] as const;

export type ManifestoFigure = (typeof MANIFESTO_FIGURES)[number];

export const PILLAR_KEYS = [
  'isolation',
  'concurrency',
  'architecture',
  'delivery',
] as const;

export type PillarKey = (typeof PILLAR_KEYS)[number];

/** Most recent first. Each key maps to experience.items.<key> in messages. */
export const EXPERIENCE_KEYS = [
  'teamxtend',
  'itec',
  'mmm',
  'access',
  'itserve',
  'simplydesk',
] as const;

export type ExperienceKey = (typeof EXPERIENCE_KEYS)[number];

/** How many bullet points each role has in the messages file. */
export const EXPERIENCE_POINTS: Record<ExperienceKey, number> = {
  teamxtend: 8,
  itec: 3,
  mmm: 2,
  access: 4,
  itserve: 2,
  simplydesk: 3,
};

export interface CaseStudy {
  key: 'isolation' | 'concurrency' | 'auth' | 'licensing' | 'saas';
  slug: string;
  /**
   * Long-tail queries this study genuinely answers. Used as schema
   * keywords and to pick related studies — never stuffed into the copy.
   */
  keywords: readonly string[];
  /** Prior knowledge a reader needs; a real TechArticle field. */
  dependencies: string;
  /** Which pillar in the Expertise section links here. */
  pillar: PillarKey;
}

/** Metric slots rendered at the top of every case study. */
export const CASE_METRICS = ['m1', 'm2', 'm3'] as const;

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    key: 'isolation',
    slug: 'multi-tenant-isolation',
    pillar: 'isolation',
    dependencies: 'ASP.NET Core, Entity Framework Core, PostgreSQL',
    keywords: [
      'EF Core global query filter multi-tenant',
      'isolation des données multi-tenant .NET',
      'per-tenant JWT claims ASP.NET Core',
      'RBAC entity-level EF Core',
      'multi-tenant SaaS architecture .NET',
    ],
  },
  {
    key: 'concurrency',
    slug: 'optimistic-concurrency',
    pillar: 'concurrency',
    dependencies: 'Entity Framework Core, PostgreSQL, SignalR',
    keywords: [
      'PostgreSQL xmin concurrency token EF Core',
      'optimistic concurrency EF Core PostgreSQL',
      'DbUpdateConcurrencyException HTTP 409',
      'editing presence SignalR temps réel',
      'Testcontainers PostgreSQL tests intégration .NET',
    ],
  },
  {
    key: 'auth',
    slug: 'refresh-token-rotation',
    pillar: 'concurrency',
    dependencies: 'ASP.NET Core Identity, JWT, relational database',
    keywords: [
      'rotation refresh token détection de réutilisation',
      'refresh token rotation reuse detection .NET',
      'compare-and-swap refresh token base de données',
      'révoquer toutes les sessions ASP.NET Core Identity',
      'JWT security stamp invalidation rôles',
    ],
  },
  {
    key: 'licensing',
    slug: 'mediatr-migration',
    pillar: 'architecture',
    dependencies: 'ASP.NET Core, CQRS, dependency injection',
    keywords: [
      'MediatR licence payante alternative',
      'remplacer MediatR dispatcher custom',
      'migration AutoMapper vers Mapperly',
      'CQRS sans MediatR .NET',
      'MediatR dual license 2025 migration',
    ],
  },
  {
    key: 'saas',
    slug: 'saas-platform',
    pillar: 'delivery',
    dependencies: 'Next.js, Payload CMS, PostgreSQL',
    keywords: [
      'authentification magic link Next.js',
      'Payload CMS headless Next.js SaaS',
      'passwordless authentication implementation',
      'Neon serverless PostgreSQL Next.js',
    ],
  },
] as const;

/** Two studies to surface at the foot of a given one. */
export function relatedCaseStudies(slug: string): CaseStudy[] {
  const index = CASE_STUDIES.findIndex((c) => c.slug === slug);
  if (index === -1) return [];

  // Next two in order, wrapping around: every study links to two others,
  // and every study receives two links. No orphan, no dead end.
  return [
    CASE_STUDIES[(index + 1) % CASE_STUDIES.length]!,
    CASE_STUDIES[(index + 2) % CASE_STUDIES.length]!,
  ];
}

/** The case study a given expertise pillar should link to. */
export function caseStudyForPillar(pillar: PillarKey): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.pillar === pillar);
}

/* ---------------------------------------------------------------- notes */

export interface Note {
  slug: string;
  /** Message key under `notes.items.<key>`. */
  key: 'autocad' | 'licensing' | 'dotnet-upgrade';
  /** Number of body paragraphs in the messages file. */
  paragraphs: number;
  keywords: readonly string[];
  dependencies: string;
  /** Case study this note should link to, if any. */
  relatedCase?: CaseStudy['slug'];
}

/**
 * Deliberately on subjects the case studies do NOT cover.
 *
 * Two pages targeting "xmin EF Core" would cannibalise each other — Google
 * picks one and demotes the other. These three sit in genuinely
 * under-documented territory instead: the AutoCAD .NET API applied to
 * civil engineering, desktop licensing with hardware fingerprinting, and
 * long-running .NET version upgrades. Near-zero competition, and Fedi has
 * actually done all three.
 */
export const NOTES: readonly Note[] = [
  {
    slug: 'autocad-dotnet-plugin',
    key: 'autocad',
    paragraphs: 5,
    dependencies: '.NET 8, AutoCAD .NET API, civil engineering basics',
    relatedCase: 'saas-platform',
    keywords: [
      'AutoCAD .NET API plugin C#',
      'automatiser création dalot AutoCAD',
      'plugin AutoCAD génie civil .NET 8',
      'alignement et surface AutoCAD API',
      'export HY-8 FHWA automatisé',
    ],
  },
  {
    slug: 'licensing-desktop-dotnet',
    key: 'licensing',
    paragraphs: 5,
    dependencies: 'ASP.NET Core, REST APIs, desktop deployment',
    relatedCase: 'multi-tenant-isolation',
    keywords: [
      'licence logicielle desktop .NET',
      'hardware fingerprint identification machine C#',
      'heartbeat vérification licence API REST',
      'protéger un plugin AutoCAD contre la copie',
    ],
  },
  {
    slug: 'migration-dotnet-5-vers-10',
    key: 'dotnet-upgrade',
    paragraphs: 5,
    dependencies: '.NET, Entity Framework Core, CI/CD',
    relatedCase: 'mediatr-migration',
    keywords: [
      'migrer .NET 6 vers .NET 8 en production',
      'montée de version .NET sans réécriture',
      'breaking changes EF Core migration',
      'stratégie upgrade .NET long terme',
    ],
  },
] as const;

export function findNote(slug: string): Note | undefined {
  return NOTES.find((n) => n.slug === slug);
}

/** The other notes, for the "read next" block. */
export function relatedNotes(slug: string): Note[] {
  return NOTES.filter((n) => n.slug !== slug);
}

/* ---------------------------------------------------------------- faq */

/**
 * Questions phrased the way someone actually asks them. FAQPage schema is
 * the format answer engines quote most readily, so this is aimed at being
 * cited in an AI response as much as at ranking.
 */
export const FAQ_KEYS = [
  'isolation',
  'xminVsRowversion',
  'leaveMediatr',
  'availability',
] as const;

export type FaqKey = (typeof FAQ_KEYS)[number];

/* ---------------------------------------------------------------- stack */

export interface TechItem {
  name: string;
  /** Where it is actually used — shown on hover. Never invented. */
  context: string;
}

export const STACK_GROUPS = [
  'core',
  'architecture',
  'data',
  'security',
  'quality',
  'cloud',
  'familiar',
] as const;

export type StackGroup = (typeof STACK_GROUPS)[number];

export const STACK: Record<StackGroup, readonly TechItem[]> = {
  core: [
    { name: 'C#', context: 'Every role since 2023' },
    { name: '.NET 10', context: 'TeamXtend — production' },
    { name: 'ASP.NET Core', context: 'TeamXtend, ITEC, Access International' },
    { name: 'EF Core 10', context: 'TeamXtend — Global Query Filters, xmin' },
    { name: 'TypeScript', context: 'TeamXtend, SimplyDesk' },
    { name: 'Angular 18', context: 'TeamXtend — full front end' },
    { name: 'RxJS', context: 'TeamXtend — caching, lazy dropdowns' },
  ],
  architecture: [
    { name: 'Clean Architecture', context: 'TeamXtend — layer boundaries' },
    { name: 'CQRS', context: 'TeamXtend — 100+ handlers' },
    { name: 'Custom Dispatcher', context: 'TeamXtend — replaced MediatR' },
    { name: 'Application Services', context: 'TeamXtend — Controller to IService' },
    { name: 'Specification Pattern', context: 'TeamXtend — 5 domain aggregates' },
    { name: 'Mapperly', context: 'TeamXtend — replaced AutoMapper' },
    { name: 'FluentValidation', context: 'TeamXtend — API boundary' },
  ],
  data: [
    { name: 'PostgreSQL', context: 'TeamXtend, Tunisie Telecom' },
    { name: 'SQL Server', context: 'ITEC, Access International, SimplyDesk' },
    { name: 'xmin', context: 'TeamXtend — optimistic concurrency' },
    { name: 'Global Query Filters', context: 'TeamXtend — tenant isolation' },
    { name: 'T-SQL', context: 'Stored procedures, indexing' },
  ],
  security: [
    { name: 'ASP.NET Core Identity', context: 'TeamXtend' },
    { name: 'JWT', context: 'TeamXtend — per-tenant claims' },
    { name: 'RBAC', context: 'TeamXtend — entity-level permissions' },
    { name: 'SignalR', context: 'TeamXtend — editing presence' },
    { name: 'REST', context: 'Every role' },
    { name: 'Swagger / OpenAPI', context: 'TeamXtend, ITEC' },
  ],
  quality: [
    { name: 'Serilog', context: 'TeamXtend — structured JSON, CorrelationId' },
    { name: 'xUnit', context: 'TeamXtend, Access International' },
    { name: 'Moq', context: 'TeamXtend — controller unit tests' },
    { name: 'FluentAssertions', context: 'TeamXtend' },
    { name: 'Testcontainers', context: 'TeamXtend — PostgreSQL integration tests' },
  ],
  cloud: [
    { name: 'Docker', context: 'TeamXtend — containerised API' },
    { name: 'Azure App Service', context: 'TeamXtend — Dev and Staging' },
    { name: 'Azure Container Registry', context: 'TeamXtend — image registry' },
    { name: 'GitHub Actions', context: 'TeamXtend — quality gates' },
    { name: 'Azure DevOps', context: 'Access International' },
    { name: 'TeamCity', context: 'SimplyDesk' },
  ],
  familiar: [
    { name: 'React', context: 'SimplyDesk' },
    { name: 'Next.js', context: 'Personal SaaS — live client' },
    { name: 'Node.js', context: 'Personal SaaS' },
    { name: 'Payload CMS', context: 'Personal SaaS — headless backend' },
    { name: 'Blazor', context: 'Exploratory' },
    { name: 'Dapper', context: 'ITEC' },
    { name: 'SOAP', context: 'Tunisie Telecom' },
    { name: 'AutoCAD .NET API', context: 'ITEC — desktop plugin' },
  ],
};
