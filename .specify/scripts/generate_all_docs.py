#!/usr/bin/env python3
"""
Automated Plan and Tasks Generator for OmniAds Features
Generates plan.md and tasks.md files for all features missing documentation
"""

import os
import re
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any

# Project root
PROJECT_ROOT = Path(__file__).parent.parent.parent
SPECS_DIR = PROJECT_ROOT / "specs"
CONSTITUTION_PATH = PROJECT_ROOT / ".specify" / "memory" / "constitution.md"

# Tech stack from constitution
TECH_STACK = {
    "backend": {
        "framework": "NestJS 10.3.0+",
        "database": "PostgreSQL 14+ with TypeORM 0.3.19+",
        "auth": "JWT + Passport.js + bcrypt",
        "ai": "Anthropic Claude API or OpenAI API",
        "testing": "Jest 30.2.0+",
    },
    "frontend": {
        "framework": "React 18.2.0+ with TypeScript 5.3.3+",
        "build": "Vite 5.0.11+",
        "ui": "shadcn/ui (Radix UI) + Tailwind CSS 3.4.1+",
        "charts": "Recharts 2.10.3+",
        "state": "Zustand 4.4.7+",
        "routing": "React Router v6.21.1+",
        "testing": "Vitest 4.0.7+ + React Testing Library 16.3.0+",
    }
}

def extract_feature_info(spec_path: Path) -> Dict[str, Any]:
    """Extract key information from spec.md"""
    with open(spec_path, 'r') as f:
        content = f.read()

    info = {
        "name": "",
        "number": "",
        "status": "Pending",
        "user_stories": [],
        "entities": [],
        "requirements": [],
    }

    # Extract feature name from title
    title_match = re.search(r'# Feature Specification: (.+)', content)
    if title_match:
        info["name"] = title_match.group(1)

    # Extract feature number from branch
    branch_match = re.search(r'\*\*Feature Branch\*\*: `\[(\d+)-', content)
    if branch_match:
        info["number"] = branch_match.group(1)

    # Extract status
    status_match = re.search(r'\*\*Status\*\*: (.+)', content)
    if status_match:
        info["status"] = status_match.group(1).strip()

    # Extract user stories
    user_story_pattern = r'### User Story \d+ - (.+?) \(Priority: (P\d)\)'
    for match in re.finditer(user_story_pattern, content):
        info["user_stories"].append({
            "title": match.group(1),
            "priority": match.group(2)
        })

    # Extract entities
    entity_section = re.search(r'### Key Entities.*?\n\n((?:- \*\*\w+\*\*:.+\n?)+)', content, re.DOTALL)
    if entity_section:
        entity_lines = entity_section.group(1).strip().split('\n')
        for line in entity_lines:
            entity_match = re.match(r'- \*\*(\w+)\*\*:', line)
            if entity_match:
                info["entities"].append(entity_match.group(1))

    # Extract functional requirements
    fr_pattern = r'- \*\*FR-\d+\*\*: (.+)'
    info["requirements"] = re.findall(fr_pattern, content)

    return info

