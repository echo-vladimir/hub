#!/usr/bin/env bash
set -Eeuo pipefail

PREV="${VERCEL_GIT_PREVIOUS_SHA:-}"
CURR="${VERCEL_GIT_COMMIT_SHA:-}"
AUTHOR="${VERCEL_GIT_COMMIT_AUTHOR_LOGIN:-}"
BRANCH="${VERCEL_GIT_COMMIT_REF:-}"
ENVIRONMENT="${VERCEL_ENV:-}"

# Vercel ignoreCommand:
#   0 = skip build
#   non-zero = continue with build
#
# Policy:
#   - always build for production/main
#   - skip preview builds from automation bots
#   - build preview only for CMS/media changes

if [[ "$ENVIRONMENT" == "production" || "$BRANCH" == "main" ]]; then
  echo "run-build: production/main change -> build"
  exit 1
fi

if [[ "$AUTHOR" == "dependabot[bot]" || "$AUTHOR" == "github-actions[bot]" ]]; then
  echo "run-build: bot author -> skip"
  exit 0
fi

if [[ -z "$PREV" || -z "$CURR" ]]; then
  echo "run-build: missing commit range -> build"
  exit 1
fi

if ! CHANGED="$(git diff --name-only "$PREV" "$CURR" --)"; then
  echo "run-build: git diff failed -> build"
  exit 1
fi

if grep -qE '^(content/|public/media/)' <<<"$CHANGED"; then
  echo "run-build: CMS/media change -> build"
  exit 1
fi

if [[ -z "$CHANGED" ]]; then
  echo "run-build: empty diff -> build"
  exit 1
fi

echo "run-build: non-CMS preview change -> skip"
exit 0
