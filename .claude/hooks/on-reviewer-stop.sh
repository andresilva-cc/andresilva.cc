#!/bin/bash
# on-reviewer-stop.sh — SubagentStop hook for code-reviewer
#
# When a code-reviewer agent finishes:
# 1. Create marker JSON files for completed review types
# 2. Compute and write the reviewed content hash
#
# Uses $CWD from hook input — requires EnterWorktree so cwd = worktree.

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

INPUT=$(cat)
CWD=$(echo "$INPUT" | jq -r '.cwd // empty')

if [[ -z "$CWD" ]]; then
  exit 0
fi

REVIEWS_DIR="$CWD/.reviews"

# No .reviews/ directory means no reviews happened here
if [[ ! -d "$REVIEWS_DIR" ]]; then
  exit 0
fi

TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Create markers for completed review types
TYPES=("code-quality" "security" "testing" "architecture")
for type in "${TYPES[@]}"; do
  if ls "$REVIEWS_DIR"/${type}-*.md 1>/dev/null 2>&1; then
    marker="$REVIEWS_DIR/marker-${type}.json"
    if [[ ! -f "$marker" ]]; then
      echo "{\"reviewed\": true, \"timestamp\": \"$TIMESTAMP\"}" > "$marker"
    fi
  fi
done

# Write the reviewed content hash — captures the change set at review completion.
# Staging-independent (see review-content-hash.sh); if code changes after review,
# the hash won't match at commit time. Written atomically via mktemp: 4 reviewers
# fire this hook concurrently, so a fixed temp name would let them clobber.
HASH=$("$HOOK_DIR/review-content-hash.sh" "$CWD" 2>/dev/null)
if [[ -n "$HASH" ]]; then
  TMP=$(mktemp "$REVIEWS_DIR/.review-hash.XXXXXX" 2>/dev/null)
  if [[ -n "$TMP" ]]; then
    echo "{\"hash\": \"$HASH\", \"timestamp\": \"$TIMESTAMP\"}" > "$TMP"
    mv -f "$TMP" "$REVIEWS_DIR/review-hash.json"
  fi
fi

exit 0
