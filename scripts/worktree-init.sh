#!/bin/bash

# Git worktree initialization helper
# Usage: ./scripts/worktree-init.sh <branch-name> [base-path]

set -e

BRANCH_NAME="$1"
BASE_PATH="${2:-$HOME/Documents/fitness-ai-v2.worktrees}"

if [ -z "$BRANCH_NAME" ]; then
  echo "Usage: $0 <branch-name> [base-path]"
  echo ""
  echo "Examples:"
  echo "  $0 feature/new-feature"
  echo "  $0 bugfix/fix-issue"
  echo ""
  echo "Current worktrees:"
  git worktree list
  exit 1
fi

WORKTREE_PATH="$BASE_PATH/$BRANCH_NAME"

# Check if branch already exists
if git show-ref --verify --quiet refs/heads/"$BRANCH_NAME"; then
  echo "Branch '$BRANCH_NAME' already exists locally."
  read -p "Create worktree from existing branch? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
else
  echo "Creating new branch '$BRANCH_NAME'..."
  git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"
fi

# Create worktree
if [ -d "$WORKTREE_PATH" ]; then
  echo "Worktree path already exists: $WORKTREE_PATH"
  exit 1
fi

echo "Creating worktree at: $WORKTREE_PATH"
git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"

echo ""
echo "✓ Worktree created successfully!"
echo "  Path: $WORKTREE_PATH"
echo "  Branch: $BRANCH_NAME"
echo ""
echo "To switch to this worktree:"
echo "  cd $WORKTREE_PATH"
echo ""
echo "To remove this worktree later:"
echo "  git worktree remove $WORKTREE_PATH"
