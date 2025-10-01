#!/usr/bin/env bash
set -eu

PREV="${VERCEL_GIT_PREVIOUS_SHA:-}"
CURR="${VERCEL_GIT_COMMIT_SHA:-}"
MSG="${VERCEL_GIT_COMMIT_MESSAGE:-}"
AUTHOR="${VERCEL_GIT_COMMIT_AUTHOR_LOGIN:-}"
BRANCH="${VERCEL_GIT_COMMIT_REF:-}"
ENVV="${VERCEL_ENV:-}"


if [ "$ENVV" = "production" ] || [ "$BRANCH" = "main" ]; then
  exit 1
fi

if [ "$AUTHOR" = "dependabot[bot]" ] || [ "$AUTHOR" = "github-actions[bot]" ]; then
  exit 0
fi

if [ -n "$PREV" ] && [ -n "$CURR" ]; then
  CHANGED="$(git diff --name-only "$PREV" "$CURR" || true)"
  if echo "$CHANGED" | grep -qE '^(content/|public/media/)'; then
    exit 1
  fi
fi

exit 0
