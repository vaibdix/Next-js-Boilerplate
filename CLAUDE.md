

## General Rules

- MUST NOT: Create Git worktrees. Work only in the current repository checkout.

- MUST: Use pnpm only scripts like pnpm dev pnpm dlx etc
- MUST: Use TypeScript interfaces over types.
- MUST: Export every shared type from its package barrel (`packages/*/src/index.ts`). No deep cross-package imports — `@s3-web/core`, never `@s3-web/core/fs`. `@s3-web/ui` is the one exception: it has no barrel and exports per subpath by design.
- MUST: Use arrow functions over function declarations
- MUST: No comments. None — not even a "why". If a decision needs explaining, the explanation belongs in the commit message, where it survives the next refactor and a comment does not. Tooling directives (`@ts-`, `oxlint-`) are not comments and are fine.
- MUST: Use kebab-case for files
- MUST: Use descriptive names for variables (avoid shorthands, or 1-2 character names).
  - Example: for .map(), you can use `innerX` instead of `x`
  - Example: instead of `moved` use `didPositionChange`
  - Exception: algorithm notation transcribed from a published source keeps the paper's names. `packages/core/src/diff.ts` is a direct transcription of Myers' diff and keeps `a`/`b`/`x`/`y`/`d`/`k`; renaming decouples it from the paper it implements.
- MUST: Frequently re-evaluate and refactor variable names to be more accurate and descriptive.
- MUST: Do not type cast ("as") unless absolutely necessary
- MUST: Remove unused code and don't repeat yourself.
- MUST: Always search the codebase, think of many solutions, then implement the most _elegant_ solution.
- MUST: No bare numeric literals in logic. Every meaningful number is a `SCREAMING_SNAKE_CASE` constant at module scope with a unit suffix where one applies (`_MS`, `_PX`, `_BYTES`). Keep it beside what it configures — a shared `constants.ts` is not required and mostly is not wanted, since only a tenth of this repo's constants cross a module boundary and those are already package public API.
- MUST: Put small, focused utility functions in `utils/` with one utility per file.
- MUST: Use Boolean over !!.
- MUST: Do not preserve backward compatibility
- MUST: Prefer established, well-maintained libraries over custom implementation
- MUST: Never add fallback if something fails it must fail loudly
- MUST: User Native implementation provided by S3 SDK whenever available
- MUST: Always run `pnpm dlx react-doctor@latest` for all packages on entire codebase and make sure to fix all things listed here and not patch them
