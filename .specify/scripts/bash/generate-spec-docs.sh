#!/bin/bash

# generate-spec-docs.sh
# Helper script to generate plan.md and tasks.md for a feature spec
# Usage: ./generate-spec-docs.sh <feature-number>
# Example: ./generate-spec-docs.sh 001

set -e

SPEC_NUMBER=$1

if [ -z "$SPEC_NUMBER" ]; then
  echo "Usage: ./generate-spec-docs.sh <feature-number>"
  echo "Example: ./generate-spec-docs.sh 001"
  exit 1
fi

# Find the spec directory
SPEC_DIR=$(find ./specs -maxdepth 1 -type d -name "${SPEC_NUMBER}-*" | head -n 1)

if [ -z "$SPEC_DIR" ]; then
  echo "Error: No spec directory found for feature ${SPEC_NUMBER}"
  exit 1
fi

SPEC_NAME=$(basename "$SPEC_DIR")
echo "Found spec directory: $SPEC_DIR"

# Check if spec.md exists
if [ ! -f "$SPEC_DIR/spec.md" ]; then
  echo "Error: $SPEC_DIR/spec.md not found"
  echo "Please create spec.md first using /speckit.spec command"
  exit 1
fi

echo ""
echo "=== Generating plan.md and tasks.md for $SPEC_NAME ==="
echo ""
echo "IMPORTANT: This script requires Claude Code to be running."
echo "Please use the following commands in Claude Code:"
echo ""
echo "1. Generate plan.md:"
echo "   /speckit.plan $SPEC_NAME"
echo ""
echo "2. Generate tasks.md (after plan.md is complete):"
echo "   /speckit.tasks $SPEC_NAME"
echo ""
echo "Alternatively, you can manually create these files using the templates in:"
echo "  - .specify/templates/plan-template.md"
echo "  - .specify/templates/tasks-template.md"
echo ""
echo "Reference example: specs/006-unmock-ai-integration/"
echo ""
