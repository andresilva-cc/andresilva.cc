#!/bin/bash
# post-commit-cleanup.sh — PostToolUse hook for Bash
#
# After a successful git commit, deletes review markers and hash file.
# Single-use enforcement — next commit needs fresh reviews.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if ! echo "$COMMAND" | grep -qE '\bgit\s+commit\b'; then
  exit 0
fi

CWD=$(echo "$INPUT" | jq -r '.cwd // empty')
if [[ -z "$CWD" ]]; then
  exit 0
fi

# Only clean up if the commit actually succeeded. A successful `git commit`
# leaves the index clean (matches HEAD); a failed one (bad message, rejected by
# another pre-commit tool, nothing staged) leaves staged changes behind. If we
# cleaned up unconditionally, a failed commit would wipe valid review state and
# force a needless full re-review.
if git -C "$CWD" diff --cached --quiet 2>/dev/null; then
  rm -f "$CWD/.reviews"/marker-*.json "$CWD/.reviews/review-hash.json" 2>/dev/null
fi

exit 0
