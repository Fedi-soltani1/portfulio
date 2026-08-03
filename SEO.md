# Référencement — état, stratégie et ce qu'il vous reste à faire

## Chiffres actuels

| | Avant | Maintenant |
|---|---|---|
| URLs indexables | 10 | **20** |
| Mots-clés ciblés | 18 | **37** |
| Articles | 4 | **8** |
| Types de schema | 5 | **6** (+ `FAQPage`) |
| Liens internes | 24 | **~50** |

**⚠️ Contenu à vérifier.** Les trois notes techniques ont été rédigées à partir des faits de votre CV. Relisez-les avant mise en ligne : je n'ai pas inventé de détail technique, mais certaines formulations méritent votre validation — notamment sur le plugin AutoCAD et la plateforme de licensing, où je ne disposais que du niveau de détail du CV.


Document de travail. Ce qui est **fait** est vérifié sur le build ; ce qui est **à faire** dépend de vous, pas du code.

---

## 1. Ce qui a été implémenté

### Graphe de données structurées

Six types de schema, reliés par des `@id` partagés — c'est ce qui fait qu'un crawler résout l'ensemble en **une seule entité** plutôt qu'en six mentions sans rapport.

| Schema | Où | Rôle |
|---|---|---|
| `Person` | Toutes les pages | L'entité racine, `@id` stable, avec `hasOccupation`, `worksFor`, `alumniOf`, 36 compétences |
| `WebSite` | Toutes les pages | Déclare le site et pointe vers la personne comme éditeur |
| `ProfilePage` | Accueil | Dit que **la page parle d'une personne** — condition pour un Knowledge Panel sur une requête nominative |
| `TechArticle` | 5 études de cas + 3 notes | Les rend éligibles aux requêtes techniques qu'elles répondent réellement, avec `dependencies` et `proficiencyLevel` |
| `BreadcrumbList` | 8 articles | Remplace l'URL brute par un chemin lisible dans les résultats |
| `FAQPage` | Accueil | Quatre questions réelles, éligibles aux réponses directes et aux citations par les moteurs génératifs |

`Person` seul ne dit qu'une chose : une personne est mentionnée. `ProfilePage` + `Person` avec le même `@id` dit : cette page **est** le profil de cette personne.

### Maillage interne

Avant, les pages d'études de cas avaient **zéro lien sortant**. Un crawler y arrivait et s'arrêtait.

| Depuis | Vers | Nombre |
|---|---|---|
| Accueil → études de cas | Section Travaux | 5 |
| Piliers d'expertise → étude correspondante | Ancrage contextuel | 4 |
| Chaque étude → 2 autres | Bloc « À lire ensuite » | 10 |
| Chaque note → étude de cas liée | Ancrage thématique | 3 |
| Chaque article → accueil + section | Fil d'Ariane | 16 |

La rotation garantit que **chaque étude donne et reçoit exactement deux liens** : aucune page orpheline, aucun cul-de-sac. Vérifié sur le build : minimum 3 liens entrants par page, profondeur de crawl maximale **1 clic** depuis l'accueil.

### Métadonnées par page

