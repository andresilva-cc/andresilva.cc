#!/bin/bash
# pre-commit-review-check.sh — PreToolUse hook for Bash
#
# Blocks git commit if:
# - git add and git commit are combined in one command (must be separate)
# - Source/test files are staged but required reviews are missing
#
# Review types required:
#   - Source files → all 4 (code-quality, security, testing, architecture)
#   - Test files only → code-quality + testing
#   - Docs/config only → no reviews needed
#
# Uses $CWD from hook input — requires EnterWorktree so cwd = worktree.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only trigger on git commit
if ! echo "$COMMAND" | grep -qE '\bgit\s+commit\b'; then
  exit 0
fi

# Allow --no-verify bypass (intentional escape hatch)
if echo "$COMMAND" | grep -q '\-\-no-verify'; then
  exit 0
fi

# Block combined git add && git commit — must be separate commands
if echo "$COMMAND" | grep -qE '\bgit\s+add\b'; then
  {
    echo "BLOCKED: git add and git commit must be separate commands."
    echo "Run git add first, then git commit in a separate command."
  } >&2
  exit 2
fi

CWD=$(echo "$INPUT" | jq -r '.cwd // empty')
if [[ -z "$CWD" ]]; then
  exit 0
fi

# Get staged files
STAGED=$(git -C "$CWD" diff --cached --name-only --diff-filter=ACM 2>/dev/null)
if [[ -z "$STAGED" ]]; then
  exit 0
fi

# Classify staged files
HAS_SOURCE=false
HAS_TESTS=false

while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  if echo "$file" | grep -q '^\.claude/'; then
    continue
  fi
  if echo "$file" | grep -qE '\.(spec|test)\.(ts|tsx|js|jsx)$'; then
    HAS_TESTS=true
    continue
  fi
  if echo "$file" | grep -qE '\.(ts|tsx|js|jsx|cjs|mjs|py|rs|go|java|rb|sh)$'; then
    HAS_SOURCE=true
  fi
done <<< "$STAGED"

# Determine required review types
REQUIRED_TYPES=()
if [[ "$HAS_SOURCE" == "true" ]]; then
  REQUIRED_TYPES=("code-quality" "security" "testing" "architecture")
elif [[ "$HAS_TESTS" == "true" ]]; then
  REQUIRED_TYPES=("code-quality" "testing")
else
  exit 0
fi

REVIEWS_DIR="$CWD/.reviews"
MARKER_MAX_AGE=1800  # 30 minutes
MISSING=()
STALE=()
NOW=$(date +%s)

for type in "${REQUIRED_TYPES[@]}"; do
  marker="$REVIEWS_DIR/marker-${type}.json"
  if [[ ! -f "$marker" ]]; then
    MISSING+=("$type")
    continue
  fi
  TIMESTAMP=$(jq -r '.timestamp // empty' "$marker" 2>/dev/null)
  if [[ -z "$TIMESTAMP" ]]; then
    STALE+=("$type")
    continue
  fi
  if [[ "$(uname)" == "Darwin" ]]; then
    MARKER_EPOCH=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$TIMESTAMP" +%s 2>/dev/null || echo 0)
  else
    MARKER_EPOCH=$(date -d "$TIMESTAMP" +%s 2>/dev/null || echo 0)
  fi
  AGE=$(( NOW - MARKER_EPOCH ))
  if [[ "$AGE" -gt "$MARKER_MAX_AGE" ]]; then
    STALE+=("$type")
  fi
done

if [[ ${#MISSING[@]} -gt 0 || ${#STALE[@]} -gt 0 ]]; then
  {
    echo "BLOCKED: Code reviews incomplete."
    echo ""
    echo "Required reviews: ${REQUIRED_TYPES[*]}"
    if [[ ${#MISSING[@]} -gt 0 ]]; then
      echo "Missing: ${MISSING[*]}"
    fi
    if [[ ${#STALE[@]} -gt 0 ]]; then
      echo "Stale (>30 min): ${STALE[*]}"
    fi
    echo ""
    echo "To bypass: git commit --no-verify -m \"message\""
  } >&2
  exit 2
fi

# Check staged content hash matches review-time hash
HASH_FILE="$REVIEWS_DIR/review-hash.json"
if [[ -f "$HASH_FILE" ]]; then
  CURRENT_HASH=$(git -C "$CWD" diff --cached 2>/dev/null | shasum -a 256 | cut -d' ' -f1)
  REVIEW_HASH=$(jq -r '.hash // empty' "$HASH_FILE" 2>/dev/null)
  if [[ -n "$REVIEW_HASH" && "$CURRENT_HASH" != "$REVIEW_HASH" ]]; then
    echo "BLOCKED: Staged files changed since last review. Re-run reviews." >&2
    exit 2
  fi
fi

exit 0
