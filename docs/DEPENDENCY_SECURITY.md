# Dependency & Supply-Chain Security

This boilerplate ships with layered defenses against compromised packages, vulnerable transitive deps, and accidentally committed secrets. This doc explains **what each layer does, how to operate it, and what to do when it blocks you**.

> Read it once on day 1. Bookmark for: failed `git push`, `pnpm audit` findings, adding a new dep, and the quarterly override review.

---

## Quick reference — commands you'll actually run

| Task | Command |
|---|---|
| Check current vulnerabilities | `pnpm audit --prod` |
| Same, but ignore moderate/low | `pnpm audit --prod --audit-level=high` |
| Update a direct dep to its latest patched version | `pnpm update <pkg> --latest` |
| Force re-resolve after editing `pnpm-workspace.yaml` overrides | `rm pnpm-lock.yaml && pnpm install` |
| Regenerate lockfile only (no `node_modules` writes) | `pnpm install --lockfile-only` |
| Inspect why a transitive is in the tree | `pnpm why <pkg>` |
| Scan staged files for secrets manually | `pnpm exec secretlint --maskSecrets <files…>` |
| Run the full lint + types pipeline | `pnpm run lint && pnpm run check:types` |

---

## The five hardening layers

All five live in `pnpm-workspace.yaml`. Don't disable any without understanding what you're trading away.

### Layer 1 — `minimumReleaseAge: 10080`

7-day quarantine on every package version. If a malicious release lands in npm (typosquat, maintainer account takeover, build-script abuse), pnpm refuses to install it for a week — giving the community time to flag and yank.

**Effect on you:** if you `pnpm add some-pkg@latest` and the latest version is <7 days old, install fails with `ERR_PNPM_MIN_RELEASE_AGE`. Fix: pick an older version, or wait. Override globally only if absolutely required — never per-PR.

### Layer 2 — `blockExoticSubdeps: true`

Refuses transitive deps from non-registry sources (git URLs, local paths, tarballs). Prevents a compromised dep from sneaking in a malicious git fork as a subdep.

**Effect on you:** if you (or a maintainer somewhere up the tree) tries to pin a dep to `github:foo/bar`, install fails. Use a published version from npm instead.

### Layer 3 — `strictPeerDependencies: true`

Install fails when a dep's `peerDependencies` range isn't satisfied by what's installed. Defends against running a dep with an incompatible React/Next/etc. version, which can produce subtle runtime breaks that mask security issues.

**Effect on you:** when bumping major versions of React/Next/Clerk, you may see peer conflicts. Resolve by updating the depending packages first, in topological order.

### Layer 4 — `strictDepBuilds` + `allowBuilds` whitelist

By default pnpm v11 refuses to run `postinstall`/`install`/`preinstall` scripts on any dep. Only the packages explicitly listed in `allowBuilds:` are allowed to execute. This neutralizes the most common supply-chain attack vector — malicious install scripts.

Current allowlist:
```yaml
allowBuilds:
  '@clerk/shared': true
  '@parcel/watcher': true
  '@sentry/cli': true
  '@swc/core': true
  lefthook: true
  msw: true
  sharp: true
```

**Effect on you:** if you add a new dep that needs to run an install script (rare — usually native code: `node-sass`, `bcrypt`, `puppeteer`, etc.), `pnpm install` will warn that the build was skipped. Review the script, then add the package to `allowBuilds:` if legitimate.

### Layer 5 — `verifyDepsBeforeRun: error`

Before running any `pnpm run <script>`, pnpm verifies `node_modules` matches `pnpm-lock.yaml`. If someone edits the lockfile or `pnpm-workspace.yaml` without reinstalling, scripts refuse to run.

**Effect on you:** if you pull a branch with lockfile changes and try to run `pnpm dev`, you get an error pointing at the drift. Fix: `pnpm install`.

---

## `pnpm.overrides` — what they do, when to use them

When a *direct* dep (something in your `package.json`) pulls in an old version of a *transitive* dep (something in `node_modules/.../some-pkg`), and the transitive has a CVE, the parent often lags. `pnpm.overrides` lets you force-patch the transitive without waiting.

