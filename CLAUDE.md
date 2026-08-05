## General Rules

- MUST NOT: Create Git worktrees. Work only in the current repository checkout.

- MUST: Use pnpm only scripts like pnpm dev pnpm dlx etc
- MUST: Use TypeScript interfaces over types. Object shapes are `interface`; union, intersection and inferred aliases (`z.infer`, `React.ComponentProps<'div'> &`) stay `type`. Enforced by `typescript/consistent-type-definitions` in `oxlint.config.ts`.
- MUST: Use arrow functions over function declarations. Enforced by `func-style` in `oxlint.config.ts`.
- MUST: No comments. None — not even a "why". If a decision needs explaining, the explanation belongs in the commit message, where it survives the next refactor and a comment does not. Tooling directives (`@ts-`, `oxlint-`) are not comments and are fine.
  - Exception: test files and config files may carry a comment when it records why a check is suppressed or a value is pinned, because that reasoning has no other home.
- MUST: Use kebab-case for files
- MUST: Use descriptive names for variables (avoid shorthands, or 1-2 character names).
  - Example: for .map(), you can use `innerX` instead of `x`
  - Example: instead of `moved` use `didPositionChange`
  - Exception: `const t = useTranslations(...)` / `getTranslations(...)` is the documented next-intl idiom and stays.
- MUST: Frequently re-evaluate and refactor variable names to be more accurate and descriptive.
- MUST: Do not type cast ("as") unless absolutely necessary. `as const` is not a cast and is fine.
- MUST: Remove unused code and don't repeat yourself.
- MUST: Always search the codebase, think of many solutions, then implement the most _elegant_ solution.
- MUST: No bare numeric literals in logic. Every meaningful number is a `SCREAMING_SNAKE_CASE` constant at module scope with a unit suffix where one applies (`_MS`, `_PX`, `_BYTES`). Keep it beside what it configures — a shared `constants.ts` is not required and mostly is not wanted.
- MUST: Put small, focused utility functions in `src/utils/` with one utility per file.
- MUST: Use Boolean over !!.
- MUST: Do not preserve backward compatibility
- MUST: Prefer established, well-maintained libraries over custom implementation
- MUST: Never add fallback if something fails it must fail loudly
- MUST: Always run `pnpm dlx react-doctor@latest` on the entire codebase and fix what it lists rather than patching around it. Where a finding conflicts with an enforced lint rule, lint wins and the conflict is recorded below.

## Verification

- MUST: `pnpm run check:types`, `pnpm run lint`, `pnpm run check:deps`, `pnpm run check:i18n`, `pnpm run test` all pass before work is called done.
- MUST: Run `pnpm run test:e2e` for anything touching routing, middleware, or rendering.
- The full gate runs in one command with `act push`, using the gitignored `.github/workflows/ci.yml`. That workflow is a local harness only — it is never pushed and never runs on GitHub.
- `lefthook` pre-push runs `check:types` and the unit tests. Pre-commit runs oxlint, oxfmt, stylelint, knip and secretlint.

## Where this file loses to tooling

Two rules here contradict `AGENTS.md`, which is left intact. When they disagree, this file wins and the lint config is the tiebreak:

- `AGENTS.md` documents `type` over `interface`; `oxlint.config.ts` enforces `interface`.
- `AGENTS.md` requires JSDoc on exported functions and encourages explanatory comments; the `jsdoc/require-*` rules are off and comments are removed from `src/`.

One known tool conflict, resolved in oxlint's favour: react-doctor wants the `useCallback` removed from `src/components/announcer.tsx`; oxlint's `jsx-no-constructed-context-values` requires it.
