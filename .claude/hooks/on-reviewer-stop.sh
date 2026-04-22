#!/bin/bash
# on-reviewer-stop.sh — SubagentStop hook for code-reviewer
#
# When a code-reviewer agent finishes:
# 1. Create marker JSON files for completed review types
# 2. Compute and write the staged content hash
#
# Uses $CWD from hook input — requires EnterWorktree so cwd = worktree.

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

# Write staged content hash — captures state at review completion.
# If code changes after review, hash won't match at commit time.
HASH=$(git -C "$CWD" diff --cached 2>/dev/null | shasum -a 256 | cut -d' ' -f1)
if [[ -n "$HASH" ]]; then
  echo "{\"hash\": \"$HASH\", \"timestamp\": \"$TIMESTAMP\"}" > "$REVIEWS_DIR/review-hash.json"
fi

exit 0
