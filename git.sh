#!/usr/bin/env bash
set -e

# Simple helper to add/commit/push to the given GitHub repo.
# Usage: ./Untitled-1 -m "commit message" [-b branch]

REMOTE_URL="https://github.com/hoseaurbanusaudu3-cpu/Germ.git"
REMOTE_NAME="origin"

usage() {
  echo "Usage: $0 -m \"commit message\" [-b branch]"
  exit 1
}

# Parse options
while getopts "m:b:" opt; do
  case "$opt" in
    m) COMMIT_MSG="$OPTARG" ;;
    b) BRANCH="$OPTARG" ;;
    *) usage ;;
  esac
done

[ -z "$COMMIT_MSG" ] && usage
BRANCH="${BRANCH:-main}"

# If not inside a git repository, initialize one and create README.md if missing
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "No git repository found — initializing..."
  git init

  # Ensure branch exists (create it later via -M after first commit if needed)
  # Create README.md if it doesn't exist (matches user's command)
  if [ ! -f README.md ]; then
    echo "# Germ" > README.md
    echo "Created README.md"
  fi

  git add README.md
  # If there are staged changes, commit them using provided message (fallback to "first commit" if message empty)
  if git diff --cached --quiet; then
    echo "No changes to commit after init."
  else
    git commit -m "${COMMIT_MSG:-first commit}"
  fi
fi

# Add or update remote
if git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
  git remote set-url "$REMOTE_NAME" "$REMOTE_URL"
else
  git remote add "$REMOTE_NAME" "$REMOTE_URL"
fi

# Stage all changes
git add .

# Commit only if there are staged changes
if git diff --cached --quiet; then
  echo "Nothing to commit."
else
  git commit -m "$COMMIT_MSG"
fi

# Ensure branch name and push
git branch -M "$BRANCH"
git push -u "$REMOTE_NAME" "$BRANCH"