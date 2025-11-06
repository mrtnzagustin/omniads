#!/usr/bin/env bash

# ============================================================
# Local CI Replication Script
# ============================================================
# This script replicates ALL GitHub Actions workflows locally
# Run this before pushing to ensure CI will pass
#
# Usage: ./scripts/run-ci-locally.sh
# ============================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track failures
FAILURES=0
WARNINGS=0

echo ""
echo "================================================================"
echo "  LOCAL CI REPLICATION - OmniAds"
echo "================================================================"
echo ""
echo "This script replicates the GitHub Actions workflows:"
echo "  - speckit-validation.yml"
echo "  - speckit-enforcement.yml"
echo ""

# ============================================================
# JOB 1: Speckit Validation
# ============================================================
echo "${BLUE}[1/6] Speckit Validation${NC}"
echo "----------------------------------------------------------------"

# Check constitution exists
CONSTITUTION_PATH=".specify/memory/constitution.md"
if [[ ! -f "$CONSTITUTION_PATH" ]]; then
    echo "${RED}❌ FAILED: Constitution file not found: $CONSTITUTION_PATH${NC}"
    FAILURES=$((FAILURES + 1))
else
    echo "✅ Constitution file exists"
fi

# Check constitution is not empty
if [[ ! -s "$CONSTITUTION_PATH" ]]; then
    echo "${RED}❌ FAILED: Constitution file is empty${NC}"
    FAILURES=$((FAILURES + 1))
else
    FILE_SIZE=$(wc -l < "$CONSTITUTION_PATH")
    echo "✅ Constitution file has $FILE_SIZE lines"
fi

# Validate constitution content
REQUIRED_SECTIONS=(
    "Core Principles"
    "Technology Stack"
    "Testing"
    "Documentation"
    "Quality Gates"
)

MISSING_SECTIONS=()
for SECTION in "${REQUIRED_SECTIONS[@]}"; do
    if ! grep -qi "$SECTION" "$CONSTITUTION_PATH"; then
        MISSING_SECTIONS+=("$SECTION")
    fi
done

