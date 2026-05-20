#!/bin/bash
# review-content-hash.sh — staging-independent content hash of the change set.
#
# Usage: review-content-hash.sh <repo-or-worktree-dir>
# Prints a 64-char sha256 to stdout. Exits non-zero (no output) on bad input.
#
# Both review-gate hooks (on-reviewer-stop.sh, pre-commit-review-check.sh) call
# this so the review-time hash and the commit-time hash are computed identically.
#
# Design notes:
#   - Hashes the WORKING-TREE content of every file changed vs HEAD — tracked or
#     not, staged or not. Staging order is irrelevant (the original gate bug was
#     hashing `git diff --cached`, which is empty until `git add` runs).
#   - File names come from the union of `git diff HEAD` (tracked changes) and
#     `git ls-files --others` (untracked). `--no-renames` keeps enumeration
#     deterministic and lists both sides of a rename.
#   - Content is hashed via `git hash-object`, which applies .gitattributes
#     filters uniformly whether or not the file is tracked — so a new file hashes
#     the same before and after `git add`.
#   - Symlinks are hashed by their link-target STRING, not the file they point
#     to (`git hash-object` would otherwise follow the link off-repo).
#   - `.claude/` and `.reviews/` are excluded: agent memory/config and the
#     gate's own marker/hash scratch files are not reviewed code. Hard-excluding
#     `.reviews/` (rather than trusting .gitignore) keeps the hash stable while
#     the gate writes its own artifacts.
#   - Present files always yield a 40-hex object id; absent (deleted) files and
#     unhashable paths (directories, submodule gitlinks) yield fixed non-hex
#     sentinels, so they can never collide with a real object id.

set -u

CWD="${1:-}"
if [[ -z "$CWD" || ! -d "$CWD" ]]; then
  exit 1
fi

# Base for the "changed" enumeration. A worktree always has a HEAD, but if a
# repo has no commits yet, diff against the empty tree so staged files still
# enumerate (otherwise they are neither "changed vs HEAD" nor untracked).
if git -C "$CWD" rev-parse --verify -q HEAD >/dev/null 2>&1; then
  BASE=HEAD
else
  BASE=$(git -C "$CWD" hash-object -t tree /dev/null)
fi

{
  git -C "$CWD" diff "$BASE" --no-renames --name-only -z -- ':!.claude' ':!.reviews' 2>/dev/null
  git -C "$CWD" ls-files --others --exclude-standard -z -- ':!.claude' ':!.reviews' 2>/dev/null
} | sort -z -u | {
  while IFS= read -r -d '' path; do
    full="$CWD/$path"
    if [[ -L "$full" ]]; then
      oid=$(readlink "$full" | git -C "$CWD" hash-object --stdin 2>/dev/null)
    elif [[ -f "$full" ]]; then
      oid=$(git -C "$CWD" hash-object -- "$path" 2>/dev/null)
    else
      oid="DELETED"
    fi
    [[ -z "$oid" ]] && oid="UNHASHABLE"
    printf '%s:%s\n' "$path" "$oid"
  done
} | shasum -a 256 | cut -d' ' -f1
