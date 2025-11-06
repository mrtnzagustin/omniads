# Speckit: Specification-Driven Development for OmniAds

**Version**: 1.0.0
**Last Updated**: 2025-11-06

## Overview

Speckit is a structured workflow framework for developing features on the OmniAds platform. It ensures that every feature is thoroughly specified, planned, and broken down into tasks **before** implementation begins.

This approach prevents scope creep, reduces bugs, improves collaboration, and creates comprehensive documentation that lives alongside the code.

## Core Workflow

```
📝 spec.md → 📐 plan.md → ✅ tasks.md → 💻 Implementation → 🧪 Testing → 📚 Documentation
```

**You cannot skip any step in this workflow.**

### Workflow Stages

1. **Specification (`spec.md`)** - Define what the feature does and why
2. **Planning (`plan.md`)** - Design how the feature will be implemented
3. **Task Breakdown (`tasks.md`)** - Break down into granular, testable tasks
4. **Implementation** - Write code following the task list
5. **Testing** - Write tests (80%+ coverage required)
6. **Documentation** - Update README and add code comments

## Required Structure

Every feature must have a directory in `specs/` with three required files:

```
specs/
  XXX-feature-name/
    spec.md       # Feature specification (REQUIRED)
    plan.md       # Implementation plan (REQUIRED)
    tasks.md      # Task breakdown (REQUIRED)
```

### Why Three Files?

- **spec.md** - Ensures we understand the problem before solving it
- **plan.md** - Ensures we design the solution before coding it
- **tasks.md** - Ensures we break down work before starting it

This prevents rework, reduces bugs, and creates living documentation.

## Getting Started

### 1. Create a New Feature Specification

Use the `/speckit-new` Claude command:

```bash
/speckit-new
```

This command will:
1. Ask for feature number, name, and description
2. Create the `specs/XXX-feature-name/` directory
3. Generate a comprehensive `spec.md` file
4. Work with you to fill in all sections

#### What goes in spec.md?

- **Overview**: What the feature does (2-3 paragraphs)
- **Problem Statement**: Current state, desired state, consequences of not implementing
- **User Personas**: How advertisers, publishers, admins will use it
- **Functional Requirements**: User stories with Given-When-Then acceptance criteria
- **Non-Functional Requirements**: Performance, security, scalability, i18n, accessibility
- **API Specifications**: Endpoints, request/response schemas, authentication, errors
- **AI/ML Specifications**: If applicable - prompts, models, inputs/outputs
- **Edge Cases & Error Handling**: Specific failure scenarios + detection + recovery
- **Testing Strategy**: Unit, integration, E2E, accessibility, load tests
- **Success Metrics**: Quantitative and qualitative measures
- **Dependencies**: Internal features, external services, migrations needed
- **Open Questions**: Unresolved items requiring clarification

### 2. Generate Implementation Plan

Once `spec.md` is complete, generate the plan:

```bash
/speckit-plan
```

This command will:
1. Read your `spec.md`
2. Read the constitution for tech stack compliance
3. Generate a detailed `plan.md` file

#### What goes in plan.md?

- **Technical Architecture**: Backend modules, database schema, frontend components
- **Database Design**: TypeORM entities, relationships, indexes, migrations
- **API Endpoints**: Full endpoint documentation with DTOs and validation
- **Implementation Phases**: Sequential phases from database → backend → frontend → testing
- **Dependencies**: External, internal, and feature dependencies
- **Risk Assessment**: Technical, integration, timeline risks + mitigation strategies
- **Testing Strategy**: Unit, integration, E2E with coverage targets
- **Success Criteria**: Functional, technical, performance, quality
- **Timeline Estimate**: Time per phase, total effort, parallel opportunities

### 3. Generate Task Breakdown

Once `plan.md` is complete, generate the tasks:

```bash
/speckit-tasks
```

This command will:
1. Read your `spec.md` and `plan.md`
2. Break down the plan into granular, testable tasks
3. Generate a detailed `tasks.md` file

#### What goes in tasks.md?

- **Task Organization**: Tasks grouped by implementation phase
- **Task Details**: ID, type, description, time estimate, dependencies, acceptance criteria
- **Testing Tasks**: Explicit testing tasks for every implementation task
- **Time Estimates**: Realistic estimates (2-8 hours per task)
- **Milestones**: M1, M2, M3 with deliverables
- **Implementation Notes**: Recommended order, pitfalls, references

### 4. Validate Structure

Before starting implementation, validate that all files exist:

```bash
/speckit-validate
```

Or run the script directly:

```bash
bash scripts/check-speckit.sh
```

This will check:
- ✓ Constitution exists
- ✓ All specs have `spec.md`, `plan.md`, `tasks.md`
- ✗ Report any missing files with remediation steps

