# Speckit Setup & Enforcement Guide

This document explains how Speckit workflow enforcement is configured in OmniAds.

## 🎯 Overview

OmniAds uses **Speckit** for spec-driven development with **automated enforcement** to ensure all features follow the proper workflow:

1. **spec.md** → Define what to build
2. **plan.md** → Design how to build it
3. **tasks.md** → Break down into steps
4. **Implementation** → Follow the tasks
5. **Quality Gates** → Tests, builds, Docker validation

## 🛡️ Enforcement Mechanisms

### 1. Constitution (Source of Truth)

**File:** `.specify/memory/constitution.md`

**Contains:**
- 7 core principles (tech stack, testing, documentation, quality gates, etc.)
- Approved technology stack
- Forbidden practices
- Quality standards (80%+ test coverage)
- Sequential development workflow

**How it's enforced:**
- ✅ AI agents are instructed to read this FIRST
- ✅ Pre-commit hook references it in error messages
- ✅ Version controlled (changes tracked)

**Status:** ✅ COMPLETE

---

### 2. AI Agent Instructions

**File:** `.specify/AI_AGENT_INSTRUCTIONS.md`

**Contains:**
- Step-by-step workflow for AI agents
- Validation checklists
- Quick reference for common scenarios
- Specific instructions for Claude Code, Copilot, Cursor

**How it's enforced:**
- ✅ AI agents instructed to follow this guide
- ✅ Referenced in `.claude.md` for automatic loading

**Status:** ✅ COMPLETE

---

### 3. Pre-Commit Hook (Automated Validation)

**File:** `.husky/pre-commit`

**Validates:**
1. **Speckit Compliance** (if committing backend/frontend code):
   - Checks if branch name matches `XXX-feature-name` pattern
   - Validates `spec.md` exists
   - Validates `plan.md` exists
   - Validates `tasks.md` exists
   - **BLOCKS commit if any file is missing**

2. **Test Coverage**:
   - Runs backend tests with Jest
   - Runs frontend tests with Vitest
   - **BLOCKS commit if tests fail**
   - Enforces 80%+ coverage threshold

**Example output when blocked:**
```
❌ COMMIT BLOCKED: Missing required Speckit files:
   ❌ plan.md
   ❌ tasks.md

📖 According to .specify/memory/constitution.md:
   All features MUST have spec.md, plan.md, and tasks.md

🔧 To fix:
   1. Create missing files using templates in .specify/templates/
   2. Or use: ./.specify/scripts/bash/generate-spec-docs.sh 001
```

**How to bypass:** ❌ **YOU CAN'T** - The hook explicitly warns against `--no-verify`

**Status:** ✅ COMPLETE & ENFORCED

---

### 4. Claude Code Context

**File:** `.claude.md`

**Contains:**
- First-read instructions for Claude Code
- Workflow summary
- Tech stack constraints
- Quick reference commands

**How it's enforced:**
- ✅ Claude Code automatically loads `.claude.md` at session start
- ✅ Instructs AI to read constitution.md first
- ✅ Provides workflow summary for every task

**Status:** ✅ COMPLETE

---

### 5. Helper Scripts

**File:** `.specify/scripts/bash/generate-spec-docs.sh`

**Purpose:** Generate plan.md and tasks.md for a feature

**Usage:**
```bash
./specify/scripts/bash/generate-spec-docs.sh 001
```

**Status:** ✅ COMPLETE

**File:** `.specify/scripts/bash/check-prerequisites.sh`

**Purpose:** Validate that spec/plan/tasks exist before running tasks

**Status:** ✅ COMPLETE (included in Speckit)

---

### 6. Templates

**Location:** `.specify/templates/`

**Files:**
- `spec-template.md` - Feature specification template
- `plan-template.md` - Implementation plan template
- `tasks-template.md` - Task breakdown template

**How to use:**
```bash
cp .specify/templates/spec-template.md specs/XXX-feature/spec.md
cp .specify/templates/plan-template.md specs/XXX-feature/plan.md
cp .specify/templates/tasks-template.md specs/XXX-feature/tasks.md
```

**Status:** ✅ COMPLETE (shipped with Speckit)

---

## ✅ What IS Enforced

| Rule | Enforcement Method | Status |
|------|-------------------|--------|
| spec.md must exist | Pre-commit hook | ✅ ENFORCED |
| plan.md must exist | Pre-commit hook | ✅ ENFORCED |
| tasks.md must exist | Pre-commit hook | ✅ ENFORCED |
| Tests must pass | Pre-commit hook | ✅ ENFORCED |
| 80%+ test coverage | Jest/Vitest config | ✅ ENFORCED |
| Builds must succeed | Manual + CI/CD | ⚠️ MANUAL |
| Docker must work | Manual | ⚠️ MANUAL |
| README updates | Manual | ⚠️ MANUAL |
| Approved tech stack | Constitution + Manual review | ⚠️ DOCUMENTED |
| No `any` types | ESLint (if configured) | ⚠️ PARTIAL |

---

## ⚠️ What Is NOT Fully Enforced (Yet)

### 1. Build Validation
- **Status:** Manual
- **Should be:** Automated in pre-commit hook
- **Blocker:** Build time might be too slow for pre-commit

**Recommendation:** Add to CI/CD pipeline

### 2. Docker Validation
- **Status:** Manual
- **Should be:** Automated in CI/CD
- **Blocker:** Requires Docker daemon running

**Recommendation:** Add to CI/CD pipeline, test before merge

### 3. Documentation Updates
- **Status:** Manual review
- **Should be:** Validated in pre-commit
- **Blocker:** Hard to detect if README is properly updated

**Recommendation:** Add checklist template for PRs

