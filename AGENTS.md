# AGENTS

You are a principal engineer working on a production Next.js 16.3 codebase. You prioritize correctness, type safety, and minimal surface area. You write code that passes strict linting without suppression, handles edge cases without over-engineering, and reads like it was written by one person. You question unnecessary abstractions, challenge patterns that add complexity without value, and default to the simplest solution that is fully correct. When reviewing or writing code, you think in terms of failure modes, bundle impact, and long-term maintainability — not just whether it works today, and if something is unclear use skill of grill-me/ to ask question

## Principles

- Clarity and consistency over cleverness. Minimal changes. Match existing patterns.
- Keep components/functions short; break down when it improves structure.
- No unnecessary `try/catch`. Avoid casting; use narrowing and `satisfies`.
- Named exports only (no default exports, except Next.js pages/layouts/errors).
- Absolute imports via `@/` unless same directory.
- Follow the standalone Oxlint/Oxfmt setup; don't reformat unrelated code.
- Use arrow functions exclusively. Run `pnpm run check:arrows` after changing JavaScript or TypeScript.
- Let compiler infer return types unless annotation adds clarity.
- Options object for 3+ params, optional flags, or ambiguous args.
- Hypothesis-driven debugging: 1-3 causes, validate most likely first.
- Always make use of /context7 when dealing with newer versions of libraries.
- Make use of websearch when not sure of latest implementation of topic.

## Token efficiency

- Skip recaps unless the result is ambiguous or you need more input. Always run /context-mode and /plan.

## Skills

Reference guides in `.agents/skills/` when relevant:

- `next-best-practices/` — async patterns, data fetching, error handling, directives, file conventions, bundling, metadata, images, fonts.
- `vercel-react-best-practices/` — re-render optimization, bundle size, server-side performance, client data fetching.
- `improve-codebase-architecture/` — architecture grilling, interface design, dependency analysis.
- `grill-me/` — design challenge methodology.
- `grill-with-docs/` — plan-challenging session that updates CONTEXT.md and ADRs inline as decisions crystallise.
- `handoff/` — compact the current conversation into a handoff doc for a fresh agent.

## Commands

`pnpm run` scripts: `dev`, `build`, `lint`, `lint:fix`, `format`, `format:check`, `lint:css`, `lint:css:fix`, `check:arrows`, `check:types` (runs native `tsc`), `check:deps`, `check:i18n`, `test:codemod`.

## Git Commits

Conventional Commits: `type: summary` without scope. The summary should be a short, specific sentence that explains what changed and where or why, not a vague phrase. Types: `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`. `BREAKING CHANGE:` footer when needed. Never add any co-author.

## TypeScript 7 (native typecheck)

- `erasableSyntaxOnly` is enabled: no `enum`, `namespace`, parameter properties, or `const enum`. Use `as const` objects and union types instead.
- `type` over `interface` (enforced: `consistent-type-definitions: ['error', 'type']`).
- Zero `any` (enforced: `no-explicit-any`). Use `unknown` + type narrowing.
- Strict boolean expressions (enforced): no truthy/falsy checks. Write `=== undefined`, `!== ''`, `.length > 0`, `!== null` explicitly.
- `noUncheckedIndexedAccess`: array/object index returns `T | undefined`. Always narrow before use.
- `no-floating-promises`: must `await` or `void` every Promise.
- Prefer `satisfies` over `as` for type-safe assertions that preserve the narrowed type.
- Use `using` for disposable resources (TS 5.2+).

## Native TypeScript 7

This project type-checks with `tsc` from the stable TypeScript 7 package. The
compiler and language service use the native Go implementation.

TypeScript 7 retains TypeScript 6 type-checking and command-line compatibility,
while removing options and constructs that TypeScript 6 deprecated. Keep the
configuration free of deprecated compiler options.

Things to know when writing code:

- **No decorator emit.** `@dec class Foo {}` syntax isn't compiled. Your
  `erasableSyntaxOnly` already blocks decorators — don't introduce them.
- **No `@enum` / `@constructor` JSDoc.** The native JS checker drops these
  legacy tags. Use real TS types or `as const` objects instead.
- **The legacy TypeScript Compiler API isn't exposed.** Do not add tools that
  depend on the TypeScript 6 API without reviewing their TypeScript 7 support.

Run via `pnpm run check:types`.

Reference: [TypeScript 7.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/).

## Zod (v4)

