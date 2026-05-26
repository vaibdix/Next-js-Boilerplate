# syntax=docker/dockerfile:1.7
# =============================================================================
# Production Dockerfile for nextjs-webalar-starter
# -----------------------------------------------------------------------------
# Multi-stage:
#   base    - Node 24 + corepack-pinned pnpm + hardening env
#   deps    - pnpm install with frozen lockfile (workspace settings apply)
#   builder - next build with NEXT_PUBLIC_* build args + Sentry secret
#   runner  - minimal runtime, runs .next/standalone/server.js as `node` user
#
# Build:
#   DOCKER_BUILDKIT=1 docker build \
#     --build-arg NEXT_PUBLIC_APP_URL=https://yourdomain.com \
#     --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... \
#     --secret id=sentry_auth_token,env=SENTRY_AUTH_TOKEN \
#     -t nextjs-webalar-starter .
#
# Run:
#   docker run --rm -p 3000:3000 \
#     -e CLERK_SECRET_KEY=sk_live_... \
#     -e FORMSUBMIT_EMAIL=you@brand.com \
#     -e ARCJET_KEY=ajkey_... \
#     nextjs-webalar-starter
#
# See docs/DEPENDENCY_SECURITY.md → "Container build" for the full build-arg
# matrix and instructions to pin the base image by SHA256 digest.
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1 — base: shared toolchain for deps + builder
# -----------------------------------------------------------------------------
FROM node:24-bookworm-slim AS base

# pnpm via corepack — exact version from package.json "packageManager".
# COREPACK_ENABLE_STRICT=1 refuses any other pnpm version.
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_STRICT=1 \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# Telemetry / fund prompts off (matches devcontainer hygiene)
ENV NEXT_TELEMETRY_DISABLED=1 \
    DO_NOT_TRACK=1 \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false

# Silence lefthook's postinstall in a non-git container without removing
# its allowBuilds entry from pnpm-workspace.yaml.
ENV LEFTHOOK=0

# corepack is shipped with node:24. `corepack enable` just installs the
# pnpm/npm/yarn shims into PATH. The exact pnpm version pinned in
# package.json's "packageManager" field is downloaded by corepack on the
# first `pnpm` invocation (in the deps / builder stages, where package.json
# is present).
RUN corepack enable

WORKDIR /app


# -----------------------------------------------------------------------------
# Stage 2 — deps: install all deps with frozen lockfile
# -----------------------------------------------------------------------------
FROM base AS deps

# Copy only the install descriptors first so this layer is cached until they change.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# pnpm reads pnpm-workspace.yaml during install, so ALL hardening applies:
#   - minimumReleaseAge: 10080   (7-day quarantine on every package)
#   - blockExoticSubdeps: true   (no git/file/tarball subdeps)
#   - strictPeerDependencies: true
#   - allowBuilds: <whitelist>   (only those packages may run install scripts)
#   - overrides: <CVE patches>   (force-patched transitive vulns)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline


# -----------------------------------------------------------------------------
# Stage 3 — builder: run `next build`
# -----------------------------------------------------------------------------
FROM base AS builder

# NEXT_PUBLIC_* are INLINED into the client bundle at build time. They must be
# present here so the right values ship to browsers.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SENTRY_DSN=""
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID=""
ARG NEXT_PUBLIC_LOGGING_LEVEL="info"
ARG NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN=""
ARG NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST=""

# Sentry source-map upload config (consumed by withSentryConfig in next.config.ts)
ARG SENTRY_ORGANIZATION=""
ARG SENTRY_PROJECT=""

# T3-env (src/libs/Env.ts) validates env at module load, which happens during
# `next build` because next.config.ts imports it. Pass dummies; real values
# come in at runtime via container env.
ARG CLERK_SECRET_KEY="sk_build_time_dummy"
ARG FORMSUBMIT_EMAIL="build@example.com"

# Promote ARGs to ENVs so Next reads them during build.
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN \
    NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID \
    NEXT_PUBLIC_LOGGING_LEVEL=$NEXT_PUBLIC_LOGGING_LEVEL \
    NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN=$NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN \
    NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST=$NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST \
    SENTRY_ORGANIZATION=$SENTRY_ORGANIZATION \
    SENTRY_PROJECT=$SENTRY_PROJECT \
    CLERK_SECRET_KEY=$CLERK_SECRET_KEY \
    FORMSUBMIT_EMAIL=$FORMSUBMIT_EMAIL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# SENTRY_AUTH_TOKEN is a real secret — passed via BuildKit secret mount so it
# never lands in image history. Without it, source-map upload is skipped and
# the build still succeeds.
RUN --mount=type=secret,id=sentry_auth_token \
    --mount=type=cache,id=pnpm,target=/pnpm/store \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentry_auth_token 2>/dev/null || echo '')" \
    pnpm run build


# -----------------------------------------------------------------------------
# Stage 4 — runner: minimal production runtime
# -----------------------------------------------------------------------------
FROM node:24-bookworm-slim AS runner

WORKDIR /app

# HOSTNAME=0.0.0.0 is required — Next standalone defaults to 'localhost'
# which won't bind correctly inside a container.
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1 \
    DO_NOT_TRACK=1

# `node:24-bookworm-slim` already ships a `node` user (UID 1000).
# Copy standalone bundle (already includes a slimmed node_modules), static
# assets, and public files — owned by `node` so the runtime can read them.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node

EXPOSE 3000

CMD ["node", "server.js"]