def generate_plan_md(spec_info: Dict[str, Any], feature_dir: str) -> str:
    """Generate plan.md content"""
    feature_name_slug = feature_dir.split('/')[-1]
    today = datetime.now().strftime('%Y-%m-%d')

    plan = f"""# Implementation Plan: {spec_info['name']}

**Feature**: {feature_name_slug}
**Tech Stack**: NestJS, TypeScript, PostgreSQL, TypeORM, React, Vite, Tailwind CSS
**Created**: {today}
**Status**: {spec_info['status']}

## Overview

{spec_info['name']} - A comprehensive feature implementation following OmniAds architecture patterns and tech stack requirements.

## Architecture

### Backend Architecture

**Module Structure**:
```
backend/src/{feature_name_slug}/
├── {feature_name_slug}.module.ts
├── {feature_name_slug}.service.ts
├── {feature_name_slug}.controller.ts
├── dto/
│   ├── create-{feature_name_slug}.dto.ts
│   └── update-{feature_name_slug}.dto.ts
└── entities/
"""

    # Add entities
    for entity in spec_info['entities']:
        plan += f"    ├── {entity.lower()}.entity.ts\n"

    plan += """```

**Tech Stack**:
- Framework: NestJS 10.3.0+ (TypeScript)
- Database: PostgreSQL 14+ with TypeORM 0.3.19+
- Authentication: JWT + Passport.js
- Testing: Jest 30.2.0+

### Frontend Architecture

**Component Structure**:
```
frontend/src/
├── pages/
│   └── [FeaturePage].tsx
├── components/
│   └── [feature]/
│       ├── [FeatureList].tsx
│       ├── [FeatureDetail].tsx
│       └── [FeatureForm].tsx
└── lib/
    └── api/
        └── [feature].ts
```

**Tech Stack**:
- Framework: React 18.2.0+ with TypeScript 5.3.3+
- Build: Vite 5.0.11+
- UI: shadcn/ui + Tailwind CSS 3.4.1+
- State: Zustand 4.4.7+
- Testing: Vitest 4.0.7+ + React Testing Library

### Database Schema

**Entities**:

"""

    for entity in spec_info['entities']:
        plan += f"""#### {entity}

```typescript
@Entity('{entity.lower()}s')
export class {entity} {{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workspaceId: string;

  @ManyToOne(() => Workspace, workspace => workspace.id)
  workspace: Workspace;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}}
```

"""

    plan += """### API Endpoints

**Base Path**: `/api/v1/[feature-slug]`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List all items | JWT |
| GET | `/:id` | Get item by ID | JWT |
| POST | `/` | Create new item | JWT |
| PUT | `/:id` | Update item | JWT |
| DELETE | `/:id` | Delete item | JWT |
| POST | `/:id/process` | Execute feature action | JWT |

## Implementation Phases

### Phase 1: Database & Backend Foundation (Priority: P1)

**Objective**: Set up database entities and basic backend structure

**Tasks**:
1. Create TypeORM entities for all database models
2. Generate and run database migrations
3. Create NestJS module structure
4. Set up repository pattern for data access

**Testing**: Unit tests for entities and repositories

**Deliverable**: Database schema ready, backend module structure in place

---

### Phase 2: Business Logic & Services (Priority: P1)

**Objective**: Implement core business logic

**Tasks**:
1. Implement service layer with business logic
2. Add data validation and error handling
3. Implement required integrations
4. Add logging and monitoring

**Testing**: Service unit tests with 80%+ coverage

**Deliverable**: Fully functional service layer

---

### Phase 3: API Endpoints & Controllers (Priority: P1)

**Objective**: Expose functionality via REST API

**Tasks**:
1. Create DTOs for request/response validation
2. Implement controllers with all CRUD operations
3. Add authentication guards and RBAC
4. Add request/response interceptors
5. Document API endpoints

**Testing**: Controller unit tests, integration tests for endpoints

**Deliverable**: Complete REST API with authentication

---

### Phase 4: Frontend Components & UI (Priority: P2)

**Objective**: Build user interface

**Tasks**:
1. Create page layouts and routing
2. Build UI components using shadcn/ui
3. Implement forms with validation
4. Add state management with Zustand
5. Integrate with backend API
6. Add loading states and error handling

**Testing**: Component tests with Vitest and React Testing Library

**Deliverable**: Fully functional UI

---

### Phase 5: Integration & Testing (Priority: P2)

**Objective**: End-to-end testing and quality assurance

**Tasks**:
1. Run full test suite (backend + frontend)
2. Verify test coverage meets 80%+ threshold
3. Manual testing of all user flows
4. Fix any bugs discovered
5. Performance testing and optimization

**Testing**: Integration tests, E2E tests, manual QA

**Deliverable**: Feature tested and ready for deployment

---

### Phase 6: Documentation & Deployment (Priority: P3)

**Objective**: Document and prepare for production

**Tasks**:
1. Update README.md with feature description
2. Document API endpoints
3. Add inline code comments
4. Update architecture documentation
5. Verify Docker deployment works
6. Create deployment checklist

**Deliverable**: Complete documentation, deployment-ready feature

---

## Dependencies

### External Dependencies
- PostgreSQL database
- NestJS framework
- React framework
- TypeORM
- JWT authentication system

### Internal Dependencies
- User authentication module
- Workspace management
- Database connection

### Feature Dependencies
None (standalone feature)

## Risk Assessment

### Technical Risks
- **Complexity**: Medium - Standard CRUD operations with business logic
- **Performance**: Monitor database query performance with proper indexing
- **Integration**: Ensure proper error handling for all external calls

### Mitigation Strategies
- Use database indexes for frequently queried fields
- Implement caching where appropriate
- Add comprehensive error handling and logging
- Use transactions for multi-step operations

## Testing Strategy

### Unit Tests
- **Backend**: Jest tests for services, controllers (80%+ coverage)
- **Frontend**: Vitest tests for components, utilities (80%+ coverage)
- **Focus**: Business logic, edge cases, error handling

### Integration Tests
- API endpoint tests
- Database integration tests
- Authentication flow tests

### E2E Tests
- Critical user journeys
- Complete workflows from UI to database

## Success Criteria

### Functional
- All acceptance criteria from spec.md met
- All user stories implemented and working
- All API endpoints functional

### Technical
- Backend build succeeds: `cd backend && npm run build`
- Frontend build succeeds: `cd frontend && npm run build`
- All tests pass: `npm test`
- Test coverage ≥ 80% (statements, functions, lines)
- Test coverage ≥ 75% (branches)

### Quality
- No TypeScript `any` types
- All endpoints have input validation
- Proper error handling throughout
- Code follows ESLint rules
- Code formatted with Prettier

### Performance
- API response time < 200ms for simple queries
- Database queries optimized with indexes
- Frontend renders without lag

## Timeline Estimate

| Phase | Estimated Time |
|-------|---------------|
| Phase 1: Database & Backend Foundation | 1-2 days |
| Phase 2: Business Logic & Services | 2-3 days |
| Phase 3: API Endpoints & Controllers | 1-2 days |
| Phase 4: Frontend Components & UI | 2-3 days |
| Phase 5: Integration & Testing | 1-2 days |
| Phase 6: Documentation & Deployment | 1 day |
| **Total** | **8-13 days** |

**Parallel Opportunities**:
- Frontend work can start after Phase 3 completes
- Documentation can be written alongside implementation

## Constitution Compliance

This implementation plan adheres to all requirements in `.specify/memory/constitution.md`:

✅ Uses approved tech stack (NestJS, React, PostgreSQL, TypeORM)
✅ Includes comprehensive unit testing (80%+ coverage)
✅ Updates documentation synchronously
✅ Includes quality gates (tests, build, Docker)
✅ No forbidden practices (no `any` types, no hardcoded secrets)
✅ Follows code quality standards
✅ Security standards (JWT auth, input validation)

---

**Next Step**: Generate tasks.md using `/speckit-tasks` or automated script
"""

    return plan

