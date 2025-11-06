# OmniAds Speckit Constitution

## Core Principles

### I. Technology Stack Adherence

**All features must use the approved OmniAds technology stack:**

**Backend:**
- Framework: NestJS 10.3.0+ (TypeScript)
- Database: PostgreSQL 14+ with TypeORM 0.3.19+
- Authentication: JWT + Passport.js + bcrypt
- AI Integration: Anthropic Claude API (@anthropic-ai/sdk) or OpenAI API
- Testing: Jest 30.2.0+
- Code Quality: ESLint + Prettier + Husky pre-commit hooks

**Frontend:**
- Framework: React 18.2.0+ with TypeScript 5.3.3+
- Build Tool: Vite 5.0.11+
- UI Library: shadcn/ui (Radix UI) + Tailwind CSS 3.4.1+
- Charts: Recharts 2.10.3+
- State Management: Zustand 4.4.7+
- Routing: React Router v6.21.1+
- Testing: Vitest 4.0.7+ + React Testing Library 16.3.0+

**Rationale**: Consistency across the codebase ensures maintainability, easier onboarding, and reduces technical debt. No deviations unless approved by team consensus.

### II. Unit Testing (NON-NEGOTIABLE)

**Every feature must include comprehensive unit tests:**

- **Mandatory Coverage**: 80%+ statements, 75%+ branches, 80%+ functions, 80%+ lines
- **Test-Driven Development**: Write tests before implementation when possible
- **Test Isolation**: No shared state between tests
- **Mock External Dependencies**: All external APIs and services must be mocked
- **Test Templates**: Use provided templates in `backend/test-templates/` and `frontend/test-templates/`
- **Pre-commit Hooks**: Tests run automatically before commit; commit blocked if tests fail

**Test Types Required:**
- **Service Layer**: Unit tests for all business logic
- **Controller Layer**: Unit tests for all HTTP endpoints
- **Components**: Unit tests for all React components
- **Integration Tests**: For inter-service communication and critical flows

**Rationale**: High test coverage prevents regressions, documents expected behavior, and enables confident refactoring. Tests are not optional.

### III. Documentation Updates (CONTINUOUS)

**All feature implementations must update documentation synchronously:**

**Required Documentation:**
- **spec.md**: Feature specification with user scenarios, acceptance criteria, requirements
- **plan.md**: Implementation plan with tech stack, architecture, and phased approach
- **tasks.md**: Task breakdown with acceptance criteria for each task
- **README.md**: Update feature list, architecture section, and API endpoints
- **Code Comments**: Document complex logic, algorithms, and non-obvious decisions
- **API Documentation**: Document all new endpoints with request/response examples

**Documentation Workflow:**
1. Create spec.md using `/speckit.spec` command
2. Generate plan.md using `/speckit.plan` command
3. Generate tasks.md using `/speckit.tasks` command
4. Update README.md after feature completion
5. Add inline code comments during implementation

**Rationale**: Documentation decay is prevented by making it part of the implementation process. Future developers (including yourself) will thank you.

### IV. Regression Testing & Quality Gates (MANDATORY)

**After every feature implementation, the following quality gates must pass:**

**Quality Gate Checklist:**
- [ ] **Unit Tests**: All new and existing unit tests pass (100% pass rate)
- [ ] **Coverage**: Coverage thresholds met (80%+ statements, 75%+ branches)
- [ ] **Feature Tests**: New feature functionality tested manually
- [ ] **Regression Tests**: All existing features tested (smoke test minimum)
- [ ] **Build**: Backend build succeeds (`npm run build` in backend/)
- [ ] **Build**: Frontend build succeeds (`npm run build` in frontend/)
- [ ] **Docker**: Docker Compose starts successfully (`docker compose up`)
- [ ] **Docker**: All services healthy and accessible
- [ ] **Linting**: No ESLint errors or warnings
- [ ] **Formatting**: Code formatted with Prettier

**Regression Test Scope:**
- Core authentication flows (login, registration)
- Dashboard KPIs and data loading
- AI recommendation generation
- Critical business flows (data sync, budget calculations)
- All implemented feature endpoints

**Build Verification:**
```bash
# Backend
cd backend && npm run build && npm test

# Frontend
cd frontend && npm run build && npm test

# Docker
docker compose up --build -d
docker compose ps  # All services should be 'Up' and 'healthy'
curl http://localhost:3000/health  # Backend health check
curl http://localhost:5173  # Frontend health check
```

