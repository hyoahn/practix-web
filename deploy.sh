#!/bin/bash
# Practix Deployment Script
# Ensures GR6/GR7 are met by pushing all local changes to the live site.

echo "🚀 Starting Deployment to Practix.org..."

# Check for git
if ! [ -x "$(command -v git)" ]; then
  echo "Error: git is not installed." >&2
  exit 1
fi

# Add all changes
git add .

# Commit with timestamp
COMMIT_MSG="Site Update: $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MSG"

# Push to main
git push origin main

echo "✅ Deployment Complete! Live at https://practix.org"
echo "💡 Note: If changes don't appear immediately, please Force Refresh (Cmd+Shift+R or Ctrl+F5)."