Current overrides (in `pnpm-workspace.yaml`):

```yaml
overrides:
  fast-uri: '>=3.1.1'         # GHSA-q3j6-qgpj-74h6 — path traversal (Sentry chain)
  js-cookie: '>=3.0.6'        # GHSA-qjx8-664m-686j — prototype pollution (Clerk chain)
  postcss: '>=8.5.10'         # GHSA-qx2v-qp2m-jg93 — XSS via </style> (Next chains)
  brace-expansion: '>=5.0.6'  # GHSA-v6h7-ph6w-fjg7 — ReDoS (Sentry chain)
  uuid: '>=11.1.1'            # CVE in pre-11.1.1 (Arcjet typeid-js chain)
```

**Key property:** overrides don't bypass hardening. `minimumReleaseAge`, `blockExoticSubdeps`, `strictPeerDependencies` still apply to the version selected by an override. A too-new override target will be rejected.

### Adding an override

```bash
# 1. Confirm the GHSA + patched range
pnpm audit --prod

# 2. Find who pulls in the bad transitive
pnpm why <pkg>

# 3. Edit pnpm-workspace.yaml — add to the `overrides:` block:
#    <pkg>: '>=<patched-version>'  # GHSA-id — one-line reason

# 4. Force re-resolution (overrides aren't applied retroactively
#    from an existing lockfile)
rm pnpm-lock.yaml && pnpm install

# 5. Verify
pnpm audit --prod --audit-level=high
```

### Removing an override (quarterly review)

Every quarter — or when bumping major Clerk/Sentry/Arcjet/Next versions — try to retire overrides. They are **invisible tech debt** if left in place after the upstream fix lands.

```bash
# 1. Comment out one override entry in pnpm-workspace.yaml
# 2. Regenerate the lockfile
rm pnpm-lock.yaml && pnpm install
# 3. Re-audit
pnpm audit --prod --audit-level=high
# 4. If clean → delete the entry permanently. If not → restore.
```

### When NOT to add an override

- Dev-only deps (the audit gate is `--prod`).
- Vulnerabilities only exploitable in a code path your app never enters (e.g., a CLI-only flag of a build tool).
- When the fix would break peer constraints (force a major version bump on a stable dep) — fix the parent instead.

---

## The lefthook gates

Two hooks wrap your workflow. Both run automatically; understanding them helps when they block.

### Pre-commit — `secretlint`

```yaml
# lefthook.yml
pre-commit:
  jobs:
    - name: secretlint
      run: pnpm exec secretlint --maskSecrets {staged_files}
      glob: '*'
```

Scans every staged file against the `@secretlint/secretlint-rule-preset-recommend` ruleset — AWS keys, GitHub tokens, Stripe live keys, Slack webhooks, SSH private keys, JWT, basic-auth strings, npm tokens, etc.

**Config:** `.secretlintrc.json`. Add per-rule options or exclude rules there.

#### When secretlint blocks your commit

1. **Read the masked output** — secretlint redacts the actual secret value in its report, but tells you the file/line and which rule fired.
2. **If it's a real leak:**
   - Remove the value from the file.
   - **Rotate the secret immediately** — assume it's compromised, even if the commit never lands. Anyone with shell access could have seen it.
   - Commit the fix.
3. **If it's a false positive:**
   - Confirm the matched string isn't actually sensitive (e.g., a test fixture, a documented example).
   - Add an inline ignore: append `# secretlint-disable` to the line (or use the file-level option in `.secretlintrc.json`).
   - Re-commit.

Never `git commit --no-verify` to bypass — that's how `.env` values end up in history.

### Pre-push — `pnpm audit`

```yaml
# lefthook.yml
pre-push:
  jobs:
    - name: pnpm-audit
      run: pnpm audit --prod --audit-level=high
```

Runs on every `git push`. Fails the push if any production dep has a `high` or `critical` CVE.

#### When the audit blocks your push

Decision tree:

```
pnpm audit --prod
  │
  ├── high/critical reported?
  │     │
  │     ├── YES → who depends on the vulnerable package?
  │     │         │
  │     │         ├── DIRECT dep (in your package.json)
  │     │         │     → pnpm update <pkg> --latest
  │     │         │     → if no patched version available, file upstream issue
  │     │         │       AND temporarily relax to `--audit-level=critical`
  │     │         │
  │     │         └── TRANSITIVE (via pnpm why <pkg>)
  │     │               → add to pnpm-workspace.yaml overrides
  │     │               → rm pnpm-lock.yaml && pnpm install
  │     │               → pnpm audit --prod --audit-level=high  (verify clean)
  │     │
  │     └── NO → push proceeds
  │
  └── moderate/low only?
        → audit-level=high ignores them; push proceeds
        → run `pnpm audit --prod` (no flag) monthly to triage these
```

**Last-resort bypass:** `git push --no-verify`. Only do this when you've confirmed the CVE is unreachable in your code path AND you've filed a tracking ticket. Never as a habit.

---

## What's NOT in this setup

Honest gaps you should plug for a production-grade posture:

### 1. Automated dependency PRs (Dependabot / Renovate)

The pre-push gate is **reactive** — it only tells you when something's wrong. It doesn't proactively raise PRs when:
- A patched version of a dep becomes available.
- A new CVE is published against a dep you have.
- An override becomes unnecessary because the upstream caught up.

**Fix:** add a `renovate.json` to the repo root:
```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "vulnerabilityAlerts": { "enabled": true },
  "lockFileMaintenance": { "enabled": true, "schedule": ["before 5am on monday"] }
}
```
Then install the Renovate GitHub App on the repo. Or use `.github/dependabot.yml` if you prefer.

### 2. Container CVE scanning

If you eventually build a custom Docker image (not just consuming `mcr.microsoft.com/devcontainers/...` directly), add Trivy or Grype to CI to scan the image layers. Not relevant while you're using the prebuilt typescript-node image.

### 3. SBOM generation

For supply-chain attestation (SLSA, customer asks), generate a CycloneDX SBOM:
```bash
pnpm dlx @cyclonedx/cyclonedx-npm --output-file sbom.json
```
Wire this into CI and attach to GitHub releases.

### 4. Base image digest pinning

`devcontainer.json` pins the base image by tag (`:24-bookworm`), not digest. Tags move; digests don't. Refresh quarterly:
```bash
docker pull mcr.microsoft.com/devcontainers/typescript-node:24-bookworm
docker inspect --format='{{index .RepoDigests 0}}' \
  mcr.microsoft.com/devcontainers/typescript-node:24-bookworm
# Paste the resulting sha256:... into devcontainer.json `image` field
```

### 5. Dev-dep audit

The pre-push gate is `--prod` only. Dev deps (test runners, linters) execute on developer machines and in CI runners — they're a real surface. Run monthly:
```bash
pnpm audit --audit-level=high
```

---

## Quarterly maintenance checklist

Copy into a recurring calendar event (every 3 months):

```
[ ] Run `pnpm audit --prod` (without --audit-level) — triage moderate/low
[ ] Run `pnpm audit` (no --prod) — review dev dep CVEs
[ ] For each entry in pnpm-workspace.yaml overrides:
    - Comment it out
    - `rm pnpm-lock.yaml && pnpm install`
    - `pnpm audit --prod --audit-level=high`
    - If clean → delete entry permanently
    - If not → restore entry
[ ] Refresh devcontainer base image digest (see §4 above)
[ ] Review `allowBuilds:` in pnpm-workspace.yaml — remove any package
    no longer in the tree
[ ] If on Renovate: review the past quarter's auto-merged PRs for
    anything that needs follow-up
```

---

## Mapping to OWASP

For the security folks asking which controls this satisfies:

| OWASP Top 10 (2021) risk | Control in this repo |
|---|---|
| A05 — Security Misconfiguration | `strictDepBuilds`, `allowBuilds` whitelist, devcontainer `containerEnv` telemetry-off, security headers in `next.config.ts` |
| A06 — Vulnerable & Outdated Components | `pnpm audit` pre-push, `minimumReleaseAge`, lockfile `--frozen-lockfile`, override mechanism |
| A08 — Software & Data Integrity Failures | `pnpm-lock.yaml` integrity hashes, `blockExoticSubdeps`, devcontainer-lock.json for features, base image trusted registry |

