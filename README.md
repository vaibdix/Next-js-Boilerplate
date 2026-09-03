# nextjs-latest-starter

A Next.js starter I keep current with the versions I actually want to build on: Next 16 with
the App Router and Cache Components, React 19, TypeScript 7, Tailwind 4. Auth, i18n, error
reporting and bot protection are wired up but every one of them stays inert until you supply
a key, so a fresh clone boots with nothing configured.

## Stack

| | |
| --- | --- |
| Framework | Next.js 16.3, App Router, Turbopack |
| Language | TypeScript 7.0 (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) |
| UI | React 19.2, Tailwind CSS 4.3, shadcn/ui (Base UI primitives) |
| Auth | Clerk 7 |
| i18n | next-intl 4 with typed routing |
| Validation | Zod, React Hook Form |
| Lint / format | oxlint 1.76, oxfmt, stylelint |
| Tests | Vitest 4, Playwright 1.62 |
| Errors / logs | Sentry 10 + Spotlight, LogTape |
| Security | Arcjet (shield + bot detection) |

## Requirements

Node 24.15.0 and pnpm 11.4.0, both pinned in `package.json`. pnpm is not optional — the
lockfile and the settings in `pnpm-workspace.yaml` assume it.

## Getting started

```shell
pnpm install
cp .env.example .env.local
pnpm dev
```

The app runs at <http://localhost:3000>. Without Clerk keys the marketing routes work and
`/dashboard` redirects to `/sign-in`, which is enough to develop against.

### Environment

Everything lives in `.env.local`, which is gitignored. `.env.example` lists the full set:

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Sign-in, sign-up, `/dashboard` |
| `FORMSUBMIT_EMAIL` | Contact form delivery |
| `ARCJET_KEY` | Shield WAF and bot detection |
| `NEXT_PUBLIC_SENTRY_DSN` | Error reporting |
| `NEXT_PUBLIC_SENTRY_DISABLED` | Set to `1` to turn Sentry off entirely |
| `NEXT_PUBLIC_LOGGING_LEVEL` | LogTape verbosity |

Anything unset is skipped rather than defaulted. Arcjet, for instance, is only constructed
when `ARCJET_KEY` is present — there is no silent fallback that pretends protection is on.

## Scripts

```shell
pnpm dev            # dev server
pnpm dev:debug      # dev server + Sentry Spotlight on :8969
pnpm build          # production build
pnpm start          # serve the production build
pnpm test           # Vitest unit tests
pnpm test:e2e       # Playwright route tests
pnpm lint           # oxlint + oxfmt --check
pnpm lint:fix       # oxlint --fix + oxfmt --write
pnpm check:types    # tsc --noEmit
pnpm check:deps     # knip: unused files, exports, dependencies
pnpm check:i18n     # missing or unused translation keys
pnpm build-stats    # bundle analyzer
```

Spotlight is opt-in through `dev:debug`. It used to run on every `pnpm dev` and cost enough
in render time to be worth a separate command.

## Layout

```text
src/
├── app/[locale]/
│   ├── (marketing)/          # /, /about, /contact
│   └── (auth)/               # /sign-in, /sign-up, /dashboard
├── components/               # shared components
├── hooks/
├── lib/utils.ts              # shadcn's cn()
├── libs/                     # third-party setup: arcjet, env, logger, i18n, analytics
├── locales/                  # en.json, fr.json
├── utils/                    # one utility per file
├── validations/              # Zod schemas
└── proxy.ts                  # middleware: locale routing + Clerk gating
tests/e2e/                    # Playwright specs
```

Unit tests sit next to what they test (`src/utils/split-locale.test.ts`); end-to-end tests
live in `tests/e2e/`.

## Routing and i18n

Locales are `en` and `fr`, declared in `src/utils/app-config.ts`. The prefix mode is
`as-needed`, so English is unprefixed (`/about`) and French is not (`/fr/about`). Routes are
typed in `src/libs/i18n-routing.ts` — adding a page means adding it there too, or typed
navigation will not resolve it.

`pnpm check:i18n` compares `src/locales/en.json` against usage in `src/`. Its ignore list in
`package.json` is long, mostly for metadata keys the checker cannot trace.

## Auth

Clerk middleware runs only on `/dashboard/*`, `/sign-in` and `/sign-up`, matched in
`src/proxy.ts` via `src/utils/is-protected-path.ts`. Running it on every route is what the
upstream template does; it also means a bad publishable key breaks the marketing pages, which
took an afternoon to track down once.

## Tests

Vitest covers the pure logic worth pinning: locale splitting, path matching, base URL
resolution, contact-form validation. Playwright walks all seven routes in both locales and
asserts none of them 5xx, that `/dashboard` redirects when Clerk is unconfigured, and that no
console errors fire.

Playwright runs single-worker locally against `next dev`, and parallel against `next start`
in CI. Parallel workers against a cold dev server were flaky enough to be useless.

## CI

There is a `.github/workflows/ci.yml`, and it is **deliberately gitignored and never pushed**.
It exists so the whole gate can run in one command locally through
[nektos/act](https://github.com/nektos/act):

```shell
act push --container-architecture linux/amd64
```

Nothing runs on GitHub. The real enforcement is Lefthook: pre-commit runs oxlint, oxfmt,
stylelint, knip and secretlint; pre-push runs `check:types`, the unit tests and
`pnpm audit`. A fresh clone gets no gate until `pnpm install` sets the hooks up.

## Containers and Nix

`.devcontainer/` works with VS Code Dev Containers or Codespaces and provisions Node, pnpm and
the git hooks on create. `compose.dev.yaml` runs the same thing without VS Code:

```shell
docker compose -f compose.dev.yaml up --build
```

Source is bind-mounted so HMR works; `node_modules`, `.next` and the pnpm store are named
volumes. On macOS this is noticeably slower than running natively because of VirtioFS — use
it for parity checks, not daily work.

`flake.nix` provides the same toolchain under `nix develop`, and `echo "use flake" > .envrc`
with direnv makes it automatic.

## Conventions

Commits follow [Conventional Commits](https://www.conventionalcommits.org/); `pnpm run commit`
opens the commitlint prompt and commitlint enforces the format on the way in.

Code style is enforced rather than documented — arrow functions over declarations,
`interface` over `type` for object shapes, kebab-case filenames, no comments in `src/`. The
rules and the reasoning are in `CLAUDE.md`, and `oxlint.config.ts` is the tiebreak whenever
that file and `AGENTS.md` disagree.

## Rough edges

- `src/app/[locale]/(marketing)/layout.tsx` awaits `params` outside a Suspense boundary, so
  Next flags an instant-navigation insight on the marketing routes. The cheap fixes all break
  the production build; the real one means restructuring the header and footer so they do not
  need request-scoped locale. The Playwright suite filters this one insight by name.
- `en.json` still carries `BaseTemplate.*` and `Navigation.*` namespaces for components that
  no longer exist.
