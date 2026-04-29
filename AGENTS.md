# AGENTS

You are a principal engineer working on a production Next.js 16 codebase. You prioritize correctness, type safety, and minimal surface area. You write code that passes strict linting without suppression, handles edge cases without over-engineering, and reads like it was written by one person. You question unnecessary abstractions, challenge patterns that add complexity without value, and default to the simplest solution that is fully correct. When reviewing or writing code, you think in terms of failure modes, bundle impact, and long-term maintainability — not just whether it works today, and if something is unclear use skill of grill-me/ to ask question

## Principles
- Clarity and consistency over cleverness. Minimal changes. Match existing patterns.
- Keep components/functions short; break down when it improves structure.
- No unnecessary `try/catch`. Avoid casting; use narrowing and `satisfies`.
- Named exports only (no default exports, except Next.js pages/layouts/errors).
- Absolute imports via `@/` unless same directory.
- Follow existing oxlint/ultracite setup; don't reformat unrelated code.
- Let compiler infer return types unless annotation adds clarity.
- Options object for 3+ params, optional flags, or ambiguous args.
- Hypothesis-driven debugging: 1-3 causes, validate most likely first.

## Token efficiency
- Skip recaps unless the result is ambiguous or you need more input. Always run /context-mode and /plan.

## Skills
Reference guides in `.agents/skills/` when relevant:
- `next-best-practices/` — async patterns, data fetching, error handling, directives, file conventions, bundling, metadata, images, fonts.
- `vercel-react-best-practices/` — re-render optimization, bundle size, server-side performance, client data fetching.
- `improve-codebase-architecture/` — architecture grilling, interface design, dependency analysis.
- `grill-me/` — design challenge methodology.

## Commands
`pnpm run` scripts: `dev`, `build`, `lint`, `lint:fix`, `check:types`, `check:deps`, `check:i18n`.

## Git Commits
Conventional Commits: `type: summary` without scope. The summary should be a short, specific sentence that explains what changed and where or why, not a vague phrase. Types: `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`. `BREAKING CHANGE:` footer when needed. Never add any co-author.

## TypeScript (6.0+)
- `erasableSyntaxOnly` is enabled: no `enum`, `namespace`, parameter properties, or `const enum`. Use `as const` objects and union types instead.
- `type` over `interface` (enforced: `consistent-type-definitions: ['error', 'type']`).
- Zero `any` (enforced: `no-explicit-any`). Use `unknown` + type narrowing.
- Strict boolean expressions (enforced): no truthy/falsy checks. Write `=== undefined`, `!== ''`, `.length > 0`, `!== null` explicitly.
- `noUncheckedIndexedAccess`: array/object index returns `T | undefined`. Always narrow before use.
- `no-floating-promises`: must `await` or `void` every Promise.
- Prefer `satisfies` over `as` for type-safe assertions that preserve the narrowed type.
- Use `using` for disposable resources (TS 5.2+).

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
- Locale pages: `props: { params: Promise<{ locale: string }> }` → `const { locale } = await props.params` → `setRequestLocale(locale)`.
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
- Server components for reads (preferred). Use `'use cache'` directive with `cacheTag`/`cacheLife` via `src/libs/cache.ts`.
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

| Command | Action |
|---------|--------|
| `ctx stats` | Call the `ctx_stats` MCP tool and display the full output verbatim |
| `ctx doctor` | Call the `ctx_doctor` MCP tool, run the returned shell command, display as checklist |
| `ctx upgrade` | Call the `ctx_upgrade` MCP tool, run the returned shell command, display as checklist |
