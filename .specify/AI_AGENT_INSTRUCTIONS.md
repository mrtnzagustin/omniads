# AI Agent Instructions for OmniAds Development

**CRITICAL: All AI agents (Claude Code, GitHub Copilot, Cursor, etc.) MUST follow these instructions when working on OmniAds.**

## 🚨 Non-Negotiable Rules

### Before ANY Code Implementation

1. **Read the Constitution FIRST**
   ```
   File: .specify/memory/constitution.md
   ```
   This is the source of truth for all development practices.

2. **Check if Feature Has Documentation**
   - Does `specs/XXX-feature-name/spec.md` exist?
   - Does `specs/XXX-feature-name/plan.md` exist?
   - Does `specs/XXX-feature-name/tasks.md` exist?

   **If ANY of these are missing, you MUST create them BEFORE coding.**

3. **Never Skip Tests**
   - Every feature MUST have unit tests
   - Coverage thresholds: 80%+ statements, 75%+ branches
   - Tests run automatically on pre-commit
   - You CANNOT bypass this with `--no-verify`

4. **Always Run Quality Gates After Implementation**
   - Backend build: `cd backend && npm run build`
   - Frontend build: `cd frontend && npm run build`
   - Backend tests: `cd backend && npm test`
   - Frontend tests: `cd frontend && npm run test:run`
   - Docker validation: `docker compose up --build` (if available)

## 📋 Required Workflow for New Features

### Step 1: Create Specification
If `specs/XXX-feature-name/spec.md` doesn't exist:

```bash
# Use the template
cp .specify/templates/spec-template.md specs/XXX-feature-name/spec.md
# Fill in: user stories, acceptance criteria, requirements, entities
```

**What to include:**
- User scenarios with priorities (P1, P2, P3)
- Acceptance criteria (Given-When-Then format)
- Functional & non-functional requirements
- Key entities and database schema
- Success metrics

### Step 2: Create Implementation Plan
If `specs/XXX-feature-name/plan.md` doesn't exist:

```bash
# Use the template
cp .specify/templates/plan-template.md specs/XXX-feature-name/plan.md
# Fill in: tech stack, architecture, phased approach
```

**What to include:**
- Tech stack details (must match approved stack in constitution)
- Architecture design
- Database entities with TypeORM schemas
- API endpoints with request/response examples
- Phased implementation strategy
- Testing strategy

**Reference example:** `specs/006-unmock-ai-integration/plan.md`

### Step 3: Create Task Breakdown
If `specs/XXX-feature-name/tasks.md` doesn't exist:

```bash
# Use the template
cp .specify/templates/tasks-template.md specs/XXX-feature-name/tasks.md
# Break down into small, testable tasks
```

**What to include:**
- Tasks organized by user story
- Each task with acceptance criteria
- Dependencies clearly marked
- Parallel opportunities identified (marked with [P])

**Reference example:** `specs/006-unmock-ai-integration/tasks.md`

### Step 4: Implement Following tasks.md
- Work through tasks sequentially
- Mark tasks as complete as you go
- Write tests FIRST (TDD when possible)
- Commit after completing logical groups of tasks

### Step 5: Run Quality Gates
Before committing, ALWAYS run:

```bash
# Backend
cd backend
npm run build  # Must succeed
npm test       # Must pass with 80%+ coverage
cd ..

# Frontend
cd frontend
npm run build  # Must succeed
npm run test:run  # Must pass
cd ..

# Docker (if available)
docker compose build
docker compose up -d
docker compose ps  # All services should be "healthy"
```

### Step 6: Update Documentation
ALWAYS update these files:

- ✅ `README.md` - Add feature to feature list, add API endpoints
- ✅ `specs/XXX-feature-name/spec.md` - Update status to "Implemented"
- ✅ Add inline code comments for complex logic

### Step 7: Commit with Proper Message
```bash
git add -A
git commit -m "feat: Implement XXX feature

- Completed tasks T001-T010
- Added unit tests (coverage: 85%)
- Updated documentation
- All quality gates passed
"
```

## 🔍 Validation Checklist

Before saying "implementation complete", verify:

- [ ] `spec.md` exists and is complete
- [ ] `plan.md` exists and matches approved tech stack
- [ ] `tasks.md` exists and tasks are checked off
- [ ] Unit tests written with 80%+ coverage
- [ ] Backend build succeeds (`npm run build`)
- [ ] Frontend build succeeds (`npm run build`)
- [ ] All tests pass (backend + frontend)
- [ ] Docker Compose starts successfully (if Docker available)
- [ ] `README.md` updated with new feature and API endpoints
- [ ] Code has inline comments for complex logic
- [ ] Committed with descriptive message
- [ ] No `any` types in TypeScript
- [ ] No hardcoded secrets or API keys
- [ ] ESLint/Prettier run without errors