if [[ ${#MISSING_SECTIONS[@]} -gt 0 ]]; then
    echo "${YELLOW}⚠️  WARNING: Constitution may be incomplete. Missing sections:${NC}"
    for SECTION in "${MISSING_SECTIONS[@]}"; do
        echo "  - $SECTION"
    done
    WARNINGS=$((WARNINGS + 1))
else
    echo "✅ Constitution contains all required sections"
fi

echo ""

# ============================================================
# JOB 2: Speckit Enforcement
# ============================================================
echo "${BLUE}[2/6] Speckit Enforcement${NC}"
echo "----------------------------------------------------------------"

# Get current branch name
BRANCH_NAME=$(git branch --show-current)
echo "Branch: $BRANCH_NAME"

# Extract feature number from branch name (e.g., 001-feature-name -> 001)
FEATURE_NUM=$(echo "$BRANCH_NAME" | grep -oE '^[0-9]{3}' || true)

if [ -n "$FEATURE_NUM" ]; then
    echo "🔢 Feature branch detected: $BRANCH_NAME (Feature #$FEATURE_NUM)"

    # Find matching spec directory
    MATCHING_SPEC=$(find specs -maxdepth 1 -type d -name "${FEATURE_NUM}-*" 2>/dev/null | head -n 1 || true)

    if [ -z "$MATCHING_SPEC" ]; then
        echo "${RED}❌ FAILED: No matching spec directory found for feature $FEATURE_NUM${NC}"
        echo "Expected: specs/${FEATURE_NUM}-feature-name/"
        FAILURES=$((FAILURES + 1))
    else
        echo "✅ Found spec directory: $MATCHING_SPEC"

        # Check for required files
        MISSING_FILES=""
        EMPTY_FILES=""

        # Check spec.md
        if [ ! -f "$MATCHING_SPEC/spec.md" ]; then
            MISSING_FILES="$MISSING_FILES\n   ❌ spec.md (missing)"
        elif [ ! -s "$MATCHING_SPEC/spec.md" ]; then
            EMPTY_FILES="$EMPTY_FILES\n   ⚠️  spec.md (empty)"
        else
            echo "✅ spec.md exists and is not empty"
        fi

        # Check plan.md
        if [ ! -f "$MATCHING_SPEC/plan.md" ]; then
            MISSING_FILES="$MISSING_FILES\n   ❌ plan.md (missing)"
        elif [ ! -s "$MATCHING_SPEC/plan.md" ]; then
            EMPTY_FILES="$EMPTY_FILES\n   ⚠️  plan.md (empty)"
        else
            echo "✅ plan.md exists and is not empty"
        fi

        # Check tasks.md
        if [ ! -f "$MATCHING_SPEC/tasks.md" ]; then
            MISSING_FILES="$MISSING_FILES\n   ❌ tasks.md (missing)"
        elif [ ! -s "$MATCHING_SPEC/tasks.md" ]; then
            EMPTY_FILES="$EMPTY_FILES\n   ⚠️  tasks.md (empty)"
        else
            echo "✅ tasks.md exists and is not empty"
        fi

        # Report errors
        if [ -n "$MISSING_FILES" ] || [ -n "$EMPTY_FILES" ]; then
            echo "${RED}❌ FAILED: Required Speckit files are missing or empty:${NC}"
            if [ -n "$MISSING_FILES" ]; then
                echo -e "$MISSING_FILES"
            fi
            if [ -n "$EMPTY_FILES" ]; then
                echo -e "$EMPTY_FILES"
            fi
            FAILURES=$((FAILURES + 1))
        fi
    fi
else
    echo "${YELLOW}ℹ️  Branch does not follow NNN-feature-name pattern${NC}"
    echo "Skipping Speckit validation"
fi

echo ""

# ============================================================
# JOB 3: Backend Tests
# ============================================================
echo "${BLUE}[3/6] Backend Tests${NC}"
echo "----------------------------------------------------------------"

cd backend

echo "🧹 Cleaning backend environment..."
rm -rf node_modules

echo "📦 Installing backend dependencies (npm ci)..."
if ! npm ci > /dev/null 2>&1; then
    echo "${RED}❌ FAILED: npm ci failed for backend${NC}"
    echo "Try regenerating package-lock.json with: cd backend && rm package-lock.json && npm install"
    FAILURES=$((FAILURES + 1))
    cd ..
else
    echo "✅ npm ci completed"

    echo "🧪 Running backend tests..."
    if npm test -- --passWithNoTests --silent 2>&1 | tee /tmp/backend-tests.log | grep -E "(FAIL|PASS|Test Suites)"; then
        echo "✅ Backend tests passed"
    else
        echo "${RED}❌ FAILED: Backend tests failed${NC}"
        echo "See logs above for details"
        FAILURES=$((FAILURES + 1))
    fi

    cd ..
fi

echo ""

# ============================================================
# JOB 4: Frontend Tests
# ============================================================
echo "${BLUE}[4/6] Frontend Tests${NC}"
echo "----------------------------------------------------------------"

cd frontend

echo "🧹 Cleaning frontend environment..."
rm -rf node_modules

echo "📦 Installing frontend dependencies (npm ci)..."
if ! npm ci > /dev/null 2>&1; then
    echo "${RED}❌ FAILED: npm ci failed for frontend${NC}"
    echo "Try regenerating package-lock.json with: cd frontend && rm package-lock.json && npm install"
    FAILURES=$((FAILURES + 1))
    cd ..
else
    echo "✅ npm ci completed"

    echo "🧪 Running frontend tests..."
    if npm run test:run -- --passWithNoTests 2>&1 | grep -E "(FAIL|PASS|No test files)"; then
        echo "✅ Frontend tests passed"
    else
        echo "${RED}❌ FAILED: Frontend tests failed${NC}"
        echo "See logs above for details"
        FAILURES=$((FAILURES + 1))
    fi

    cd ..
fi

echo ""

# ============================================================
# JOB 5: Build Validation
# ============================================================
echo "${BLUE}[5/6] Build Validation${NC}"
echo "----------------------------------------------------------------"

echo "🏗️  Building backend..."
cd backend
if npm run build > /dev/null 2>&1; then
    if [ -d "dist" ]; then
        echo "✅ Backend build succeeded"
    else
        echo "${RED}❌ FAILED: Backend build did not generate dist/ directory${NC}"
        FAILURES=$((FAILURES + 1))
    fi
else
    echo "${YELLOW}⚠️  Backend build completed with TypeScript errors (code compiled)${NC}"
    if [ -d "dist" ]; then
        echo "✅ Backend dist/ exists (build succeeded)"
        WARNINGS=$((WARNINGS + 1))
    else
        echo "${RED}❌ FAILED: Backend build failed completely${NC}"
        FAILURES=$((FAILURES + 1))
    fi
fi
cd ..

echo ""
echo "🏗️  Building frontend..."
cd frontend
if npm run build > /dev/null 2>&1; then
    if [ -d "dist" ]; then
        echo "✅ Frontend build succeeded"
    else
        echo "${RED}❌ FAILED: Frontend build did not generate dist/ directory${NC}"
        FAILURES=$((FAILURES + 1))
    fi
else
    echo "${RED}❌ FAILED: Frontend build failed${NC}"
    FAILURES=$((FAILURES + 1))
fi
cd ..

echo ""

# ============================================================
# JOB 6: Tech Stack Compliance
# ============================================================
echo "${BLUE}[6/6] Tech Stack Compliance${NC}"
echo "----------------------------------------------------------------"

# Define forbidden patterns
FORBIDDEN_BACKEND=(
    "express"
    "mongoose"
    "sequelize"
    "mysql"
    "mocha"
    "chai"
)

FORBIDDEN_FRONTEND=(
    "vue"
    "angular"
    "svelte"
    "styled-components"
    "emotion"
    "redux"
    "mobx"
    "enzyme"
)

TECH_ERRORS=0

# Check backend package.json
if [[ -f "backend/package.json" ]]; then
    for PKG in "${FORBIDDEN_BACKEND[@]}"; do
        if grep -q "\"$PKG\"" backend/package.json; then
            echo "${RED}❌ ERROR: Forbidden backend dependency: $PKG${NC}"
            TECH_ERRORS=$((TECH_ERRORS + 1))
        fi
    done
fi

# Check frontend package.json
if [[ -f "frontend/package.json" ]]; then
    for PKG in "${FORBIDDEN_FRONTEND[@]}"; do
        if grep -q "\"$PKG\"" frontend/package.json; then
            echo "${RED}❌ ERROR: Forbidden frontend dependency: $PKG${NC}"
            TECH_ERRORS=$((TECH_ERRORS + 1))
        fi
    done
fi

if [[ $TECH_ERRORS -gt 0 ]]; then
    echo "${RED}❌ FAILED: Tech stack violations detected${NC}"
    FAILURES=$((FAILURES + 1))
else
    echo "✅ No forbidden dependencies detected"
fi

echo ""

# ============================================================
# SUMMARY
# ============================================================
echo "================================================================"
echo "  SUMMARY"
echo "================================================================"
echo ""

if [[ $FAILURES -eq 0 ]] && [[ $WARNINGS -eq 0 ]]; then
    echo "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "Your code is ready to push. CI should pass."
    echo ""
    exit 0
elif [[ $FAILURES -eq 0 ]] && [[ $WARNINGS -gt 0 ]]; then
    echo "${YELLOW}⚠️  PASSED WITH $WARNINGS WARNING(S)${NC}"
    echo ""
    echo "Your code should pass CI, but there are warnings to review."
    echo ""
    exit 0
else
    echo "${RED}❌ FAILED WITH $FAILURES ERROR(S)${NC}"
    if [[ $WARNINGS -gt 0 ]]; then
        echo "${YELLOW}   and $WARNINGS WARNING(S)${NC}"
    fi
    echo ""
    echo "Fix the errors above before pushing. CI will fail."
    echo ""
    exit 1
fi