def generate_tasks_md(spec_info: Dict[str, Any], feature_dir: str) -> str:
    """Generate tasks.md content"""
    feature_name_slug = feature_dir.split('/')[-1]
    today = datetime.now().strftime('%Y-%m-%d')

    tasks = f"""# Tasks: {spec_info['name']}

**Feature**: {feature_name_slug}
**Created**: {today}
**Status**: {spec_info['status']}

**Input**: Design documents from `specs/{feature_name_slug}/`
**Prerequisites**: plan.md (required), spec.md (required)

## Task Organization

Tasks are organized by implementation phase to enable systematic development and testing.

---

## Phase 1: Setup & Database Foundation

**Purpose**: Establish database schema and basic project structure

### T001: Create Database Entities

**Type**: Database
**Time Estimate**: 1 day
**Dependencies**: None

**Acceptance Criteria**:
"""

    # Add entity creation tasks
    for entity in spec_info['entities']:
        tasks += f"- [ ] Create {entity} TypeORM entity with all required columns\n"

    tasks += """- [ ] Define relationships between entities
- [ ] Add indexes for performance optimization
- [ ] Add validation decorators
- [ ] Create database migrations

**Definition of Done**:
"""

    for entity in spec_info['entities']:
        tasks += f"- Entity file exists at `backend/src/database/entities/{entity.lower()}.entity.ts`\n"

    tasks += """- Migration files created in `backend/src/migrations/`
- `npm run migration:run` succeeds
- All entities properly registered in module

---

### T002: Create NestJS Module Structure

**Type**: Backend
**Time Estimate**: 0.5 days
**Dependencies**: T001

**Acceptance Criteria**:
- [ ] Module file created with all imports
- [ ] Module registered in app.module.ts
- [ ] Service and controller placeholders created
- [ ] DTOs directory structure created

**Definition of Done**:
- Module structure exists at `backend/src/[feature-slug]/`
- Application starts without errors
- Module properly imported in root module

---

## Phase 2: Business Logic Implementation

**Purpose**: Implement core business logic and data operations

### T003: Implement Service Layer

**Type**: Backend
**Time Estimate**: 2 days
**Dependencies**: T002

**Acceptance Criteria**:
- [ ] CRUD operations implemented (create, findAll, findOne, update, delete)
- [ ] Business logic for feature-specific operations
- [ ] Input validation in service methods
- [ ] Error handling for all edge cases
- [ ] Proper use of TypeORM repositories
- [ ] Transaction handling where needed

**Definition of Done**:
- Service file at `backend/src/[feature-slug]/[feature-slug].service.ts`
- All methods have proper TypeScript types
- No `any` types used
- Logging added for important operations

---

### T004: Write Service Unit Tests

**Type**: Testing
**Time Estimate**: 1.5 days
**Dependencies**: T003

**Acceptance Criteria**:
- [ ] Test file created with comprehensive test suite
- [ ] All service methods tested
- [ ] Edge cases covered (not found, invalid input, etc.)
- [ ] Mocks created for repository
- [ ] Test coverage ≥ 80% for service
- [ ] All tests pass

**Definition of Done**:
- Test file at `backend/src/[feature-slug]/[feature-slug].service.spec.ts`
- `npm test` passes with no failures
- Coverage report shows ≥ 80% coverage

---

## Phase 3: API Layer Implementation

**Purpose**: Expose functionality via REST API endpoints

### T005: Create DTOs and Validation

**Type**: Backend
**Time Estimate**: 0.5 days
**Dependencies**: T003

**Acceptance Criteria**:
- [ ] CreateDto with class-validator decorators
- [ ] UpdateDto with optional fields
- [ ] Query/filter DTOs if needed
- [ ] Response DTOs for data serialization
- [ ] Validation rules for all fields

**Definition of Done**:
- DTO files in `backend/src/[feature-slug]/dto/`
- All DTOs properly exported
- Validation decorators from class-validator applied

---

### T006: Implement Controller Endpoints

**Type**: Backend
**Time Estimate**: 1.5 days
**Dependencies**: T005

**Acceptance Criteria**:
- [ ] GET / endpoint (list all with pagination)
- [ ] GET /:id endpoint (get by ID)
- [ ] POST / endpoint (create)
- [ ] PUT /:id endpoint (update)
- [ ] DELETE /:id endpoint (delete)
- [ ] POST /:id/process endpoint (feature-specific action)
- [ ] JWT authentication guards on all routes
- [ ] Proper HTTP status codes
- [ ] Error handling with proper responses

**Definition of Done**:
- Controller at `backend/src/[feature-slug]/[feature-slug].controller.ts`
- All endpoints properly decorated
- Authentication guards applied
- Swagger/OpenAPI annotations added

---

### T007: Write Controller Unit Tests

**Type**: Testing
**Time Estimate**: 1 day
**Dependencies**: T006

**Acceptance Criteria**:
- [ ] Test suite for all controller endpoints
- [ ] Authentication scenarios tested
- [ ] Validation error scenarios tested
- [ ] Success response scenarios tested
- [ ] Service methods properly mocked
- [ ] Test coverage ≥ 80%

**Definition of Done**:
- Test file at `backend/src/[feature-slug]/[feature-slug].controller.spec.ts`
- All tests pass
- Coverage threshold met

---

## Phase 4: Frontend Implementation

**Purpose**: Build user interface components

### T008: Create API Client

**Type**: Frontend
**Time Estimate**: 0.5 days
**Dependencies**: T006

**Acceptance Criteria**:
- [ ] API client functions for all endpoints
- [ ] Proper TypeScript types for requests/responses
- [ ] Error handling
- [ ] JWT token injection
- [ ] Request/response interceptors if needed

**Definition of Done**:
- API client at `frontend/src/lib/api/[feature].ts`
- All endpoints have corresponding client functions
- Types properly defined

---

### T009: Create UI Components

**Type**: Frontend
**Time Estimate**: 2 days
**Dependencies**: T008

**Acceptance Criteria**:
- [ ] List component for displaying items
- [ ] Detail component for single item view
- [ ] Form component for create/update
- [ ] Delete confirmation dialog
- [ ] Loading states for async operations
- [ ] Error states and messages
- [ ] Use shadcn/ui components
- [ ] Tailwind CSS styling
- [ ] Responsive design

**Definition of Done**:
- Components in `frontend/src/components/[feature]/`
- All components properly typed
- Accessible (ARIA attributes)

---

### T010: Create Page and Routing

**Type**: Frontend
**Time Estimate**: 0.5 days
**Dependencies**: T009

**Acceptance Criteria**:
- [ ] Main page component created
- [ ] Route added to router configuration
- [ ] Navigation link added to sidebar/menu
- [ ] Page layout matches design system
- [ ] Protected route (requires authentication)

**Definition of Done**:
- Page at `frontend/src/pages/[FeaturePage].tsx`
- Route accessible via `/[feature-slug]`
- Page renders correctly

---

### T011: Implement State Management

**Type**: Frontend
**Time Estimate**: 1 day
**Dependencies**: T008

**Acceptance Criteria**:
- [ ] Zustand store created for feature state
- [ ] Actions for CRUD operations
- [ ] Loading and error state management
- [ ] Selectors for derived state
- [ ] Store properly typed

**Definition of Done**:
- Store at `frontend/src/store/[feature].ts`
- State updates work correctly
- No console errors

---

### T012: Write Frontend Component Tests

**Type**: Testing
**Time Estimate**: 1.5 days
**Dependencies**: T009, T010, T011

**Acceptance Criteria**:
- [ ] Tests for all components
- [ ] User interaction tests
- [ ] API integration tests with mocks
- [ ] Loading and error state tests
- [ ] Accessibility tests
- [ ] Test coverage ≥ 80%

**Definition of Done**:
- Test files in `frontend/src/components/[feature]/`
- `npm run test:run` passes
- Coverage threshold met

---

## Phase 5: Integration & Quality Assurance

**Purpose**: End-to-end testing and quality verification

### T013: Integration Testing

**Type**: Testing
**Time Estimate**: 1 day
**Dependencies**: T007, T012

**Acceptance Criteria**:
- [ ] API integration tests (real HTTP requests to test server)
- [ ] Database integration tests
- [ ] Authentication flow tests
- [ ] Error scenario tests
- [ ] All integration tests pass

**Definition of Done**:
- Integration tests created
- `npm test` passes all tests
- No flaky tests

---

### T014: Manual QA and Bug Fixes

**Type**: Testing
**Time Estimate**: 1 day
**Dependencies**: T013

**Acceptance Criteria**:
- [ ] All user stories manually tested
- [ ] All acceptance criteria verified
- [ ] Edge cases tested
- [ ] Any bugs found are documented and fixed
- [ ] Regression testing after fixes

**Definition of Done**:
- All user stories work as specified
- No critical bugs remaining
- QA checklist completed

---

### T015: Quality Gates Verification

**Type**: Testing
**Time Estimate**: 0.5 days
**Dependencies**: T014

**Acceptance Criteria**:
- [ ] Backend build succeeds: `cd backend && npm run build`
- [ ] Frontend build succeeds: `cd frontend && npm run build`
- [ ] All backend tests pass: `cd backend && npm test`
- [ ] All frontend tests pass: `cd frontend && npm run test:run`
- [ ] Test coverage ≥ 80% (statements, functions, lines)
- [ ] Test coverage ≥ 75% (branches)
- [ ] No ESLint errors
- [ ] Code formatted with Prettier
- [ ] Docker Compose starts successfully

**Definition of Done**:
- All quality gates pass
- Coverage reports generated
- Builds succeed without errors

---

## Phase 6: Documentation & Deployment

**Purpose**: Document feature and prepare for production

### T016: Update Documentation

**Type**: Documentation
**Time Estimate**: 0.5 days
**Dependencies**: T015

**Acceptance Criteria**:
- [ ] README.md updated with feature description
- [ ] API endpoints documented in README
- [ ] Feature added to feature list
- [ ] Inline code comments for complex logic
- [ ] Architecture documentation updated if needed
- [ ] Update spec.md status to "Implemented"

**Definition of Done**:
- README.md contains feature documentation
- All API endpoints listed
- Code comments added

---

### T017: Deployment Verification

**Type**: DevOps
**Time Estimate**: 0.5 days
**Dependencies**: T016

**Acceptance Criteria**:
- [ ] Docker images build successfully
- [ ] Docker Compose starts all services
- [ ] Database migrations run successfully
- [ ] Health checks pass
- [ ] Feature accessible in containerized environment

**Definition of Done**:
- `docker compose up --build -d` succeeds
- All services healthy
- Feature works in Docker environment

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Phase 1 (Setup)**: No dependencies - start immediately
2. **Phase 2 (Business Logic)**: Depends on Phase 1 completion
3. **Phase 3 (API Layer)**: Depends on Phase 2 completion
4. **Phase 4 (Frontend)**: Depends on Phase 3 completion (can start earlier with mocks)
5. **Phase 5 (Integration)**: Depends on Phase 3 + Phase 4 completion
6. **Phase 6 (Documentation)**: Depends on Phase 5 completion

### Task Dependencies
- T002 depends on T001 (need entities before creating module)
- T003 depends on T002 (need module before service)
- T004 depends on T003 (need service before testing)
- T005 depends on T003 (DTOs need service logic understanding)
- T006 depends on T005 (controller needs DTOs)
- T007 depends on T006 (test controller after implementation)
- T008 depends on T006 (API client needs endpoints)
- T009 depends on T008 (components need API client)
- T010 depends on T009 (page needs components)
- T011 depends on T008 (state management needs API client)
- T012 depends on T009, T010, T011 (test after implementation)
- T013 depends on T007, T012 (integration after unit tests)
- T014 depends on T013 (manual QA after integration)
- T015 depends on T014 (gates after bugs fixed)
- T016 depends on T015 (document after verification)
- T017 depends on T016 (deploy after documentation)

### Parallel Opportunities
- T004 and T005 can run in parallel
- T011 can start while T009 is in progress
- Documentation (T016) can be written alongside implementation

---

## Implementation Strategy

### Sequential Approach (Recommended)
1. Complete Phase 1 → Foundation ready
2. Complete Phase 2 → Services ready
3. Complete Phase 3 → API ready
4. Complete Phase 4 → UI ready
5. Complete Phase 5 → Tested and verified
6. Complete Phase 6 → Documented and deployed

### Time Estimate Summary
- **Phase 1**: 1.5 days
- **Phase 2**: 3.5 days
- **Phase 3**: 3 days
- **Phase 4**: 4 days
- **Phase 5**: 2.5 days
- **Phase 6**: 1 day
- **Total**: ~15.5 days

---

## Notes

- All tasks must follow constitution.md standards
- Test coverage thresholds are non-negotiable (80%+ statements, 75%+ branches)
- No `any` types allowed in TypeScript
- All endpoints must have JWT authentication
- Input validation required on all API endpoints
- Commit after completing each task or logical group
- Run quality gates before final commit

---

**Reference**: See `specs/006-unmock-ai-integration/` for a complete implementation example
"""

    return tasks