Le titre affiché sur la page est éditorial (« Le conflit qu'on ne voit pas »). Le titre dans le `<head>` est **la requête que quelqu'un taperait** :

| Page | `<title>` |
|---|---|
| Isolation | Isolation multi-tenant avec EF Core Global Query Filters |
| Concurrence | Concurrence optimiste PostgreSQL avec xmin |
| Refresh tokens | Rotation de refresh tokens et détection de rejeu |
| MediatR | Remplacer MediatR par un dispatcher custom |
| SaaS | Authentification magic link avec Next.js |

Confondre les deux coûte soit le lecteur, soit le classement. Les 20 titres tiennent sous 60 caractères et les 20 descriptions sous 160 — au-delà, Google tronque et c'est lui qui choisit ce qui est coupé.

### Images de partage

Une carte distincte par étude de cas, portant le titre **et les trois métriques**. Réutiliser la carte générique ferait que quatre liens différents seraient visuellement identiques dans un Slack — seul le premier serait cliqué.

### Moteurs génératifs

- `llms.txt` généré depuis la même source que les pages, donc jamais désynchronisé
- `robots.txt` autorise **explicitement** GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended et sept autres

Le réflexe par défaut est de bloquer ces robots pour protéger son contenu. Le calcul s'inverse pour un portfolio : l'objectif est d'être **cité** quand quelqu'un demande à un assistant un ingénieur .NET avec de l'expérience SaaS multi-tenant. Les bloquer reviendrait à disparaître de la surface exacte où la question se pose.

---

## 2. Ce que vous pouvez réellement gagner

Je préfère être précis plutôt qu'encourageant.

### Atteignable, rapidement

**« Fedi Soltani », « Soltani Fedi »** — position 1 sous quelques semaines. C'est une requête de marque, vous n'avez quasiment aucune concurrence, et le schema `ProfilePage` + `Person` est exactement ce qui déclenche un panneau de connaissances.

**Requêtes techniques longue traîne** — c'est là que se trouve la vraie valeur, et c'est pour ça que les études de cas sont écrites comme des articles :

- `EF Core global query filter multi-tenant`
- `PostgreSQL xmin concurrency token EF Core`
- `remplacer MediatR dispatcher custom`
- `MediatR dual license migration`

Faible concurrence, forte intention, et votre contenu répond réellement. Un développeur qui cherche ça et tombe sur vous est un lecteur qualifié.

### Atteignable avec du temps

**« développeur .NET Tunisie », « ingénieur .NET Tunis »** — quelques mois, à condition d'avoir des liens entrants.

### Non atteignable

**« développeur .NET », « développeur fullstack »** — ces requêtes sont dominées par des plateformes d'emploi et des agences avec des milliers de pages et des années d'autorité. Aucun portfolio individuel ne les prend, quelle que soit la qualité technique.

**« Viral »** — le SEO ne rend rien viral. La viralité vient du contenu partagé par des humains, pas de l'indexation. Ce qui peut être partagé sur votre site, ce sont vos deux démos interactives — c'est de là que viendrait un pic de trafic, pas de Google.

---

## 3. Ce qu'il vous reste à faire

Ordre d'impact décroissant. **Aucun de ces points n'est du code** — c'est pour ça que je ne peux pas les faire à votre place.

### Bloquant

**Définir `NEXT_PUBLIC_SITE_URL`** au déploiement. Tant que c'est absent, le sitemap, les URLs canoniques et les images OG pointent sur `localhost`. Tout le reste est inutile sans ça.

**Déclarer le site dans Google Search Console** et y soumettre le sitemap. Sans ça, l'indexation prend des semaines au lieu de jours. Vous y verrez aussi les requêtes réelles sur lesquelles vous apparaissez — la seule donnée qui permet d'itérer.

### Fort impact

**Les liens entrants sont le seul facteur que le code ne peut pas fabriquer.** Trois sources réalistes et honnêtes :

1. **Votre profil LinkedIn** — mettez l'URL dans la section « Site web ». C'est le lien le plus facile et le plus utile.
2. **GitHub** — l'URL dans votre profil, et dans le README des dépôts publics.
3. **Réponses techniques** — quand vous répondez sur Stack Overflow ou dans une discussion GitHub sur `xmin` et EF Core, lier votre étude de cas quand elle répond vraiment à la question. Jamais en spam : un lien hors sujet vous coûte plus qu'il ne rapporte.

**Publier les études de cas ailleurs**, en version courte, avec un lien canonique vers votre site : dev.to, Hashnode, ou un post LinkedIn détaillé. Le contenu existe déjà, c'est du recyclage.

### Moyen impact

**Écrire deux ou trois notes techniques de plus.** Chaque page qui répond à une vraie question est une porte d'entrée supplémentaire. Mais seulement si vous écrivez réellement — trois articles puis plus rien fait plus de mal que bien.

**Ajouter une vraie métrique mesurée** dans une étude de cas. Les chiffres actuels sont structurels et défendables, mais une latence p95 ou un temps de déploiement mesuré serait plus fort.

---

## 4. Vérifier après le déploiement

| Outil | Ce qu'il valide |
|---|---|
| [Rich Results Test](https://search.google.com/test/rich-results) | Que les cinq schemas sont valides et se résolvent |
| [Search Console](https://search.google.com/search-console) | Indexation, requêtes réelles, erreurs de crawl |
| [PageSpeed Insights](https://pagespeed.web.dev/) | LCP, INP, CLS — facteurs de classement confirmés |
| [Schema validator](https://validator.schema.org/) | Le graphe complet, références `@id` incluses |
| `votresite.com/llms.txt` | Que le fichier est servi et à jour |

---

## Sources

- [Structured Data SEO 2026: Rich Results Guide](https://www.digitalapplied.com/blog/structured-data-seo-2026-rich-results-guide)
- [Technical SEO checklist for developers 2026](https://blog.yaamwebsolutions.com/technical-seo-checklist-for-developers-2026/)
- [Generative Engine Optimization: The 2026 Guide to AI Search Visibility](https://llmrefs.com/generative-engine-optimization)
- [LLMS.txt Explained: Should Your Brand Add One for AI Crawlers in 2026?](https://sociolabs.in/llms-txt-explained-ai-crawlers-2026/)
