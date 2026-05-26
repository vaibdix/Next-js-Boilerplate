#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Setting up devcontainer..."

workspace_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$workspace_root"

if [[ ! -f pnpm-workspace.yaml ]]; then
  echo "❌ Missing pnpm-workspace.yaml in $workspace_root"
  exit 1
fi

# Strip any placeholder allowBuilds entries that say "set this to true or false"
# (these can appear when pnpm auto-adds new build-script deps for review)
if grep -n "set this to true or false" pnpm-workspace.yaml >/dev/null; then
  sanitized_workspace_file="$(mktemp)"
  awk '
    BEGIN { skipping = 0 }
    /^allowBuilds:$/ { skipping = 1; print; next }
    skipping && /^  .*: set this to true or false$/ { next }
    skipping && /^[^ ]/ { skipping = 0 }
    { print }
  ' pnpm-workspace.yaml > "$sanitized_workspace_file"
  mv "$sanitized_workspace_file" pnpm-workspace.yaml
fi

if grep -n "set this to true or false" pnpm-workspace.yaml >/dev/null; then
  echo "❌ Invalid pnpm-workspace.yaml: placeholder allowBuilds entries detected"
  exit 1
fi

# Install image processing system deps for HEIC/HEIF support
# (sharp's prebuilt binaries don't include HEIC; this gives us heif-convert + ffmpeg as fallbacks)
if ! command -v ffmpeg &> /dev/null; then
  echo "📦 Installing ffmpeg and libheif..."
  sudo apt-get update -qq
  sudo apt-get install -y -qq ffmpeg libheif-examples
fi

# Ensure user-local bin exists and is on PATH
mkdir -p "$HOME/.local/bin"
export PATH="$HOME/.local/bin:$PNPM_HOME:$PATH"

# Enable corepack for the current user (no sudo needed)
corepack enable --install-directory "$HOME/.local/bin"

# Install the exact pnpm version pinned in package.json's packageManager field.
# With COREPACK_ENABLE_STRICT=1, corepack refuses to run any other version.
corepack install

# --- Verify pnpm-workspace.yaml is being read by pnpm ---

# Workspace packages check — confirms pnpm sees the workspace root entry
echo "🔍 Verifying pnpm-workspace.yaml is loaded..."
if ! grep -E '^\s*-\s+["'"'"']?\.["'"'"']?\s*$' pnpm-workspace.yaml >/dev/null; then
  echo "❌ pnpm-workspace.yaml is missing 'packages: [.]' entry"
  exit 1
fi

# allowBuilds check (v11 replacement for onlyBuiltDependencies)
# In v11, `pnpm config get allowBuilds` returns a JSON object
approved_builds="$(pnpm config get allowBuilds 2>/dev/null || echo '')"
if [[ "$approved_builds" != *'"sharp"'* ]] && [[ "$approved_builds" != *'sharp'* ]]; then
  echo "❌ pnpm-workspace.yaml is active, but allowBuilds.sharp was not loaded"
  echo "   pnpm config get allowBuilds returned: $approved_builds"
  exit 1
fi

# Sanity-check the rest of the supply-chain hardening
echo "🔒 Supply chain settings:"
echo "   minimumReleaseAge:   $(pnpm config get minimumReleaseAge 2>/dev/null || echo 'unset')"
echo "   blockExoticSubdeps:  $(pnpm config get blockExoticSubdeps 2>/dev/null || echo 'unset')"
echo "   strictDepBuilds:     $(pnpm config get strictDepBuilds 2>/dev/null || echo 'unset')"

# Raise file descriptor limits so large installs / next dev don't choke
open_files_limit="$(ulimit -n)"
if [[ "$open_files_limit" != "unlimited" ]] && (( open_files_limit < 65536 )); then
  ulimit -n 65536 || ulimit -n 16384 || true
fi

# Frozen lockfile install:
#   --frozen-lockfile  → fail if pnpm-lock.yaml would change (blocks injected deps)
#   --prefer-offline   → hit the local store first, reduce registry exposure
pnpm install \
  --frozen-lockfile \
  --prefer-offline \
  --child-concurrency=8 \
  --network-concurrency=16

# Note: git hooks (lefthook install) run in postCreateCommand after this script,
# so they refresh on every content update without being tied to install caching.

echo "✅ Devcontainer content ready"