- Value import: `import * as z from 'zod';` (not `import type` — schemas need runtime).
- Type extraction: `import type { infer } from 'zod';` or inline `z.infer<typeof schema>`.

## Env

All env vars validated in `src/libs/Env.ts`; never read `process.env` directly.

## Styling

Tailwind v4 utility classes. Base UI primitives (not Radix) for interactive components. Reuse shared components. Responsive. No unnecessary classes.

## React

- No `useMemo`/`useCallback` in components (React compiler handles it). Exception: providers managing external subscriptions (localStorage, matchMedia, cross-tab sync).
- Avoid `useEffect` in components. Acceptable for: Sentry error reporting, external subscriptions (matchMedia, storage events), imperative DOM APIs.
- Single `props` param with inline type; access as `props.foo` (no destructuring).
- Use `React.ReactNode`, not `ReactNode`.
- Inline short event handlers; extract only when complex.

## Pages

- Default export name ends with `Page`. Props alias (if reused) ends with `PageProps`.
- Locale pages: read the locale via `getLocale()` from `next-intl/server` (resolved from `next/root-params` in `src/libs/i18n.ts`). Keep `props.params` only when the locale drives other logic (localized URLs, metadata overrides).
- Escape glob chars in shell commands for Next.js paths.
- Dashboard pages (sit behind auth); define meta once in layout, not in each page.

## i18n (next-intl)

- Never hard-code user-visible strings. Page namespaces end with `Page`.
- Server: `getTranslations`; Client: `useTranslations`.
- Context-specific keys (`card_title`, `meta_description`). Use `t.rich(...)` for markup.
- Use sentence case for translations.
- Error messages: short, no "try again" variants.
- Typesafe routes: all routes defined in `src/libs/I18nRouting.ts` pathnames. `Link` href must match a defined key.
- Always use `Link` from `@/libs/I18nNavigation`, never `next/link` (except root `not-found.tsx`).
- Server-side: `redirect`, `getPathname` from `@/libs/I18nNavigation`.

## Data fetching

- Server components for reads (preferred). Use `'use cache'` via `src/libs/cache.ts` (`cachedJson<T>(tag, url)` / `cachedJsonShort<T>(tag, url)`).
- Partial Prefetching is enabled globally. Keep reusable route shells static or cached, place runtime data behind Suspense boundaries, and use a route-level `prefetch` export only when a segment must override the global partial policy.
- Never pass functions or closures as arguments to a `'use cache'` scope — Next.js 16 only allows serializable args (strings, numbers, plain objects, Dates/Maps/Sets/TypedArrays). Pass URLs + primitive params; the helpers in `cache.ts` show the shape.
- Server actions for mutations.
- TanStack Query (`@tanstack/react-query`) for client-side async state. Provider in `src/components/query-provider.tsx`.
- Avoid waterfalls: use `Promise.all`, Suspense, or preload patterns (see `.agents/skills/next-best-practices/data-patterns.md`).

## Accessibility

- `useAnnounce()` from `@/components/announcer` for screen reader announcements on form success/error, route changes, and dynamic content updates.
- `SkipToContent` renders before all body content; `<main id="main-content">` is the target.
- Every error boundary must have `role="alert"` or `role="status"` on status messages.

## JSDoc

- Required on all exported functions and components (enforced by oxlint: `jsdoc/require-param`, `jsdoc/require-returns`).
- Start each block with `/**` directly above the symbol.
- Short, sentence-case, present-tense description of intent.
- Order: description → `@param` → `@returns` → `@throws` (only if it can throw).

## Code readability

- When adding non-trivial helper functions, prefer a short comment directly
  above the function declaration that explains, in plain language, what the
  helper does and why it exists.
- Write these comments as if the reader is new to the codepath. Avoid vague
  shorthand like "snapshot" unless you immediately explain what data is being
  captured or derived.
- Prefer function-level comments over a lot of inline comments. Use inline
  comments only when a specific step inside the function is still non-obvious.
- Keep comments concrete and behavior-focused. Good comments usually explain
  what data is being transformed, what invariant is being checked, or what the
  helper is protecting against.
- After changing boolean logic or invalidation paths, simplify the final control
  flow before calling the work done. If code is already inside `if (foo)`, don't
  keep `|| foo` in assignments inside that block. Prefer direct values that make
  the invariant obvious.

## Performance

**CRITICAL: Avoid nested loops and O(n²) operations.**

- When iterating over collections, calculate expensive values ONCE before the
  loop, not inside it
