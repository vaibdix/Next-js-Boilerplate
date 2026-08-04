FROM node:24-bookworm-slim AS base

ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_STRICT=1 \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# Telemetry / fund prompts off (matches devcontainer hygiene)
ENV NEXT_TELEMETRY_DISABLED=1 \
    DO_NOT_TRACK=1 \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false

ENV LEFTHOOK=0
RUN corepack enable

WORKDIR /app


# -----------------------------------------------------------------------------
# Stage 2 — deps: install all deps with frozen lockfile
# -----------------------------------------------------------------------------
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline


# -----------------------------------------------------------------------------
# Stage 3 — builder: run `next build`
# -----------------------------------------------------------------------------
FROM base AS builder

ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SENTRY_DSN=""
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID=""
ARG NEXT_PUBLIC_LOGGING_LEVEL="info"
ARG SENTRY_ORGANIZATION=""
ARG SENTRY_PROJECT=""
ARG CLERK_SECRET_KEY="sk_build_time_dummy"
ARG FORMSUBMIT_EMAIL="build@example.com"

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN \
    NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID \
    NEXT_PUBLIC_LOGGING_LEVEL=$NEXT_PUBLIC_LOGGING_LEVEL \
    SENTRY_ORGANIZATION=$SENTRY_ORGANIZATION \
    SENTRY_PROJECT=$SENTRY_PROJECT \
    CLERK_SECRET_KEY=$CLERK_SECRET_KEY \
    FORMSUBMIT_EMAIL=$FORMSUBMIT_EMAIL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN --mount=type=secret,id=sentry_auth_token \
    --mount=type=cache,id=pnpm,target=/pnpm/store \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentry_auth_token 2>/dev/null || echo '')" \
    pnpm run build


# -----------------------------------------------------------------------------
# Stage 4 — runner: minimal production runtime
# -----------------------------------------------------------------------------
FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1 \
    DO_NOT_TRACK=1

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node

EXPOSE 3000

CMD ["node", "server.js"]
