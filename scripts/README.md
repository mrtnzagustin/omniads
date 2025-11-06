# OmniAds Scripts

This directory contains utility scripts for the OmniAds project.

## `run-ci-locally.sh` - Local CI Validation

**Purpose**: Replicates ALL GitHub Actions workflows locally before you push. This ensures your code will pass CI before you create a PR.

### Why Use This?

Running this script locally helps you:
- ✅ Catch CI failures before pushing
- ✅ Save time (no waiting for remote CI)
- ✅ Ensure package-lock.json is in sync
- ✅ Validate Speckit compliance
- ✅ Verify all tests pass
- ✅ Check builds succeed

### Usage

```bash
# From project root
./scripts/run-ci-locally.sh
```

### What It Does

This script replicates the following GitHub Actions jobs:

1. **Speckit Validation** (speckit-validation.yml)
   - Validates constitution.md exists and has required sections
   - Checks for implementation without spec documentation
   - Validates tech stack compliance

2. **Speckit Enforcement** (speckit-enforcement.yml)
   - For feature branches (NNN-feature-name):
     - Validates spec.md exists and is not empty
     - Validates plan.md exists and is not empty
     - Validates tasks.md exists and is not empty
   - For other branches: Skips validation but runs tests

3. **Backend Tests**
   - Cleans node_modules
   - Runs `npm ci` (strict dependency installation)
   - Runs `npm test -- --passWithNoTests`
   - Validates all tests pass

4. **Frontend Tests**
   - Cleans node_modules
   - Runs `npm ci`
   - Runs `npm run test:run -- --passWithNoTests`
   - Validates all tests pass

5. **Build Validation**
   - Builds backend with `npm run build`
   - Builds frontend with `npm run build`
   - Validates dist/ directories are generated

6. **Tech Stack Compliance**
   - Checks for forbidden dependencies in backend/package.json
   - Checks for forbidden dependencies in frontend/package.json

### Exit Codes

- `0` - All checks passed (safe to push)
- `1` - One or more checks failed (fix before pushing)

### Output

The script provides color-coded output:
- 🔵 Blue: Section headers
- ✅ Green: Checks passed
- ⚠️ Yellow: Warnings
- ❌ Red: Failures

### Example Output

```
================================================================
  LOCAL CI REPLICATION - OmniAds
================================================================

[1/6] Speckit Validation
----------------------------------------------------------------
✅ Constitution file exists
✅ Constitution file has 450 lines
✅ Constitution contains all required sections

[2/6] Speckit Enforcement
----------------------------------------------------------------
Branch: claude/review-specs-and-implementation-011CUqq1HpmBk4RKzjEKBQKu
ℹ️  Branch does not follow NNN-feature-name pattern
Skipping Speckit validation

[3/6] Backend Tests
----------------------------------------------------------------
🧹 Cleaning backend environment...
📦 Installing backend dependencies (npm ci)...
✅ npm ci completed
🧪 Running backend tests...
Test Suites: 125 passed, 125 total
Tests:       1106 passed, 1106 total
✅ Backend tests passed

[4/6] Frontend Tests
----------------------------------------------------------------
🧹 Cleaning frontend environment...
📦 Installing backend dependencies (npm ci)...
✅ npm ci completed
🧪 Running frontend tests...
No test files found, exiting with code 0
✅ Frontend tests passed

[5/6] Build Validation
----------------------------------------------------------------
🏗️  Building backend...
✅ Backend build succeeded
🏗️  Building frontend...
✅ Frontend build succeeded

[6/6] Tech Stack Compliance
----------------------------------------------------------------
✅ No forbidden dependencies detected

================================================================
  SUMMARY
================================================================

✅ ALL CHECKS PASSED!

Your code is ready to push. CI should pass.
```

### Common Issues

#### npm ci fails

**Error**: `npm ci can only install packages when your package.json and package-lock.json are in sync`

**Solution**:
```bash
# For backend
cd backend
rm package-lock.json
npm install
cd ..

# For frontend
cd frontend
rm package-lock.json
npm install
cd ..

# Then run the script again
./scripts/run-ci-locally.sh
```

#### Tests fail

**Solution**: Fix the failing tests before pushing. The script will show you which tests failed.

#### Build fails

**Solution**: Fix TypeScript errors or build issues. Check the build output for details.

#### Speckit validation fails

**Solution**: Create missing spec.md, plan.md, or tasks.md files:
```bash
# Use templates
cp .specify/templates/spec-template.md specs/NNN-feature-name/spec.md
cp .specify/templates/plan-template.md specs/NNN-feature-name/plan.md
cp .specify/templates/tasks-template.md specs/NNN-feature-name/tasks.md

# Or use the generation script
./.specify/scripts/bash/generate-spec-docs.sh NNN
```

### When to Run This

**Always run before**:
- Creating a pull request
- Pushing to main or develop branches
- Pushing feature branches

**Recommended workflow**:
```bash
# 1. Make your changes
git add .

# 2. Run local CI validation
./scripts/run-ci-locally.sh

# 3. If passed, commit and push
git commit -m "Your commit message"
git push
```

### Performance

- **First run**: ~2-3 minutes (fresh npm ci for both projects)
- **Subsequent runs**: ~1-2 minutes (if node_modules already exist)

### Continuous Improvement

This script is maintained to stay in sync with GitHub Actions workflows. If workflows are updated, this script should be updated to match.

## Other Scripts

(Add other scripts here as they are created)