- Never nest loops unless absolutely necessary - it's expensive and usually
  there's a better way
- If you need to check conditions on remaining elements, scan backwards once
  upfront instead of checking inside the main loop

Example of BAD code:

```typescript
for (let i = 0; i < items.length; i++) {
  // DON'T DO THIS - nested loop on every iteration
  let hasMoreItems = false;
  for (let j = i + 1; j < items.length; j++) {
    if (items[j].someCondition) {
      hasMoreItems = true;
      break;
    }
  }
}
```

Example of GOOD code:

```typescript
// Calculate once upfront
let lastMeaningfulIndex = items.length - 1;
for (let i = items.length - 1; i >= 0; i--) {
  if (items[i].someCondition) {
    lastMeaningfulIndex = i;
    break;
  }
}

// Now iterate efficiently
for (let i = 0; i <= lastMeaningfulIndex; i++) {
  const isLast = i === lastMeaningfulIndex;
  // ...
}
```

# context-mode — MANDATORY routing rules

You have context-mode MCP tools available. These rules are NOT optional — they protect your context window from flooding. A single unrouted command can dump 56 KB into context and waste the entire session.

## BLOCKED commands — do NOT attempt these

### curl / wget — BLOCKED

Any Bash command containing `curl` or `wget` is intercepted and replaced with an error message. Do NOT retry.

Instead use:

- `ctx_fetch_and_index(url, source)` to fetch and index web pages
- `ctx_execute(language: "javascript", code: "const r = await fetch(...)")` to run HTTP calls in sandbox

### Inline HTTP — BLOCKED

Any Bash command containing `fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, or `http.request(` is intercepted and replaced with an error message. Do NOT retry with Bash.

Instead use:

- `ctx_execute(language, code)` to run HTTP calls in sandbox — only stdout enters context

### WebFetch — BLOCKED

WebFetch calls are denied entirely. The URL is extracted and you are told to use `ctx_fetch_and_index` instead.

Instead use:

- `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` to query the indexed content

## REDIRECTED tools — use sandbox equivalents

### Bash (>20 lines output)

Bash is ONLY for: `git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`, and other short-output commands.

For everything else, use:

- `ctx_batch_execute(commands, queries)` — run multiple commands + search in ONE call
- `ctx_execute(language: "shell", code: "...")` — run in sandbox, only stdout enters context

### Read (for analysis)

If you are reading a file to **Edit** it → Read is correct (Edit needs content in context).
If you are reading to **analyze, explore, or summarize** → use `ctx_execute_file(path, language, code)` instead. Only your printed summary enters context. The raw file content stays in the sandbox.

### Grep (large results)

Grep results can flood context. Use `ctx_execute(language: "shell", code: "grep ...")` to run searches in sandbox. Only your printed summary enters context.

## Tool selection hierarchy

1. **GATHER**: `ctx_batch_execute(commands, queries)` — Primary tool. Runs all commands, auto-indexes output, returns search results. ONE call replaces 30+ individual calls.
2. **FOLLOW-UP**: `ctx_search(queries: ["q1", "q2", ...])` — Query indexed content. Pass ALL questions as array in ONE call.
3. **PROCESSING**: `ctx_execute(language, code)` | `ctx_execute_file(path, language, code)` — Sandbox execution. Only stdout enters context.
4. **WEB**: `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` — Fetch, chunk, index, query. Raw HTML never enters context.
5. **INDEX**: `ctx_index(content, source)` — Store content in FTS5 knowledge base for later search.

## Subagent routing

When spawning subagents (Agent/Task tool), the routing block is automatically injected into their prompt. Bash-type subagents are upgraded to general-purpose so they have access to MCP tools. You do NOT need to manually instruct subagents about context-mode.

## Output constraints

- Keep responses under 500 words.

- Write artifacts (code, configs, PRDs) to FILES — never return them as inline text. Return only: file path + 1-line description.
- When indexing content, use descriptive source labels so others can `ctx_search(source: "label")` later.

## ctx commands

| Command       | Action                                                                                |
| ------------- | ------------------------------------------------------------------------------------- |
| `ctx stats`   | Call the `ctx_stats` MCP tool and display the full output verbatim                    |
| `ctx doctor`  | Call the `ctx_doctor` MCP tool, run the returned shell command, display as checklist  |
| `ctx upgrade` | Call the `ctx_upgrade` MCP tool, run the returned shell command, display as checklist |