## Enforcement Mechanisms

Speckit compliance is enforced through three layers:

### 1. Manual Validation

Run the validation script manually:

```bash
bash scripts/check-speckit.sh
```

Use before committing to ensure compliance.

### 2. Git Pre-Commit Hooks

Pre-commit hooks will be added to:
- Run `scripts/check-speckit.sh`
- Block commits if validation fails
- Ensure you can't skip the workflow

*(Note: Hooks not yet implemented - coming soon)*

### 3. GitHub Actions

The `.github/workflows/speckit-validation.yml` workflow runs on:
- All pull requests modifying `specs/`, `backend/`, or `frontend/`
- All pushes to `main` or `develop` branches

It validates:
- ✓ Speckit structure (all required files exist)
- ✓ Constitution exists and is complete
- ✓ Implementation changes have corresponding spec documentation
- ✓ No forbidden dependencies (tech stack compliance)
- ✓ New implementation files have tests

**Pull requests will fail if validation does not pass.**

## Claude Commands Reference

Speckit provides four Claude commands to streamline the workflow:

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/speckit-new` | Create new feature specification | Starting a new feature |
| `/speckit-plan` | Generate implementation plan | After spec.md is complete |
| `/speckit-tasks` | Generate task breakdown | After plan.md is complete |
| `/speckit-validate` | Validate all specs | Before committing, in CI/CD |

### Command Details

#### `/speckit-new`
- Creates `specs/XXX-feature-name/` directory
- Generates comprehensive `spec.md` from template
- Works interactively to fill in all sections
- Automatically runs `/speckit-plan` and `/speckit-tasks` when done

#### `/speckit-plan`
- Reads `spec.md` and constitution
- Generates detailed `plan.md`
- Ensures tech stack compliance
- Includes architecture, database schema, API specs, phases, risks, testing

#### `/speckit-tasks`
- Reads `spec.md` and `plan.md`
- Generates granular `tasks.md` with 2-8 hour tasks
- Includes acceptance criteria and dependencies
- Adds explicit testing tasks for every implementation task

#### `/speckit-validate`
- Runs `scripts/check-speckit.sh`
- Reports missing files
- Offers remediation steps
- Shows summary of all specs

## Success Requirements

Before marking a feature as complete, verify:

### Documentation
- [ ] `spec.md` exists and is complete
- [ ] `plan.md` exists with all sections filled
- [ ] `tasks.md` exists with all tasks checked off
- [ ] `README.md` updated with feature and API endpoints
- [ ] Code has inline comments for complex logic

### Testing
- [ ] Unit tests written for all business logic
- [ ] Test coverage >80% statements, >75% branches
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows
- [ ] All tests pass

### Build & Deployment
- [ ] Backend build succeeds (`cd backend && npm run build`)
- [ ] Frontend build succeeds (`cd frontend && npm run build`)
- [ ] Docker Compose starts successfully (`docker compose up`)
- [ ] All services healthy
- [ ] No ESLint errors or warnings

### Code Quality
- [ ] No `any` types in TypeScript
- [ ] Explicit return types on functions
- [ ] Input validation on all endpoints (class-validator)
- [ ] JWT authentication on protected endpoints
- [ ] No hardcoded secrets or API keys

### Compliance
- [ ] Tech stack matches constitution
- [ ] Follows NestJS best practices (modules, DI, DTOs)
- [ ] Follows React best practices (functional components, hooks)
- [ ] Security standards met (input validation, auth, RBAC)

## Key Principles

### 1. Spec Before Code
**Never write code without completing spec.md, plan.md, and tasks.md first.**

This ensures:
- Clear requirements before implementation
- Thought-through architecture
- Realistic timeline estimates
- Comprehensive testing strategy

### 2. One Feature at a Time
**Work on features sequentially, not in parallel.**

This ensures:
- Focused effort
- Complete features (not half-done)
- No merge conflicts
- Easier code review

### 3. Test Everything
**Every feature must have 80%+ test coverage.**

This ensures:
- Bugs caught early
- Confidence in refactoring
- Regression prevention
- Documentation of expected behavior

### 4. Document as You Go
**Update documentation synchronously with code.**

This ensures:
- README always up-to-date
- API documentation accurate
- Complex logic explained
- Future developers can understand your work

## Tech Stack Compliance

All features **must** use the approved OmniAds technology stack defined in `.specify/memory/constitution.md`:

### Backend
- NestJS 10.3.0+ (TypeScript)
- PostgreSQL 14+ with TypeORM 0.3.19+
- JWT + Passport.js + bcrypt for authentication
- Anthropic Claude API or OpenAI API for AI features
- Jest 30.2.0+ for testing

### Frontend
- React 18.2.0+ with TypeScript 5.3.3+
- Vite 5.0.11+ for build tool
- shadcn/ui (Radix UI) + Tailwind CSS 3.4.1+ for UI
- Recharts 2.10.3+ for charts
- Zustand 4.4.7+ for state management
- Vitest 4.0.7+ for testing

**No deviations without team approval.**

The GitHub Actions workflow will flag forbidden dependencies (e.g., Express, Redux, Mongoose) and fail the build.

## Common Workflows

### Starting a New Feature

```bash
# 1. Create specification
/speckit-new

