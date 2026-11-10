# Architecture — component-based, built to grow

Goal (set by the manager): a codebase that stays easy to maintain and extend at any time. Every piece of UI is a component; pages only compose them. Adding a service, a case study, a page or a language must not require touching unrelated code.

## Layers

```
app/[lang]/…/page.tsx      Page      → picks sections, passes them content. No styling, no copy.
components/sections/       Section   → one block of a page (Hero, Services, Work…). Lays out components.
components/layout/         Layout    → shared on every page (Header, Footer, MobileMenu, ActionBar,
                                       LanguageSwitch, ThemeToggle). Rendered once in app/[lang]/layout.tsx.
components/route/          Signature → the route line (RouteBand, Rail, Node, Hit), reused across pages.
components/form/           Form      → StartForm and its fields.
components/ui/             Primitive → small building blocks (Button, LinkArrow, Chip, Tag) incl. shadcn/ui.
content/ · lib/            Data      → dictionaries, typed content, helpers. No JSX.
```

A layer may only import from the layers below it: **page → section → layout/route/form → ui → lib/content**. Never the other way round (a Button never imports a section).

## Rules

1. **Pages compose, they don't build.** A page file reads the locale, loads content, and renders sections in order:
   ```tsx
   <Hero content={t.home.hero} />
   <Services items={services} />
   <Process steps={t.process.steps} />
   ```
2. **Header and Footer are written once** in `app/[lang]/layout.tsx`. Links, logo and language switch change in one place for every page.
3. **No copy inside components.** All text comes in through props, from `content/dictionaries/{ar,en,fr}.json` or `content/` files — the same component serves all three languages.
4. **One component per file**, named like the component (`Header.tsx` exports `Header`). Keep files small; split when a component does two jobs.
5. **Typed props** with a `Props` type at the top of the file. Prefer passing data (`items`, `content`) over many boolean flags; use `children` / slots for composition.
6. **Server Components by default.** Add `"use client"` only to the part that needs interaction (menu toggle, language dropdown, theme toggle, form, animation) — keep it as small as possible and pass server data into it as props.
7. **Styling only through tokens**: semantic Tailwind utilities (`bg-bg-page`, `text-text-secondary`…) and logical properties (`ms-`, `pe-`, `start-`). No hex values, no `left/right`. Variants with `class-variance-authority`, merging with `cn()`.
8. **Animation lives in the component that moves**, using `<m.*>` and the tokens in `lib/motion.ts`. A component must look complete with reduced motion.
9. **Accessible by default**: real `<button>` / `<a>`, labels for icon-only controls, visible focus, landmarks (`header`, `nav`, `main`, `footer`).
10. **Reuse before you add.** Check `components/` first; if two places need almost the same thing, extend the existing component with a prop or a variant instead of copying it.

## Adding things later

| To add…        | Touch                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------- |
| A service      | `content/services/<slug>` + its strings — the Services section and service template render it |
| A case study   | `content/work/<slug>` — the Work gallery and case-study template render it                    |
| A page         | `app/[lang]/<route>/page.tsx` composing existing sections; add its link to the Header data    |
| A language     | `lib/i18n.ts` (locale + direction) and `content/dictionaries/<lang>.json`                     |
| A UI primitive | `components/ui/` (or `npx shadcn@4.22.1 add <name>`), restyled to the tokens                  |

## Folder of a component

```
components/sections/Services/
  Services.tsx        the component (server)
  ServiceCard.tsx     sub-component used only here
  index.ts            export { Services } from "./Services"
```

Simple components can stay a single file (`components/ui/Tag.tsx`); use a folder once a component has private sub-parts.
