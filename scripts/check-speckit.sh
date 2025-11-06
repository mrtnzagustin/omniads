#!/usr/bin/env bash

# Speckit Validation Script for OmniAds
#
# This script validates that all feature specifications follow the required
# Speckit workflow structure. It ensures that each spec directory contains
# the required documentation files before implementation begins.
#
# Required structure:
#   specs/
#     XXX-feature-name/
#       spec.md    (Feature specification)
#       plan.md    (Implementation plan)
#       tasks.md   (Task breakdown)
#
# Usage: bash scripts/check-speckit.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track errors
ERRORS=0

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          OmniAds Speckit Structure Validation             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if constitution exists
CONSTITUTION_PATH=".specify/memory/constitution.md"
if [[ -f "$CONSTITUTION_PATH" ]] && [[ -s "$CONSTITUTION_PATH" ]]; then
    echo -e "${GREEN}✓${NC} Constitution exists: $CONSTITUTION_PATH"
else
    echo -e "${RED}✗${NC} Constitution missing or empty: $CONSTITUTION_PATH"
    ERRORS=$((ERRORS + 1))
fi

# Check if specs directory exists
if [[ ! -d "specs" ]]; then
    echo -e "${RED}✗${NC} Specs directory not found: specs/"
    echo ""
    echo -e "${YELLOW}To create your first spec, run:${NC}"
    echo "  /speckit-new"
    exit 1
fi

echo -e "${GREEN}✓${NC} Specs directory exists"
echo ""
echo "Checking spec directories..."
echo ""

# Find all spec directories
SPEC_DIRS=$(find specs -mindepth 1 -maxdepth 1 -type d | sort)

if [[ -z "$SPEC_DIRS" ]]; then
    echo -e "${YELLOW}⚠${NC}  No spec directories found in specs/"
    echo ""
    echo -e "${YELLOW}To create your first spec, run:${NC}"
    echo "  /speckit-new"
    exit 0
fi

# Check each spec directory
for SPEC_DIR in $SPEC_DIRS; do
    SPEC_NAME=$(basename "$SPEC_DIR")

    # Initialize status for this spec
    SPEC_ERRORS=0

    echo "📁 $SPEC_NAME"

    # Check for required files
    SPEC_FILE="$SPEC_DIR/spec.md"
    PLAN_FILE="$SPEC_DIR/plan.md"
    TASKS_FILE="$SPEC_DIR/tasks.md"

    # Check spec.md
    if [[ -f "$SPEC_FILE" ]]; then
        echo -e "  ${GREEN}✓${NC} spec.md"
    else
        echo -e "  ${RED}✗${NC} spec.md (MISSING)"
        SPEC_ERRORS=$((SPEC_ERRORS + 1))
        ERRORS=$((ERRORS + 1))
    fi

    # Check plan.md
    if [[ -f "$PLAN_FILE" ]]; then
        echo -e "  ${GREEN}✓${NC} plan.md"
    else
        echo -e "  ${RED}✗${NC} plan.md (MISSING)"
        SPEC_ERRORS=$((SPEC_ERRORS + 1))
        ERRORS=$((ERRORS + 1))
    fi

    # Check tasks.md
    if [[ -f "$TASKS_FILE" ]]; then
        echo -e "  ${GREEN}✓${NC} tasks.md"
    else
        echo -e "  ${RED}✗${NC} tasks.md (MISSING)"
        SPEC_ERRORS=$((SPEC_ERRORS + 1))
        ERRORS=$((ERRORS + 1))
    fi

    echo ""
done

# Summary
echo "════════════════════════════════════════════════════════════"
echo ""

if [[ $ERRORS -eq 0 ]]; then
    SPEC_COUNT=$(echo "$SPEC_DIRS" | wc -l)
    echo -e "${GREEN}✓ All specs are valid!${NC}"
    echo -e "Total specs validated: $SPEC_COUNT"
    echo ""
    exit 0
else
    echo -e "${RED}✗ ERROR: Some specs are missing required files.${NC}"
    echo ""
    echo -e "${YELLOW}Required workflow:${NC}"
    echo "  📝 spec.md → 📐 plan.md → ✅ tasks.md → 💻 Implementation"
    echo ""
    echo -e "${YELLOW}Each spec must have: spec.md, plan.md, and tasks.md${NC}"
    echo ""
    echo -e "${YELLOW}To fix missing files:${NC}"
    echo "  1. cd into the spec directory"
    echo "  2. Run /speckit-plan to generate plan.md"
    echo "  3. Run /speckit-tasks to generate tasks.md"
    echo ""
    echo "See .specify/memory/constitution.md for complete workflow."
    echo ""
    exit 1
fi
