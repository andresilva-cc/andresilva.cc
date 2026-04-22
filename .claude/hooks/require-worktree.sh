#!/bin/bash

INPUT=$(cat)

# For Edit/Write, always use the file's directory — cwd may point to the
# main project root even when the agent is working inside a worktree.
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
if [[ -n "$FILE_PATH" ]]; then
  CHECK_DIR=$(dirname "$FILE_PATH")
else
  CHECK_DIR=$(echo "$INPUT" | jq -r '.cwd // empty')
fi

# If we have no directory to check, allow the operation.
if [[ -z "$CHECK_DIR" ]]; then
  exit 0
fi

# Check if we're in a git repository
if ! git -C "$CHECK_DIR" rev-parse --git-dir > /dev/null 2>&1; then
  exit 0
fi

# .git is a directory in the main working tree, a file in worktrees
GIT_DIR=$(git -C "$CHECK_DIR" rev-parse --git-dir 2>/dev/null)
if [[ "$GIT_DIR" == ".git" || "$GIT_DIR" == "$CHECK_DIR/.git" ]]; then
  echo '{
    "hookSpecificOutput": {
      "hookEventName": "PreToolUse",
      "permissionDecision": "deny",
      "permissionDecisionReason": "BLOCKED: You are in the main working tree. All code changes must be made in a git worktree. See the Git Worktrees section in CLAUDE.md."
    }
  }'
  exit 0
fi

exit 0
