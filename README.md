# Portfolio — Soltani Fedi

Portfolio bilingue FR/EN. Next.js 16, React 19, TypeScript strict, Tailwind v4.

## Démarrer

```bash
npm install
npm run dev
```

Puis http://localhost:3000 — redirection vers `/fr`.

## Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm start` | Sert le build |
| `npm run typecheck` | `tsc --noEmit`, sans build |

## Déployer

1. Poussez sur GitHub, puis importez le dépôt sur Vercel — la configuration est détectée automatiquement.
2. Définissez `NEXT_PUBLIC_SITE_URL` sur votre domaine final, par exemple `https://fedisoltani.dev`.

Sans cette variable, `lib/site.ts` retombe sur l'URL Vercel de production, puis sur `localhost`. Elle pilote le sitemap, les URLs canoniques, les liens hreflang et les métadonnées Open Graph — c'est la seule chose à configurer.

## État

**Fait**

- 9 sections, contenu réel issu du CV, bilingue avec 240 clés strictement alignées
- Explorateur RBAC interactif : rôle × tenant, avec filtrage réel des lignes
- Formation, langues et localisation affichées dans Contact
- 3 métriques chiffrées par étude de cas
- 4 extraits de code réels, un par étude de cas
- manifest et apple-icon pour l'ajout à l'écran d'accueil
- Double thème ivoire / indigo, transition GSAP des variables CSS, script anti-flash
- Démo interactive de concurrence optimiste (xmin, HTTP 409, editing presence)
- 4 études de cas prégénérées, avec extraits de code C# réels colorés au build
- Schéma d'isolation multi-tenant en SVG, suivant le thème sans JavaScript
- Smooth scroll Lenis, barre de progression, curseur personnalisé
- SEO complet : sitemap, robots, favicon, images Open Graph par locale, JSON-LD Person
- 14 routes prérendues en statique

**Reste**

- Vos photos (voir plus bas)
- Explorateur RBAC interactif, sur le modèle de la démo 409
- Une métrique d'impact chiffrée dans les études de cas

## Ce qu'il vous reste à fournir

Déposez cinq fichiers dans `public/photos/` :

| Fichier | Ratio | Rôle |
|---|---|---|
| `portrait-01.jpg` | 3:4 | Portrait principal |
| `workspace-01.jpg` | 16:9 | Poste de travail |
| `portrait-02.jpg` | 1:1 | Portrait secondaire |
| `detail-01.jpg` | 4:5 | Détail — écran, mains, tableau |
| `workspace-02.jpg` | 16:9 | Contexte large |

JPEG qualité 85, 1600 px minimum sur le côté long. Next.js convertit en AVIF et WebP au build.

## Mesures relevées

Vérifiées sur le build de production, pas estimées.

| Métrique | Valeur |
|---|---|
| HTML de l'accueil | 128 kB brut, 21 kB gzip |
| CSS | 5 kB gzip |
| JS chargé sur `/fr` | 252 kB gzip, 11 fichiers |
| Routes statiques | 14 |
| Clés de traduction | 193, identiques FR et EN |

Le JS est dominé par le socle Next 16 + React 19. GSAP est la plus grosse dépendance applicative, présente dans des chunks totalisant 58 kB gzip. Si vous voulez descendre nettement, c'est le seul levier réel : remplacer `Reveal` par un `IntersectionObserver` et la transition de thème par des transitions CSS permettrait de supprimer GSAP et ScrollTrigger. Le coût est une animation légèrement moins fine.

## Contrastes

Tous les couples texte/fond ont été calculés, pas jugés à l'œil. Tout est AA, sauf l'accent terracotta sur le fond ivoire le plus sombre (4,39:1), utilisé uniquement en gros caractères — donc conforme.

Deux corrections issues de ce calcul méritent d'être connues avant de toucher aux couleurs :

- En thème indigo, la section Travaux s'inverse sur fond clair, et l'accent indigo y tombait à 2,5:1. D'où le token `--accent-on-invert`, qui vaut orange en ivoire et indigo profond en indigo.
- Les libellés monospace font 0,72 rem : ils comptent comme du petit texte et exigent 4,5:1, pas 3:1. `--ink-faint` a été ajusté dans les deux thèmes en conséquence.

## Décisions techniques à connaître

**Les polices sont auto-hébergées** via `@fontsource-variable`, pas `next/font/google`. Aucune requête vers `fonts.gstatic.com`, ni au build ni à l'exécution.

**La bascule de thème n'est pas un changement de classe.** `ThemeProvider` interpole chaque variable CSS avec GSAP sur 800 ms et expose un `subscribe()` pour qu'un consommateur externe suive la même timeline.

**Les messages envoyés au client sont restreints** aux quatre espaces de noms lus par des composants client — `nav`, `hero`, `experience`, `concurrency`. Si vous ajoutez un `useTranslations` dans un composant `'use client'`, ajoutez son espace de noms à `CLIENT_NAMESPACES` dans `app/[locale]/layout.tsx`, sinon vous obtiendrez un `MISSING_MESSAGE` à l'exécution.

**La coloration syntaxique est faite au build** par un tokeniseur maison dans `CodeBlock`. Shiki ou Prism auraient ajouté plus de 100 kB au client pour colorer trois extraits statiques.

**`lucide-react` v1 a retiré les icônes de marque.** Pas de `Linkedin` — `ExternalLink` est utilisé à la place.

**Toutes les durées et eases sont dans `lib/animation-config.ts`.** Aucun nombre magique ailleurs.

## Structure

```
app/
  [locale]/            layout, page d'accueil, work/[slug], opengraph-image
  globals.css          tokens des deux thèmes, reset, utilitaires
  sitemap.ts robots.ts icon.svg
components/
  layout/              Header, Footer, SectionHeader, toggles, ScrollProgress
  sections/            les 8 sections
  concurrency/         la démo interactive 409
  motion/              Reveal, SmoothScroll
  scene/               IsolationDiagram (SVG)
  seo/                 PersonJsonLd
  ui/                  CodeBlock, Cursor, PhotoSlot
lib/
  animation-config     durées, eases, seuils
  theme                tokens typés
  content              données structurées non traduisibles
  snippets             extraits C# réels
  site                 résolution de l'URL canonique
  i18n/                routing, navigation, request
messages/              fr.json, en.json
```