**Rationale**: Catching regressions early prevents cascading failures and maintains system stability. Docker validation ensures production-like environment works.

### V. Sequential Feature Development (WITH AUTOMATION)

**Features must be implemented one at a time in sequential order:**

**Development Flow:**
1. **Select Next Feature**: Always work on the next unimplemented feature in priority order
2. **Create Specification**: Run `/speckit.spec` to create spec.md
3. **Generate Plan**: Run `/speckit.plan` to create plan.md
4. **Generate Tasks**: Run `/speckit.tasks` to create tasks.md
5. **Implement**: Code the feature following tasks.md
6. **Test**: Write and run unit tests
7. **Document**: Update README.md and code comments
8. **Quality Gates**: Pass all quality gates
9. **Commit**: Commit with descriptive message
10. **Auto-Continue**: Automatically proceed to next feature if batch requested

**Auto-Continue Rule**: If the user requests "implement all pending features" or "implement features 10-20", the agent should automatically proceed to the next feature after completing the current one **without asking for permission**. Only stop when all requested features are complete or an error occurs.

**Rationale**: Sequential development prevents merge conflicts and ensures each feature is fully complete before moving on. Auto-continue reduces friction and enables bulk implementation.

### VI. Code Quality & Best Practices

**All code must follow OmniAds coding standards:**

**TypeScript Standards:**
- Strict mode enabled (`strict: true` in tsconfig.json)
- No `any` types (use `unknown` or proper typing)
- Explicit return types on functions
- Use interfaces over types for object shapes
- Use enums for constants with multiple values

**NestJS Standards:**
- Modular architecture (one feature = one module)
- Dependency injection for all services
- DTOs (Data Transfer Objects) for all API inputs/outputs with class-validator
- Repository pattern for database access
- Exception filters for error handling

**React Standards:**
- Functional components with hooks (no class components)
- Custom hooks for reusable logic
- Props interfaces for all components
- Avoid prop drilling (use context/Zustand for deep state)
- Memoization for expensive computations (useMemo, useCallback)

**Security Standards:**
- Input validation on all endpoints (class-validator)
- SQL injection protection (TypeORM parameterized queries)
- XSS protection (React auto-escaping, sanitize user input)
- JWT authentication on all protected endpoints
- Environment variables for secrets (never hardcode)

**Rationale**: Consistent code quality reduces bugs, improves readability, and makes collaboration easier.

### VII. Speckit Workflow Integration

**All features must follow the Speckit workflow:**

**Prerequisite Checks (Enforced by `.specify/scripts/bash/check-prerequisites.sh`):**
- [ ] spec.md exists
- [ ] plan.md exists (if in implementation phase)
- [ ] tasks.md exists (if in implementation phase)
- [ ] Constitution has been read and understood
- [ ] Tech stack matches constitution

**Speckit Commands:**
- `/speckit.spec`: Create feature specification
- `/speckit.plan`: Generate implementation plan
- `/speckit.tasks`: Generate task breakdown
- `/speckit.check`: Validate prerequisites

**Workflow:**
```
User Request → Create spec.md → Generate plan.md → Generate tasks.md →
Implement → Test → Document → Quality Gates → Commit → Next Feature
```

**Rationale**: Speckit workflow ensures consistency, traceability, and completeness of all features.

## Technology Stack Details

### Approved Dependencies

**Backend (NestJS):**
- Core: `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
- Database: `typeorm`, `pg` (PostgreSQL)
- Auth: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`
- AI: `@anthropic-ai/sdk`, `openai`, `zod`
- Testing: `jest`, `@nestjs/testing`
- Validation: `class-validator`, `class-transformer`
- Utils: `date-fns`, `lodash`

**Frontend (React):**
- Core: `react`, `react-dom`, `react-router-dom`
- UI: `@radix-ui/react-*`, `tailwindcss`, `lucide-react`
- State: `zustand`
- Charts: `recharts`
- Testing: `vitest`, `@testing-library/react`, `@testing-library/user-event`
- Utils: `date-fns`, `clsx`, `tailwind-merge`

**Infrastructure:**
- Docker & Docker Compose
- PostgreSQL 14+
- Redis (for caching)
- Node.js 18+

### Forbidden Practices

**Never do the following:**
- ❌ Use `any` type in TypeScript
- ❌ Commit `.env` files
- ❌ Skip tests (`git commit --no-verify`)
- ❌ Use `console.log` in production code (use proper logging)
- ❌ Hardcode secrets, API keys, or credentials
- ❌ Create class components in React (use functional + hooks)
- ❌ Directly mutate state in React (use setState/Zustand actions)
- ❌ Skip quality gates
- ❌ Implement features without spec.md, plan.md, tasks.md

