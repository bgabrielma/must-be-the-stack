#!/usr/bin/env bash
# Provisions a freshly created git worktree (see CONTRIBUTING.md's "Parallel
# agent work" and ADR-0011): installs each app's dependencies when missing,
# and copies gitignored per-machine files (config/master.key, .env*) from the
# main worktree. Runs as Lefthook's post-checkout hook; no-op on an existing,
# already-provisioned worktree.
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
main_worktree="$(git worktree list --porcelain | awk '/^worktree/{print $2; exit}')"

cd "$repo_root"

if [ "$repo_root" = "$main_worktree" ]; then
  exit 0
fi

if [ ! -d apps/api/vendor/bundle ]; then
  echo "setup-worktree: installing apps/api gems into vendor/bundle"
  (cd apps/api && bundle config set --local path vendor/bundle && bundle install)
fi

if [ ! -d apps/web/node_modules ]; then
  echo "setup-worktree: installing apps/web packages"
  (cd apps/web && pnpm install)
fi

# Glob against the main worktree (source of truth for what to copy), not this
# worktree (where these files are, by definition, missing).
shopt -s nullglob
for src in "$main_worktree"/apps/api/config/master.key "$main_worktree"/apps/api/.env* "$main_worktree"/apps/web/.env*; do
  f="${src#"$main_worktree"/}"
  if [ ! -f "$f" ]; then
    echo "setup-worktree: copying $f from main worktree"
    mkdir -p "$(dirname "$f")"
    cp "$src" "$f"
  fi
done
