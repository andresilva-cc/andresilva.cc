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

rm -f "$CWD/.reviews"/marker-*.json "$CWD/.reviews/review-hash.json" 2>/dev/null

exit 0
