# Generate Task Breakdown

You are creating a detailed task breakdown (tasks.md) for implementing an OmniAds feature.

## Prerequisites

Before running this command:
1. `spec.md` must exist and be complete
2. `plan.md` must exist and be complete
3. You must have read both documents thoroughly

## Process

### 1. Read Required Documents
```bash
# Read the specification
cat specs/XXX-feature-name/spec.md

# Read the implementation plan
cat specs/XXX-feature-name/plan.md

# Use the tasks template
cat .specify/templates/tasks-template.md
```

### 2. Generate Granular Task List

Create a comprehensive tasks.md file with:

#### A. Task Organization
Organize tasks by implementation phase (from plan.md):
- **Phase 1: Database & Backend Foundation**
- **Phase 2: Business Logic & Services**
- **Phase 3: API Endpoints & Controllers**
- **Phase 4: Frontend Components & UI**
- **Phase 5: Integration & Testing**
- **Phase 6: Documentation & Deployment**

#### B. Task Structure
Each task must include:
- **Task ID**: Unique identifier (e.g., T001, T002)
- **Type**: Database | Backend | Frontend | Testing | Documentation | DevOps
- **Description**: Clear, specific action to take
- **Time Estimate**: 0.5-2 days per task (break down if larger)
- **Dependencies**: Which tasks must complete first
- **Acceptance Criteria**: Checkboxes with measurable completion criteria
- **Definition of Done**: What "complete" means for this task

#### C. Task Granularity
Break down into small, testable tasks:
- Each task should be completable in 2-8 hours
- No task should span multiple layers (database, services, frontend)
- Each task should have clear, testable output

Example task structure:
```markdown
### T001: Create Campaign Entity

**Type**: Database
**Time Estimate**: 0.5 days
**Dependencies**: None
**Acceptance Criteria**:
- [ ] TypeORM entity created with all columns
- [ ] Relationships defined (@ManyToOne to Advertiser)
- [ ] Indexes added for name and status columns
- [ ] Migration script created (up/down)
- [ ] Migration tested locally

**Definition of Done**:
- Entity file exists at `backend/src/entities/campaign.entity.ts`
- Migration file exists in `backend/src/migrations/`
- `npm run migration:run` succeeds
- `npm run migration:revert` succeeds
```

#### D. Coverage Requirements
Ensure tasks cover ALL layers:
- **Database**: Entities, migrations, indexes
- **Backend Services**: Business logic, validation, error handling
- **Backend Controllers**: API endpoints, DTOs, auth guards
- **Frontend Components**: UI components, forms, layouts
- **State Management**: Zustand stores, actions, selectors
- **Testing**: Unit tests (>80% coverage), integration tests, E2E tests
- **Documentation**: API docs, code comments, README updates

#### E. Testing Tasks (Non-Negotiable)
Include explicit testing tasks:
- **Unit Tests**: For every service, controller, component
  - Backend: Jest tests with 80%+ coverage
  - Frontend: Vitest tests with 80%+ coverage
- **Integration Tests**: For API endpoints and database operations
- **E2E Tests**: For critical user flows
- **Accessibility Tests**: WCAG compliance (if UI feature)

Example testing task:
```markdown
### T015: Write Campaign Service Unit Tests

**Type**: Testing
**Time Estimate**: 1 day
**Dependencies**: T010 (Campaign Service Implementation)
**Acceptance Criteria**:
- [ ] Test suite created at `backend/src/campaigns/campaigns.service.spec.ts`
- [ ] All public methods tested (create, update, delete, findAll, findOne)
- [ ] Edge cases tested (invalid input, not found, unauthorized)
- [ ] Mocks created for repository and external services
- [ ] Coverage >90% for campaign service
- [ ] All tests pass (`npm test`)

**Definition of Done**:
- `npm test` passes with no failures
- `npm run test:cov` shows >90% coverage for campaigns.service.ts
```

#### F. Time Estimates & Milestones
- Provide total time estimate in hours and days
- Define milestones (M1, M2, M3) with deliverables
- Identify tasks that can run in parallel (mark with [P])

#### G. Implementation Notes
Include guidance for developers:
- Recommended order of task execution
- Common pitfalls to avoid
- References to constitution.md standards
- Links to similar implemented features (if available)

## Task Template

Each task should follow this format:

```markdown
### T00X: [Task Title]

**Type**: [Database|Backend|Frontend|Testing|Documentation|DevOps]
**Time Estimate**: [0.5-2 days]
**Dependencies**: [T00Y, T00Z] or None
**Acceptance Criteria**:
- [ ] Specific, measurable criterion 1
- [ ] Specific, measurable criterion 2
- [ ] Specific, measurable criterion 3

**Definition of Done**:
- [Specific file/output exists]
- [Tests pass]
- [Build succeeds]
- [Coverage threshold met]
```

## Quality Standards

Every tasks.md must ensure:
- [ ] Database tasks include migration scripts
- [ ] Service tasks include unit tests (>80% coverage)
- [ ] API tasks include DTOs, validation, auth guards
- [ ] Frontend tasks include component tests
- [ ] Integration tests for critical flows
- [ ] Documentation tasks for API endpoints
- [ ] Build verification task (`npm run build` for backend + frontend)
- [ ] Docker verification task (`docker compose up`)

## Validation Checklist

Before finalizing tasks.md:
- [ ] All phases from plan.md have corresponding tasks
- [ ] Each task is 2-8 hours (0.25-1 day)
- [ ] All dependencies clearly marked
- [ ] Testing tasks for every implementation task
- [ ] Total estimate is realistic
- [ ] Definition of Done is specific and measurable
- [ ] Tasks align with constitution.md standards

## Output

Create `specs/XXX-feature-name/tasks.md` with:
1. All tasks organized by phase
2. Clear acceptance criteria for each task
3. Realistic time estimates
4. Dependencies mapped out
5. Testing integrated throughout
6. Total effort summary

## Reference Standards

From constitution.md:
- **Test Coverage**: 80%+ statements, 75%+ branches
- **Tech Stack**: NestJS, React, PostgreSQL, TypeORM
- **Code Quality**: No `any` types, explicit return types
- **Security**: JWT auth, input validation, RBAC
- **Build**: Both backend and frontend must build successfully
- **Docker**: All services must start and be healthy

---

**After generating tasks.md, the feature is ready for implementation. Remind the user to run all quality gates before committing.**
