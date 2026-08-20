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
  linkedin: 'https://www.linkedin.com/in/fedi-soltani1/',
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

/** Long-tail queries, one list per language. */
export interface LocalisedKeywords {
  readonly fr: readonly string[];
  readonly en: readonly string[];
}

/** The list for a locale, falling back to English for anything unexpected. */
export function keywordsFor(
  keywords: LocalisedKeywords,
  locale: string,
): string[] {
  return [...(locale === 'fr' ? keywords.fr : keywords.en)];
}

export interface CaseStudy {
  key: 'isolation' | 'concurrency' | 'auth' | 'licensing' | 'saas';
  slug: string;
  /**
   * Long-tail queries this study genuinely answers, per language. Used as
   * schema keywords — never stuffed into the copy.
   *
   * Split by locale because a single shared list meant the English pages
   * declared French queries in their TechArticle schema. Google and the
   * answer engines read that field, and a page describing itself in a
   * language it is not written in sends a confused topical signal.
   */
  keywords: LocalisedKeywords;
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
    keywords: {
      fr: [
        'isolation des données multi-tenant .NET',
        'EF Core global query filter multi-tenant',
        'claims JWT par tenant ASP.NET Core',
        'RBAC entity-level EF Core',
        'architecture SaaS multi-tenant .NET',
      ],
      en: [
        'EF Core global query filter multi-tenant',
        'multi-tenant data isolation .NET',
        'per-tenant JWT claims ASP.NET Core',
        'entity-level RBAC EF Core',
        'multi-tenant SaaS architecture .NET',
      ],
    },
  },
  {
    key: 'concurrency',
    slug: 'optimistic-concurrency',
    pillar: 'concurrency',
    dependencies: 'Entity Framework Core, PostgreSQL, SignalR',
    keywords: {
      fr: [
        'concurrence optimiste EF Core PostgreSQL',
        'xmin comme jeton de concurrence EF Core',
        'DbUpdateConcurrencyException renvoyer un 409',
        'présence d’édition temps réel SignalR',
        'tests d’intégration PostgreSQL Testcontainers .NET',
      ],
      en: [
        'PostgreSQL xmin concurrency token EF Core',
        'optimistic concurrency EF Core PostgreSQL',
        'DbUpdateConcurrencyException HTTP 409',
        'real-time editing presence SignalR',
        'Testcontainers PostgreSQL integration tests .NET',
      ],
    },
  },
  {
    key: 'auth',
    slug: 'refresh-token-rotation',
    pillar: 'concurrency',
    dependencies: 'ASP.NET Core Identity, JWT, relational database',
    keywords: {
      fr: [
        'rotation des refresh tokens détection de rejeu',
        'refresh token à usage unique ASP.NET Core',
        'compare-and-swap refresh token en base',
        'révoquer toutes les sessions ASP.NET Core Identity',
        'invalider un JWT au changement de rôle',
      ],
      en: [
        'refresh token rotation reuse detection .NET',
        'single-use refresh token ASP.NET Core',
        'compare-and-swap refresh token database',
        'revoke all sessions ASP.NET Core Identity',
        'JWT security stamp role invalidation',
      ],
    },
  },
  {
    key: 'licensing',
    slug: 'mediatr-migration',
    pillar: 'architecture',
    dependencies: 'ASP.NET Core, CQRS, dependency injection',
    keywords: {
      fr: [
        'alternative à MediatR devenu payant',
        'remplacer MediatR par un dispatcher custom',
        'migrer d’AutoMapper vers Mapperly',
        'CQRS sans MediatR en .NET',
        'MediatR dual license 2025 que faire',
      ],
      en: [
        'MediatR commercial licence alternative',
        'replace MediatR with a custom dispatcher',
        'migrate from AutoMapper to Mapperly',
        'CQRS without MediatR .NET',
        'MediatR dual license 2025 migration',
      ],
    },
  },
  {
    key: 'saas',
    slug: 'saas-platform',
    pillar: 'delivery',
    dependencies: 'Next.js, Payload CMS, PostgreSQL',
    keywords: {
      fr: [
        'authentification par magic link Next.js',
        'Payload CMS headless avec Next.js',
        'authentification sans mot de passe implémentation',
        'Neon PostgreSQL serverless avec Next.js',
      ],
      en: [
        'magic link authentication Next.js',
        'Payload CMS headless Next.js SaaS',
        'passwordless authentication implementation',
        'Neon serverless PostgreSQL Next.js',
      ],
    },
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
  key: 'autocad' | 'licensing' | 'dotnet-upgrade' | 'observability';
  /** Number of body paragraphs in the messages file. */
  paragraphs: number;
  keywords: LocalisedKeywords;
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
    keywords: {
      fr: [
        'plugin AutoCAD en C# avec l’API .NET',
        'automatiser la création d’un dalot AutoCAD',
        'plugin AutoCAD génie civil .NET 8',
        'lire un alignement et une surface AutoCAD API',
        'export automatisé vers HY-8 FHWA',
      ],
      en: [
        'AutoCAD .NET API plugin C#',
        'automate culvert creation AutoCAD',
        'AutoCAD civil engineering plugin .NET 8',
        'read alignment and surface AutoCAD API',
        'automated HY-8 FHWA export',
      ],
    },
  },
  {
    slug: 'licensing-desktop-dotnet',
    key: 'licensing',
    paragraphs: 5,
    dependencies: 'ASP.NET Core, REST APIs, desktop deployment',
    relatedCase: 'multi-tenant-isolation',
    keywords: {
      fr: [
        'licence logicielle pour application desktop .NET',
        'empreinte matérielle identification machine C#',
        'heartbeat de vérification de licence API REST',
        'protéger un plugin AutoCAD contre la copie',
      ],
      en: [
        'desktop software licensing .NET',
        'hardware fingerprint machine identification C#',
        'licence heartbeat verification REST API',
        'protect an AutoCAD plugin from copying',
      ],
    },
  },
  {
    slug: 'migration-dotnet-5-vers-10',
    key: 'dotnet-upgrade',
    paragraphs: 5,
    dependencies: '.NET, Entity Framework Core, CI/CD',
    relatedCase: 'mediatr-migration',
    keywords: {
      fr: [
        'migrer de .NET 6 vers .NET 8 en production',
        'montée de version .NET sans réécriture',
        'breaking changes EF Core lors d’une migration',
        'stratégie de mise à niveau .NET sur le long terme',
      ],
      en: [
        'migrate .NET 6 to .NET 8 in production',
        '.NET version upgrade without a rewrite',
        'EF Core breaking changes migration',
        'long-term .NET upgrade strategy',
      ],
    },
  },
  {
    slug: 'serilog-logs-multi-tenant',
    key: 'observability',
    paragraphs: 5,
    dependencies: 'ASP.NET Core, Serilog, multi-tenant architecture',
    relatedCase: 'multi-tenant-isolation',
    keywords: {
      fr: [
        'Serilog logs structurés en ASP.NET Core',
        'enrichir les logs avec le TenantId',
        'CorrelationId et header X-Correlation-ID ASP.NET Core',
        'observabilité d’une application SaaS multi-tenant',
        'Serilog enricher middleware .NET 10',
      ],
      en: [
        'Serilog structured logging ASP.NET Core',
        'enrich logs with TenantId multi-tenant',
        'CorrelationId X-Correlation-ID ASP.NET Core',
        'multi-tenant SaaS application observability',
        'Serilog enricher middleware .NET 10',
      ],
    },
  },
] as const;

export function findNote(slug: string): Note | undefined {
  return NOTES.find((n) => n.slug === slug);
}

/**
 * Two other notes for the "read next" block.
 *
 * Capped at two, and rotating rather than "all the others", so the block
 * stays the same size as the collection grows and every note both gives and
 * receives exactly two links.
 */
export function relatedNotes(slug: string): Note[] {
  const index = NOTES.findIndex((n) => n.slug === slug);
  if (index === -1) return [];

  return [
    NOTES[(index + 1) % NOTES.length]!,
    NOTES[(index + 2) % NOTES.length]!,
  ];
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

/**
 * The case study that answers each question in full depth. Three of the
 * four questions restate something a case study already covers — leaving
 * that connection implicit meant a reader who wanted the full mechanism
 * had to go find it themselves. `availability` has no matching case study
 * on purpose: it is about the person, not the architecture.
 */
export const FAQ_RELATED_CASE: Partial<Record<FaqKey, CaseStudy['slug']>> = {
  isolation: 'multi-tenant-isolation',
  xminVsRowversion: 'optimistic-concurrency',
  leaveMediatr: 'mediatr-migration',
};

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