### 4. TypeScript `any` Ban
- **Status:** Documented in constitution
- **Should be:** Enforced by ESLint rule
- **Fix:** Add `@typescript-eslint/no-explicit-any` to ESLint config

**Recommendation:**
```json
// backend/eslintrc.json and frontend/eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

---

## 🔄 Workflow Example

### Scenario: Implementing Feature 001

1. **Create feature branch:**
   ```bash
   git checkout -b 001-ai-budget-rebalancer
   ```

2. **Check for documentation:**
   ```bash
   ls specs/001-ai-budget-rebalancer/
   # spec.md  (exists)
   # plan.md  (missing!)
   # tasks.md (missing!)
   ```

3. **Create missing files:**
   ```bash
   ./specify/scripts/bash/generate-spec-docs.sh 001
   # Instructs you to create plan.md and tasks.md
   ```

4. **Implement following tasks.md**

5. **Try to commit:**
   ```bash
   git add -A
   git commit -m "feat: implement feature 001"
   ```

6. **Pre-commit hook runs:**
   ```
   🔍 Speckit Constitution Compliance Check...
   📋 Feature implementation detected. Checking Speckit compliance...
      Found feature spec: specs/001-ai-budget-rebalancer
      ✅ spec.md exists
      ✅ plan.md exists
      ✅ tasks.md exists

   🧪 Running tests before commit...
   🔵 Running backend tests...
      ✅ Backend tests passed
   🔵 Running frontend tests...
      ✅ Frontend tests passed

   ✅ All quality gates passed! Proceeding with commit.
   ```

7. **Commit succeeds!**

### Scenario: Missing Documentation

1. **Same branch, but plan.md doesn't exist**

2. **Try to commit:**
   ```bash
   git commit -m "feat: implement feature"
   ```

3. **Pre-commit hook BLOCKS:**
   ```
   ❌ COMMIT BLOCKED: Missing required Speckit files:
      ❌ plan.md
      ❌ tasks.md

   📖 According to .specify/memory/constitution.md:
      All features MUST have spec.md, plan.md, and tasks.md
   ```

4. **Cannot commit until fixed!**

---

## 🚀 How to Use This Setup

### For Developers

1. **Always work on feature branches:** `XXX-feature-name`
2. **Before coding:** Ensure spec/plan/tasks exist
3. **During coding:** Write tests alongside implementation
4. **Before committing:** Run tests locally
5. **Let the hook validate:** It will catch missing docs

### For AI Agents (Claude Code, Copilot, etc.)

1. **Session start:** Read `.claude.md`, then `constitution.md`
2. **Before implementation:** Check for spec/plan/tasks, create if missing
3. **During implementation:** Follow tasks.md, write tests
4. **Before completion:** Run quality gates
5. **On commit:** Trust the pre-commit hook to validate

### For Code Reviewers

1. **Check PR branch name:** Should follow `XXX-feature-name`
2. **Verify docs exist:** spec.md, plan.md, tasks.md in specs/
3. **Review test coverage:** Should be 80%+
4. **Check README updated:** New feature and endpoints documented
5. **Verify constitution compliance:** No forbidden practices

---

## 📊 Current Status

### ✅ Fully Enforced
- Speckit file existence (spec/plan/tasks)
- Test execution and coverage thresholds
- Pre-commit validation

### ⚠️ Partially Enforced
- TypeScript strict typing (documented, not enforced)
- Build success (manual, not automated)
- Docker validation (manual, not automated)

### ❌ Not Enforced (Manual Review)
- README.md updates
- Code comments on complex logic
- Proper commit message format
- Sequential feature development

---

## 🔧 Improvement Roadmap

### Phase 1: Current (Done ✅)
- ✅ Constitution.md created
- ✅ AI_AGENT_INSTRUCTIONS.md created
- ✅ Pre-commit hook validates Speckit compliance
- ✅ Pre-commit hook runs tests
- ✅ .claude.md for Claude Code integration

### Phase 2: Next Steps
- [ ] Add ESLint rule to ban `any` types
- [ ] Add build validation to CI/CD pipeline
- [ ] Add Docker validation to CI/CD pipeline
- [ ] Create PR template with checklist
- [ ] Add commitlint for commit message format

### Phase 3: Advanced
- [ ] Add spec/plan/tasks validation to CI/CD
- [ ] Automated README.md diff checker
- [ ] Coverage trending (track over time)
- [ ] Automated architecture decision records

---

## 🎓 FAQ

### Q: Can I bypass the pre-commit hook?
**A:** Technically yes with `--no-verify`, but **DON'T**. The hook explicitly warns against it, and your commit will be rejected in code review.

### Q: What if I'm working on a non-feature branch?
**A:** The hook only validates branches that match `XXX-feature-name` pattern. Other branches (like `main`, `develop`) skip Speckit validation.

### Q: Do I need to create spec/plan/tasks for every commit?
**A:** No, only when working on a **new feature**. Once created, they stay for the entire feature lifecycle.

### Q: What if AI agent doesn't follow the rules?
**A:** The pre-commit hook is the **backstop**. Even if AI skips docs, the hook will catch it and block the commit.

### Q: How do I know if coverage is below 80%?
**A:** Tests will fail. Jest and Vitest are configured with coverage thresholds that cause test failure if below 80%.

### Q: Can I implement multiple features in one branch?
**A:** **NO**. Constitution requires sequential development. One feature per branch.

---

## 📞 Support

- **Workflow questions:** See `.specify/AI_AGENT_INSTRUCTIONS.md`
- **Tech stack questions:** See `.specify/memory/constitution.md`
- **Docker help:** See `DOCKER.md`
- **Example reference:** See `specs/006-unmock-ai-integration/`

---

**Last Updated:** 2025-11-06
**Enforcement Level:** High (automated pre-commit validation)
**Next Review:** After 10 features implemented