# 2. Fill in spec.md interactively with Claude
# (Claude will guide you through all sections)

# 3. Generate plan
/speckit-plan

# 4. Generate tasks
/speckit-tasks

# 5. Validate structure
bash scripts/check-speckit.sh

# 6. Start implementing
# Work through tasks.md sequentially
```

### Adding Plan to Existing Spec

```bash
# If you have spec.md but no plan.md
cd specs/XXX-feature-name/
/speckit-plan
```

### Adding Tasks to Existing Spec+Plan

```bash
# If you have spec.md and plan.md but no tasks.md
cd specs/XXX-feature-name/
/speckit-tasks
```

### Validating All Specs

```bash
# Run from repository root
bash scripts/check-speckit.sh

# Or use Claude command
/speckit-validate
```

## Troubleshooting

### "ERROR: Feature directory not found"
**Solution**: Run `/speckit-new` to create the feature structure first.

### "ERROR: plan.md not found"
**Solution**: Run `/speckit-plan` to generate the implementation plan.

### "ERROR: tasks.md not found"
**Solution**: Run `/speckit-tasks` to generate the task breakdown.

### "ERROR: Constitution missing"
**Solution**: Ensure `.specify/memory/constitution.md` exists and is not empty.

### "ERROR: Implementation changes without spec docs" (GitHub Actions)
**Solution**: Before implementing, ensure `plan.md` and `tasks.md` exist in the corresponding spec directory.

### "ERROR: Forbidden dependency detected" (GitHub Actions)
**Solution**: Remove the forbidden dependency and use an approved alternative from the constitution.

## Templates

Templates for creating new documents are available in `.specify/templates/`:

- `spec-template.md` - Feature specification template
- `plan-template.md` - Implementation plan template
- `tasks-template.md` - Task breakdown template

These are used automatically by the Claude commands.

## File Locations

```
.specify/
  memory/
    constitution.md              # Project constitution (tech stack, standards)
  templates/
    spec-template.md            # Spec template
    plan-template.md            # Plan template
    tasks-template.md           # Tasks template
  scripts/
    bash/
      check-prerequisites.sh    # Prerequisite checking
      generate-spec-docs.sh     # Spec generation
  README.md                     # This file

.claude/
  commands/
    speckit-new.md              # /speckit-new command
    speckit-plan.md             # /speckit-plan command
    speckit-tasks.md            # /speckit-tasks command
    speckit-validate.md         # /speckit-validate command

.github/
  workflows/
    speckit-validation.yml      # GitHub Actions validation

scripts/
  check-speckit.sh              # Root-level validation script

specs/
  XXX-feature-name/
    spec.md                     # Feature specification
    plan.md                     # Implementation plan
    tasks.md                    # Task breakdown
```

## Best Practices

### For Specifications (spec.md)

- **Be specific**: "Response time <500ms" not "fast response"
- **Use Given-When-Then**: For all acceptance criteria
- **Include edge cases**: Think about failure scenarios
- **Define success metrics**: How will you know it works?

### For Plans (plan.md)

- **Be realistic**: Don't underestimate complexity
- **Show dependencies**: What must be done first?
- **Include migrations**: Database changes need up/down scripts
- **Document risks**: What could go wrong? How to mitigate?

### For Tasks (tasks.md)

- **Keep tasks small**: 2-8 hours each
- **Be granular**: Each task should be a single, testable unit
- **Include tests**: Explicit testing tasks for everything
- **Mark dependencies**: What must be done first?

### For Implementation

- **Follow tasks.md**: Work through tasks sequentially
- **Check off tasks**: As you complete them
- **Write tests first**: TDD when possible
- **Commit frequently**: After logical groups of tasks

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-06 | Initial Speckit framework implementation |

## Support

For questions or issues with Speckit:

1. **Read the Constitution**: `.specify/memory/constitution.md`
2. **Check Examples**: Look at existing complete specs in `specs/`
3. **Use Validation**: Run `bash scripts/check-speckit.sh`
4. **Ask Claude**: Use the `/speckit-*` commands for guidance

---

**Remember: Spec-driven development is about doing it right the first time, not doing it fast.**

Comprehensive specifications prevent rework, reduce bugs, and create documentation that helps everyone—now and in the future.