def main():
    """Main execution function"""
    print("🚀 Starting automated documentation generation...")
    print(f"📁 Scanning specs directory: {SPECS_DIR}")

    # Get all spec directories
    spec_dirs = sorted([d for d in SPECS_DIR.iterdir() if d.is_dir()])

    stats = {
        "total": len(spec_dirs),
        "plan_generated": 0,
        "tasks_generated": 0,
        "skipped": 0,
        "errors": 0,
    }

    for spec_dir in spec_dirs:
        feature_name = spec_dir.name
        spec_file = spec_dir / "spec.md"
        plan_file = spec_dir / "plan.md"
        tasks_file = spec_dir / "tasks.md"

        # Skip if spec.md doesn't exist
        if not spec_file.exists():
            print(f"⚠️  {feature_name}: No spec.md found, skipping")
            stats["skipped"] += 1
            continue

        # Skip if both plan.md and tasks.md already exist
        if plan_file.exists() and tasks_file.exists():
            print(f"✅ {feature_name}: Already has complete documentation")
            stats["skipped"] += 1
            continue

        try:
            print(f"\n📝 Processing {feature_name}...")

            # Extract information from spec
            spec_info = extract_feature_info(spec_file)

            # Generate plan.md if missing
            if not plan_file.exists():
                print(f"   ├─ Generating plan.md...")
                plan_content = generate_plan_md(spec_info, str(spec_dir))
                with open(plan_file, 'w') as f:
                    f.write(plan_content)
                stats["plan_generated"] += 1
                print(f"   ├─ ✓ plan.md created")
            else:
                print(f"   ├─ plan.md already exists")

            # Generate tasks.md if missing
            if not tasks_file.exists():
                print(f"   ├─ Generating tasks.md...")
                tasks_content = generate_tasks_md(spec_info, str(spec_dir))
                with open(tasks_file, 'w') as f:
                    f.write(tasks_content)
                stats["tasks_generated"] += 1
                print(f"   └─ ✓ tasks.md created")
            else:
                print(f"   └─ tasks.md already exists")

        except Exception as e:
            print(f"   └─ ❌ Error: {str(e)}")
            stats["errors"] += 1

    # Print summary
    print("\n" + "="*60)
    print("📊 Generation Summary")
    print("="*60)
    print(f"Total features: {stats['total']}")
    print(f"Plan.md files generated: {stats['plan_generated']}")
    print(f"Tasks.md files generated: {stats['tasks_generated']}")
    print(f"Skipped (already complete): {stats['skipped']}")
    print(f"Errors: {stats['errors']}")
    print("="*60)

    if stats["errors"] == 0:
        print("\n✅ All documentation generated successfully!")
    else:
        print(f"\n⚠️  Completed with {stats['errors']} errors")

    return 0 if stats["errors"] == 0 else 1

if __name__ == "__main__":
    exit(main())
