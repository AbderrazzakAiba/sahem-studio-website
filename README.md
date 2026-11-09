# Sahem Studio — website · سهم ستوديو

> موقع سهم ستوديو. مبني على حزمة التسليم المعتمدة من قسم التصميم (v1.1)، بثلاث لغات (العربية افتراضية، الفرنسية، الإنجليزية) ووضع داكن.
> هذا المستودع في مرحلة **الإعداد**: التقنية والهوية واللغات جاهزة، والصفحات تُبنى في المهام التالية.

## Stack

|                                                              | Version        | Why                                                                                                                                                            |
| ------------------------------------------------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Next.js](https://nextjs.org) (App Router, Cache Components) | 16.4.3         | Chosen by the team; static pages + fast routing. Read `node_modules/next/dist/docs/` — v16 differs from older docs (e.g. `proxy.ts` replaces `middleware.ts`). |
| TypeScript (strict)                                          | 5.9.3          | Typed content and props.                                                                                                                                       |
| Tailwind CSS v4                                              | 4.3.3          | Mapped 1:1 to the handoff tokens.                                                                                                                              |
| shadcn/ui (Radix, RTL)                                       | CLI 4.22.1     | Accessible primitives, restyled to the brand (square corners). Add components only when a page needs them: `npx shadcn@4.22.1 add <name>`.                     |
| GSAP + ScrollTrigger + @gsap/react                           | 3.15.0 / 2.1.2 | Motion spec of the handoff (D-007, D-029). Free “Standard no-charge” licence.                                                                                  |

Versions are pinned exactly and were at least two weeks old when chosen (stability + supply-chain safety). Upgrade deliberately, one package per PR.

## Getting started

Requirements: Node.js ≥ 20.9 (`.nvmrc` → 22), npm.

```bash
npm ci                 # install exact versions from package-lock.json
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

| Script                            |                                     |
| --------------------------------- | ----------------------------------- |
| `npm run dev`                     | Dev server                          |
| `npm run build` / `npm start`     | Production build / serve it         |
| `npm run lint`                    | ESLint (Next.js rules)              |
| `npm run typecheck`               | TypeScript, no emit                 |
| `npm run format` / `format:check` | Prettier (+ Tailwind class sorting) |

## Languages & routing

| URL     | Language         | Direction |
| ------- | ---------------- | --------- |
| `/…`    | Arabic (default) | RTL       |
| `/en/…` | English          | LTR       |
| `/fr/…` | French           | LTR       |

- `src/proxy.ts` rewrites unprefixed URLs to `/ar/…` internally and redirects `/ar/…` to the unprefixed URL, so each page has one address.
- Every page lives in `src/app/[lang]/`. The root layout sets `<html lang dir>`.
- UI strings: `src/content/dictionaries/{ar,en,fr}.json`, loaded on the server (`getDictionary`). `ar.json` defines the shape; a missing key in another language fails the type check.
- English and French copy is written natively, not translated word for word. Layout uses **logical** utilities only (`ms-/me-/ps-/pe-/start-/end-`) so it mirrors automatically.

## Design tokens & dark mode

- `src/styles/tokens.css` and `src/styles/tailwind.theme.css` are copied **unchanged** from the handoff (`02-tokens`). Do not edit them by hand — ask the Design lead for a new version.
- Use **semantic** utilities in components: `bg-bg-page`, `text-text-secondary`, `border-border-control`, `bg-button-primary-bg`… never primitives (`bg-ink-900`).
- Signal orange (`accent-signal`) is for dots, active nodes and the final “hit” only — max 5% of a screen, never body text.
- A section in the dark brand theme uses `data-theme="ink"` (the Work section).
- **Site dark mode** (manager’s request, not in the handoff — pending Design review): `html[data-mode="dark"]`, defined in `src/styles/dark-mode.css`. The palette inverts; the Ink section becomes Paper. Helpers in `src/lib/theme.ts`; `dark:` utilities follow it.
- Fonts: Readex Pro (Arabic) + Sora (Latin), self-hosted WOFF2 from the handoff, weights 400/500/600 only (`src/app/fonts.ts`).

## Motion

`src/lib/motion.ts` loads GSAP after first paint, registers ScrollTrigger and the brand ease `route` = `cubic-bezier(0.7, 0, 0.2, 1)`. In components use `useGSAP()` from `@gsap/react` (auto cleanup). Every animation needs a `prefers-reduced-motion` fallback; pin only from 1024px. Spec: `05-motion/motion-spec.md` in the handoff.

## Project structure

```
src/
  app/
    [lang]/            layout.tsx (html lang/dir, fonts, mode script) · page.tsx (home — next task)
    fonts/             brand WOFF2 + OFL licences
    fonts.ts  globals.css  icon.svg
  components/
    ui/                shadcn/ui primitives (restyled)
    layout/            Header, MobileMenu, ActionBar, Footer, LanguageSwitch, ThemeToggle
    sections/          Hero, Services, Process, Work, Faq, FinalCta
    route/             the signature route line: RouteBand, Rail, Node, Hit
    form/              StartForm and its fields
  content/
    dictionaries/      ar.json · en.json · fr.json
    services/  work/   MDX/JSON content (typed)
  lib/                 i18n.ts · dictionaries.ts · theme.ts · motion.ts · utils.ts
  styles/              tokens.css · tailwind.theme.css (from handoff) · dark-mode.css
  proxy.ts             locale routing
public/brand/          logo symbols + icons from the handoff · public/og/ Open Graph images
```

Empty folders hold a `.gitkeep` until their task fills them.

## Source of truth

The approved developer handoff **v1.1** from the Design lead: screens, components, motion spec, content, accessibility and performance budgets, and decisions D-001…D-029. Additions approved by the manager on top of it: **French** and **site dark mode**. When code and handoff disagree, the handoff wins — raise it with the Design lead.

## Security

- Security headers on every response (`next.config.ts`): `nosniff`, `DENY` framing, strict referrer, permissions policy, HSTS.
- A full Content-Security-Policy is added with the first page that loads third-party scripts.
- Secrets live in `.env.local` (git-ignored). Only `NEXT_PUBLIC_*` variables reach the browser — never put keys there.
- The start form (later task) validates on the server, uses a honeypot + rate limit, and stores nothing beyond what the privacy page states.
- `npm audit --omit=dev` must stay at 0 before merging.

## Working together

See [CONTRIBUTING.md](CONTRIBUTING.md).
