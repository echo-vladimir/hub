#!/usr/bin/env bash
set -Eeuo pipefail

# Usage:
#   bash .ci/cleanup-deploys.sh
#   bash .ci/cleanup-deploys.sh --dry-run

OWNER="echo-vladimir"
REPO="hub"
DRY_RUN=0
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=1
fi

export GH_PAGER=cat
export PAGER=cat
export GIT_PAGER=cat
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required" >&2
  exit 1
fi

if ! gh auth status -h github.com >/dev/null 2>&1; then
  echo "gh is not authenticated for github.com" >&2
  exit 1
fi

API="https://api.github.com/repos/$OWNER/$REPO/deployments?per_page=100"
ACCEPT="application/vnd.github+json"
PRINT_FILTER='.environment + " id=" + (.id|tostring) + " ref=" + .ref + " created_at=" + .created_at'

echo "cleanup-deployments: $OWNER/$REPO (keep latest 1 in Preview and 1 in Production)"

mapfile -t TARGET_IDS < <(
  gh api -H "Accept: $ACCEPT" --paginate "$API" \
    --jq '.[] | select(.environment == "Preview" or .environment == "Production") | .id'
)

if ((${#TARGET_IDS[@]} == 0)); then
  echo "cleanup-deployments: no Preview/Production deployments found"
  exit 0
fi

mapfile -t KEEP_IDS < <(
  gh api -H "Accept: $ACCEPT" --paginate "$API" \
    --jq '[.[] | select(.environment == "Preview" or .environment == "Production")] | sort_by(.environment, .created_at) | group_by(.environment) | map(last.id) | .[]'
)

echo "cleanup-deployments: keeping"
for id in "${KEEP_IDS[@]}"; do
  gh api -H "Accept: $ACCEPT" \
    "https://api.github.com/repos/$OWNER/$REPO/deployments/$id" \
    --jq "$PRINT_FILTER"
done

TO_DELETE=()
for id in "${TARGET_IDS[@]}"; do
  keep=0
  for kid in "${KEEP_IDS[@]}"; do
    if [[ "$id" == "$kid" ]]; then
      keep=1
      break
    fi
  done
  if ((keep == 0)); then
    TO_DELETE+=("$id")
  fi
done

if ((${#TO_DELETE[@]} == 0)); then
  echo "cleanup-deployments: nothing to delete"
  exit 0
fi

if ((DRY_RUN == 1)); then
  echo "cleanup-deployments: dry-run, would delete"
  for id in "${TO_DELETE[@]}"; do
    gh api -H "Accept: $ACCEPT" \
      "https://api.github.com/repos/$OWNER/$REPO/deployments/$id" \
      --jq "$PRINT_FILTER"
  done
  exit 0
fi

echo "cleanup-deployments: deleting old deployments"
for id in "${TO_DELETE[@]}"; do
  gh api -X POST -H "Accept: $ACCEPT" \
    "https://api.github.com/repos/$OWNER/$REPO/deployments/$id/statuses" \
    -f state=inactive \
    -f description="cleanup old deployments" >/dev/null || true

  gh api -X DELETE -H "Accept: $ACCEPT" \
    "https://api.github.com/repos/$OWNER/$REPO/deployments/$id" >/dev/null

  echo "cleanup-deployments: deleted id=$id"
done

echo "cleanup-deployments: done"
