# Contributing — Development team

## One task = one branch = one pull request

Each Trello card in the **Ready to Start** column is built on its own branch and reviewed before the next card starts.

1. Move the card to **In Progress**.
2. Branch from `main`:
   `git switch -c feat/home-page` (prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`).
3. Commit in small steps (format below), push, open a pull request to `main`.
4. Move the card to **Review**, paste the PR link (and a preview link when deployed) in the card.
5. The Development lead reviews; after approval: merge, move the card to **Done**.

`main` is always buildable. Never commit directly to `main`, never force-push to it.

## Commit messages — Conventional Commits, in English

```
feat(home): add hero route band
fix(i18n): keep the same page when switching language
chore(deps): bump motion to 14.6.1
docs: explain dark mode tokens
```

Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`, `perf`. Imperative mood, ≤ 72 characters.

## Before opening a PR

```bash
npm run lint && npm run typecheck && npm run format:check && npm run build
```

- Matches the handoff screen at 390 / 768 / 1440, in Arabic **and** in English/French (LTR mirror).
- Works in light and dark mode.
- Keyboard: every control reachable, visible focus; `prefers-reduced-motion` respected.
- No placeholder copy or unverified numbers in anything that ships (D-015, D-025).
- No new dependency without a reason in the PR description; pin the exact version.

## Code rules

- Semantic tokens only (`bg-bg-page`, not `bg-ink-900`); logical properties only (`ms-4`, not `ml-4`).
- Server Components by default; add `"use client"` only where interaction needs it.
- Text never hard-coded in components — it comes from the dictionaries or the content files.
- Images through `next/image` with explicit sizes; reserve their ratio (no layout shift).