## Development Workflow

### Phase 1: Specification (REQUIRED)

1. **Read Feature Requirements**: Understand what the feature should do
2. **Create spec.md**: Use `/speckit.spec` to create detailed specification
   - User scenarios with priorities (P1-P3)
   - Acceptance criteria (Given-When-Then)
   - Functional & non-functional requirements
   - Key entities and database schema
   - Success metrics

### Phase 2: Planning (REQUIRED)

3. **Generate plan.md**: Use `/speckit.plan` to create implementation plan
   - Tech stack selection (from approved stack)
   - Architecture design
   - Database entities
   - API endpoints
   - Phased implementation strategy
   - Testing strategy

### Phase 3: Task Breakdown (REQUIRED)

4. **Generate tasks.md**: Use `/speckit.tasks` to create task list
   - Break down into small, testable tasks
   - Define acceptance criteria for each task
   - Estimate complexity
   - Identify dependencies

### Phase 4: Implementation

5. **Setup Module Structure**: Create NestJS module, service, controller
6. **Create Database Entities**: Define TypeORM entities
7. **Write Tests First**: Create test files with failing tests (TDD)
8. **Implement Business Logic**: Write service layer code
9. **Implement API Endpoints**: Write controller code
10. **Create Frontend Components**: Implement React UI
11. **Integration**: Wire up frontend to backend
12. **Manual Testing**: Test feature end-to-end

### Phase 5: Quality Assurance

13. **Run Unit Tests**: Ensure all tests pass
14. **Check Coverage**: Verify coverage thresholds met
15. **Run Linter**: Fix all ESLint errors/warnings
16. **Format Code**: Run Prettier
17. **Build Verification**: Build backend and frontend
18. **Docker Verification**: Test with Docker Compose
19. **Regression Testing**: Test all existing features

### Phase 6: Documentation & Commit

20. **Update README.md**: Add feature to feature list, add API endpoints
21. **Update Code Comments**: Document complex logic
22. **Commit Changes**: Use descriptive commit message
23. **Push to Branch**: Push to feature branch

### Phase 7: Continuation

24. **Proceed to Next Feature**: If batch implementation, automatically continue

## Quality Standards

### Test Coverage Requirements

**Minimum Coverage (Enforced):**
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

**Coverage is checked automatically by:**
- Jest (backend): `npm run test:cov`
- Vitest (frontend): `npm run test:coverage`
- Pre-commit hooks

### Build Standards

**All builds must succeed without errors:**
- Backend: `cd backend && npm run build`
- Frontend: `cd frontend && npm run build`

**Build failures are NOT acceptable and must be fixed immediately.**

### Docker Standards

**All services must start successfully:**
```bash
docker compose up --build -d
docker compose ps  # All services 'Up' and 'healthy'
```

**Health checks must pass:**
- Backend: `http://localhost:3000/health`
- Frontend: `http://localhost:5173`
- Database: PostgreSQL on port 5432

## Governance

### Constitution Authority

This constitution supersedes all other development practices and guidelines. All team members and AI agents must follow these principles without exception.

### Amendment Process

To amend this constitution:
1. Document proposed change with rationale
2. Discuss with team and reach consensus
3. Update constitution with version bump
4. Update Last Amended date
5. Communicate changes to all team members

### Compliance

**All PRs/commits must verify compliance with this constitution:**
- Prerequisite checks pass (`.specify/scripts/bash/check-prerequisites.sh`)
- All quality gates pass
- Documentation updated
- Tests pass with coverage thresholds met

**Non-compliance consequences:**
- PR rejected
- Commit reverted
- Feature implementation paused until compliant

### Exceptions

Exceptions to this constitution require:
- Written justification with technical reasoning
- Team consensus approval
- Documentation of exception in code and spec
- Plan to remove exception in future

**No exceptions for:**
- Test coverage requirements
- Security standards
- Documentation requirements
- Quality gates

## Version History

**Version**: 1.0.0
**Ratified**: 2025-11-05
**Last Amended**: 2025-11-05

**Changes:**
- Initial constitution creation
- Defined core principles (7 principles)
- Established technology stack requirements
- Defined quality gates and testing requirements
- Established Speckit workflow integration
- Created governance and compliance rules