For CI/CD-specific framing (OWASP Top 10 CI/CD), this addresses primarily **CICD-SEC-3 Dependency Chain Abuse** and **CICD-SEC-6 Insufficient Credential Hygiene** (the latter via `secretlint` pre-commit + declarative devcontainer `secrets`).

---

## Container build

The `Dockerfile` at repo root applies the same `pnpm-workspace.yaml` hardening
(`minimumReleaseAge`, `blockExoticSubdeps`, `strictPeerDependencies`,
`allowBuilds`, `overrides`) automatically during `pnpm install` — those
settings live in `pnpm-workspace.yaml` which is COPYd into the image and read
by pnpm at install time. No flags required.

### Build & run

BuildKit is required (cache mounts + secret mounts):

```bash
DOCKER_BUILDKIT=1 docker build \
  --build-arg NEXT_PUBLIC_APP_URL=https://yourdomain.com \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... \
  --build-arg NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/... \
  --build-arg SENTRY_ORGANIZATION=your-org \
  --build-arg SENTRY_PROJECT=nextjs-webalar-starter \
  --secret id=sentry_auth_token,env=SENTRY_AUTH_TOKEN \
  -t nextjs-webalar-starter .

docker run --rm -p 3000:3000 \
  -e CLERK_SECRET_KEY=sk_live_... \
  -e FORMSUBMIT_EMAIL=you@brand.com \
  -e ARCJET_KEY=ajkey_... \
  nextjs-webalar-starter
```

### Build-arg / secret / runtime matrix

| Variable | Build ARG | Build secret | Runtime env |
|---|:-:|:-:|:-:|
| `NEXT_PUBLIC_APP_URL` | ✅ inline | | ✅ server fallback |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ inline | | |
| `NEXT_PUBLIC_SENTRY_DSN` | ✅ inline | | |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ✅ inline | | |
| `NEXT_PUBLIC_LOGGING_LEVEL` | ✅ inline | | |
| `NEXT_PUBLIC_BETTER_STACK_*` | ✅ inline | | |
| `SENTRY_ORGANIZATION` | ✅ | | |
| `SENTRY_PROJECT` | ✅ | | |
| `SENTRY_AUTH_TOKEN` | | ✅ secret mount | |
| `CLERK_SECRET_KEY` | ✅ dummy for build | | ✅ real value |
| `FORMSUBMIT_EMAIL` | ✅ dummy for build | | ✅ real value |
| `ARCJET_KEY` | | | ✅ optional |

**Why dummies for `CLERK_SECRET_KEY` / `FORMSUBMIT_EMAIL` at build time?** T3-env (`src/libs/Env.ts`) validates every server-side env var at module load. `next.config.ts` imports `Env.ts` for its side effects, so validation runs during `next build` even though the secrets aren't actually used until runtime.

**Why `SENTRY_AUTH_TOKEN` as a secret mount (not ARG)?** Build args are recorded in image history. Anyone with `docker history <image>` access can read them. Secret mounts (`--mount=type=secret`) make the value available only to the specific `RUN` command — never written to any layer.

### Pin base image by digest (production)

The Dockerfile ships with a tag-only `FROM node:24-bookworm-slim`. Tags move; digests don't. For reproducible production builds, fetch the current digest and pin:

```bash
docker pull node:24-bookworm-slim
docker inspect --format='{{index .RepoDigests 0}}' node:24-bookworm-slim
```

Paste the resulting `node:24-bookworm-slim@sha256:...` into both `FROM` lines (`base` stage and `runner` stage — they must match). Refresh on the same cadence as the quarterly override review.

## References

- pnpm overrides: <https://pnpm.io/settings#overrides>
- pnpm supply-chain hardening: <https://pnpm.io/settings#minimumreleaseage>
- secretlint rules: <https://github.com/secretlint/secretlint#rules>
- OWASP Top 10 2021: <https://owasp.org/Top10/>
- OWASP Top 10 CI/CD: <https://owasp.org/www-project-top-10-ci-cd-security-risks/>
- GHSA database: <https://github.com/advisories>
