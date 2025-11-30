#!/bin/bash

# Git worktree status checker
# Usage: ./scripts/worktree-status.sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 Git Worktree Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get all worktrees
WORKTREES=$(git worktree list --porcelain)

ACTIVE_COUNT=0
PRUNABLE_COUNT=0

while IFS= read -r line || [ -n "$line" ]; do
  if [[ $line == worktree* ]]; then
    WORKTREE_PATH=$(echo "$line" | cut -d' ' -f2-)
  elif [[ $line == HEAD* ]]; then
    HEAD=$(echo "$line" | cut -d' ' -f2-)
  elif [[ $line == branch* ]]; then
    BRANCH=$(echo "$line" | cut -d' ' -f2-)
  elif [[ $line == prunable* ]]; then
    PRUNABLE=$(echo "$line" | cut -d' ' -f2-)
  elif [[ -z "$line" ]]; then
    # Empty line indicates end of worktree entry
    if [ -n "$WORKTREE_PATH" ]; then
      if [ "$PRUNABLE" = "prunable" ]; then
        PRUNABLE_COUNT=$((PRUNABLE_COUNT + 1))
        echo "⚠️  PRUNABLE: $WORKTREE_PATH"
        echo "   HEAD: $HEAD"
        [ -n "$PRUNABLE" ] && echo "   Reason: gitdir file points to non-existent location"
      else
        ACTIVE_COUNT=$((ACTIVE_COUNT + 1))
        echo "✓  ACTIVE: $WORKTREE_PATH"
        if [ -n "$BRANCH" ]; then
          echo "   Branch: $BRANCH"
        else
          echo "   HEAD: $HEAD (detached)"
        fi
        
        # Check git status for this worktree
        if [ -d "$WORKTREE_PATH" ]; then
          STATUS=$(cd "$WORKTREE_PATH" && git status --porcelain 2>/dev/null | head -1)
          if [ -z "$STATUS" ]; then
            echo "   Status: ✓ Clean"
          else
            echo "   Status: ⚠️  Has changes"
          fi
        fi
      fi
      echo ""
    fi
    # Reset variables
    WORKTREE_PATH=""
    HEAD=""
    BRANCH=""
    PRUNABLE=""
  fi
done <<< "$WORKTREES"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary:"
echo "  Active worktrees: $ACTIVE_COUNT"
echo "  Prunable worktrees: $PRUNABLE_COUNT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $PRUNABLE_COUNT -gt 0 ]; then
  echo ""
  echo "💡 Tip: Clean up prunable worktrees with: git worktree prune"
fi