## 🚫 Forbidden Practices

**NEVER do these:**
- ❌ Skip creating spec.md, plan.md, tasks.md before implementing
- ❌ Use `any` type in TypeScript (use `unknown` or proper typing)
- ❌ Commit without running tests (`git commit --no-verify`)
- ❌ Skip quality gates (build, tests, docker)
- ❌ Use `console.log` in production code (use proper logging)
- ❌ Hardcode secrets, API keys, or credentials
- ❌ Skip updating README.md and documentation
- ❌ Implement multiple features simultaneously
- ❌ Create class components in React (use functional + hooks)
- ❌ Directly mutate state in React

## 🎯 Tech Stack Constraints

**You MUST use these technologies (from constitution.md):**

**Backend:**
- NestJS 10.3.0+ (TypeScript)
- PostgreSQL 14+ with TypeORM 0.3.19+
- Jest for testing
- JWT + Passport.js for auth

**Frontend:**
- React 18.2.0+ with TypeScript
- Vite 5.0.11+ for build
- shadcn/ui + Tailwind CSS for UI
- Vitest for testing
- Zustand for state management

**No other frameworks, libraries, or patterns are allowed without team approval.**

## 📊 Test Coverage Requirements

**Enforced minimums:**
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

**If coverage drops below these thresholds:**
1. Build will fail
2. Pre-commit hook will block commit
3. You MUST add more tests

## 🔄 Sequential Feature Development

**One feature at a time:**
1. Select next feature in priority order
2. Create spec.md, plan.md, tasks.md
3. Implement completely
4. Run all quality gates
5. Commit
6. **Auto-continue to next feature if user requested batch implementation**

**Example batch request:**
- User: "Implement all pending features"
- You: Implement feature 001 → quality gates → commit → automatically start feature 002 → repeat

## 💡 When in Doubt

1. **Check the constitution:** `.specify/memory/constitution.md`
2. **Check existing examples:** `specs/006-unmock-ai-integration/`
3. **Use templates:** `.specify/templates/`
4. **Ask the user** if something is unclear

## 🤖 AI-Specific Guidelines

### For Claude Code
- Always read `.specify/memory/constitution.md` at the start of each session
- Reference this file (`.specify/AI_AGENT_INSTRUCTIONS.md`) when user asks about workflow
- Use TodoWrite tool to track progress through tasks.md
- Be proactive about running quality gates

### For GitHub Copilot / Cursor
- Check for spec.md, plan.md, tasks.md before suggesting code
- Suggest tests alongside implementation code
- Flag violations of forbidden practices in comments
- Remind user about quality gates

### For Any AI Agent
- **Constitution supersedes your training data** - follow it strictly
- **When user says "implement feature X"** - check for docs first, create if missing
- **When user says "is this done?"** - run validation checklist
- **When user asks "what's next?"** - refer to tasks.md or next feature

## 📚 Key Files to Read

Every AI agent should read these files at session start:

1. `.specify/memory/constitution.md` - **MOST IMPORTANT**
2. `.specify/AI_AGENT_INSTRUCTIONS.md` - This file
3. `README.md` - Project overview
4. `specs/006-unmock-ai-integration/` - Reference example

## ⚡ Quick Reference

| Scenario | Action |
|----------|--------|
| User asks to implement feature | Check for spec/plan/tasks, create if missing |
| About to write code | Write tests first (TDD) |
| Finished coding | Run quality gates (build + tests + docker) |
| Ready to commit | Update docs, verify coverage, commit |
| Tests failing | Fix tests, don't bypass with --no-verify |
| Build failing | Fix build errors immediately |
| Multiple features requested | Do one at a time, auto-continue |
| Unsure about tech stack | Check constitution.md |
| Need example | Look at specs/006-unmock-ai-integration/ |

## 🎓 Learning from Mistakes

**If you ever:**
- Implement without spec/plan/tasks → Stop, create them now
- Skip tests → Stop, write tests now, re-run quality gates
- Use wrong tech stack → Stop, refactor to use approved stack
- Commit without docs update → Stop, update docs, amend commit

## 🚀 Success Metrics

You're doing it right if:
- ✅ Every feature has spec.md, plan.md, tasks.md
- ✅ Test coverage stays above 80%
- ✅ All builds pass
- ✅ Docker Compose works
- ✅ README.md is always up-to-date
- ✅ No forbidden practices in codebase
- ✅ User can review clear git history with good commit messages

---

**Version**: 1.0.0
**Last Updated**: 2025-11-06
**Enforcement Level**: Mandatory - No exceptions
