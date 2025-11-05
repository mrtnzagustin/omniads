# Feature Specification: Comprehensive Unit Testing Infrastructure

**Feature Branch**: `claude/add-unit-testing-011CUppaaNiM3D7dA3bo4v3z`
**Created**: 2025-11-05
**Status**: In Progress
**Input**: User request: "Add comprehensive unit testing to the entire project and make tests mandatory for all implementations"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mandatory test execution before commits (Priority: P1)

As a developer, I cannot commit code unless all unit tests pass, so that code quality is maintained and regressions are prevented automatically.

**Why this priority**: This is the core value proposition - preventing broken code from entering the repository.

**Independent Test**: Attempt to commit code with failing tests and verify that the commit is rejected with a clear error message.

**Acceptance Scenarios**:

1. **Given** there are failing tests, **When** I attempt to commit, **Then** the pre-commit hook blocks the commit and displays which tests failed.
2. **Given** all tests pass, **When** I commit code, **Then** the commit succeeds normally.
3. **Given** I try to bypass hooks with --no-verify, **When** the CI pipeline runs, **Then** it still enforces test passing.

---

### User Story 2 - Comprehensive test coverage for all backend services (Priority: P1)

As a developer, I can see that all backend services, controllers, and utilities have unit tests with > 80% code coverage, so that I'm confident the system behaves as expected.

**Why this priority**: Without tests for existing code, we cannot guarantee system stability.

**Independent Test**: Run test coverage report and verify that all critical modules (auth, user, AI services, recommendations, etc.) have > 80% coverage.

**Acceptance Scenarios**:

1. **Given** the test suite runs, **When** coverage is generated, **Then** auth module shows > 80% coverage.
2. **Given** the test suite runs, **When** coverage is generated, **Then** AI services show > 80% coverage.
3. **Given** a new service is added without tests, **When** coverage runs, **Then** the coverage check fails and blocks the PR.

---

### User Story 3 - Fast test execution for developer productivity (Priority: P2)

As a developer, I can run all unit tests in under 30 seconds, so that I get rapid feedback during development without slowing down my workflow.

**Why this priority**: Slow tests lead to developers skipping them, defeating the purpose.

**Independent Test**: Run the full test suite and verify completion time is < 30 seconds.

**Acceptance Scenarios**:

1. **Given** the full test suite, **When** I run `npm test`, **Then** all tests complete in < 30 seconds.
2. **Given** I'm working on a specific module, **When** I run tests for that module only, **Then** tests complete in < 5 seconds.
3. **Given** tests are slow, **When** I check the test report, **Then** slow tests (> 1s) are highlighted for optimization.

---

### User Story 4 - Test templates and generators for consistency (Priority: P2)

As a developer, I can use test templates and generators to quickly create tests for new services and controllers, so that writing tests is easy and consistent.

**Why this priority**: Reduces friction in test creation, making developers more likely to write comprehensive tests.

**Independent Test**: Run test generator for a new service and verify it creates a properly structured test file with common scenarios.

**Acceptance Scenarios**:

1. **Given** I create a new NestJS service, **When** I run the test generator, **Then** it creates a `.spec.ts` file with basic test structure.
2. **Given** I create a new React component, **When** I run the test generator, **Then** it creates a `.test.tsx` file with render tests.
3. **Given** templates exist, **When** new developers join, **Then** they can reference templates to learn testing patterns.

---

### User Story 5 - CI/CD integration with test enforcement (Priority: P3)

As a team lead, I can see that all pull requests automatically run tests and block merging if tests fail, so that the main branch always has passing tests.

**Why this priority**: Complements pre-commit hooks but can be added after local enforcement is working.

**Independent Test**: Create a PR with failing tests and verify it cannot be merged until tests pass.

**Acceptance Scenarios**:

1. **Given** a PR is opened, **When** tests fail in CI, **Then** the PR shows a red status and cannot be merged.
2. **Given** tests pass in CI, **When** reviewing the PR, **Then** reviewers can see coverage reports in the PR comments.
3. **Given** coverage drops below threshold, **When** CI runs, **Then** the build fails with a clear message about coverage requirements.

---

### Edge Cases

- What happens if tests take too long to run? Implement timeout configurations and optimize slow tests. Consider parallel test execution.
- How to handle tests that require external dependencies? Use mocks and stubs for all external services (databases, APIs, file systems).
- What if a developer needs to commit urgently without tests? Document the process for emergency commits (with required follow-up tasks).
- How to prevent flaky tests? Enforce deterministic tests, avoid timing dependencies, and automatically quarantine tests with > 1% flake rate.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST install and configure Jest for NestJS backend with TypeScript support, including ts-jest and proper module resolution.
- **FR-002**: System MUST install and configure Vitest for React frontend with JSX/TSX support and React Testing Library.
- **FR-003**: System MUST implement unit tests for all existing backend services in `/backend/src` covering success paths, error handling, and edge cases.
- **FR-004**: System MUST implement unit tests for all existing backend controllers covering request validation, response formatting, and authentication/authorization.
- **FR-005**: System MUST implement unit tests for critical frontend components including page components, forms, and shared utilities.
- **FR-006**: System MUST configure code coverage tracking with minimum thresholds: 80% statements, 75% branches, 80% functions, 80% lines.
- **FR-007**: System MUST install and configure Husky pre-commit hooks that run tests before allowing commits.
- **FR-008**: System MUST create test templates for common patterns (services, controllers, React components, utilities).
- **FR-009**: System MUST configure test scripts in package.json: `test`, `test:watch`, `test:coverage`, `test:debug`.
- **FR-010**: System MUST document testing guidelines in README including how to write tests, run tests, and troubleshoot common issues.

### Non-Functional Requirements

- **NFR-001**: Test suite MUST execute in < 30 seconds for backend unit tests (target: < 20 seconds).
- **NFR-002**: Test suite MUST execute in < 20 seconds for frontend unit tests (target: < 10 seconds).
- **NFR-003**: Test files MUST follow naming convention: `*.spec.ts` for backend, `*.test.tsx` for frontend.
- **NFR-004**: Tests MUST be isolated - no shared state between tests, no reliance on test execution order.
- **NFR-005**: Tests MUST use consistent mocking strategies - services mock dependencies, controllers mock services.

### Key Testing Areas (Backend)

**Priority 1 - Core System**:
- **Auth Module** (`/auth`): Login, registration, JWT strategy, guards, decorators
- **User Module** (`/user`): User service, user CRUD operations
- **AI Services** (`/services/ai`): AI core client, providers, prompt builders
- **Data Sync** (`/services`): Data sync service, platform integrations
- **Recommendations** (`/recommendations`): Recommendation service, workflow automation

**Priority 2 - Feature Modules**:
- **Dashboard** (`/dashboard`): Dashboard service, metrics aggregation
- **Autopilot** (`/autopilot`): Autopilot configuration, automated actions
- **Anomaly Alerts** (`/anomaly-alerts`): Alert detection, notification
- **Budget Rebalancer** (`/budget-rebalancer`): Budget optimization logic
- **Creative Workbench** (`/creative-workbench`): Creative asset management

**Priority 3 - Advanced Features**:
- All remaining feature modules (40+ features)

### Key Testing Areas (Frontend)

**Priority 1 - Core Components**:
- **Authentication flows**: Login form, registration form, protected routes
- **Dashboard components**: Main dashboard, metric cards, charts
- **Shared utilities**: API client, auth helpers, formatting utilities

**Priority 2 - Feature Components**:
- Campaign management components
- Recommendation display components
- Alert notification components

## Technical Implementation

### Backend Testing Stack

```typescript
// Dependencies to install
{
  "devDependencies": {
    "@nestjs/testing": "^10.3.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "ts-jest": "^29.1.1",
    "supertest": "^6.3.3",
    "@types/supertest": "^6.0.2"
  }
}
```

### Frontend Testing Stack

```typescript
// Dependencies to install
{
  "devDependencies": {
    "vitest": "^1.2.0",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "@vitest/ui": "^1.2.0",
    "jsdom": "^23.2.0"
  }
}
```

### Pre-commit Hook Stack

```json
{
  "devDependencies": {
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0"
  }
}
```

### Jest Configuration (Backend)

```javascript
// jest.config.js
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.ts',
    '!**/*.entity.ts',
    '!**/main.ts',
    '!**/index.ts',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
};
```

### Vitest Configuration (Frontend)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

### Example Test Structure (Backend Service)

```typescript
// user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from '../database/entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });
});
```

### Example Test Structure (React Component)

```typescript
// Login.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Login } from './Login';
import { AuthContext } from '../context/AuthContext';

describe('Login Component', () => {
  const mockLogin = vi.fn();

  const renderLogin = () => {
    return render(
      <AuthContext.Provider value={{ login: mockLogin, isAuthenticated: false }}>
        <Login />
      </AuthContext.Provider>
    );
  };

  it('should render login form', () => {
    renderLogin();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should call login with form values', async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should show error message on invalid email', async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });
});
```

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of backend modules have associated `.spec.ts` test files.
- **SC-002**: Backend test coverage is > 80% for statements, functions, and lines across all modules.
- **SC-003**: Frontend test coverage is > 80% for critical components (auth, dashboard, shared utilities).
- **SC-004**: Pre-commit hooks successfully block commits with failing tests in 100% of attempts.
- **SC-005**: Full backend test suite executes in < 30 seconds.
- **SC-006**: Full frontend test suite executes in < 20 seconds.
- **SC-007**: All developers can run `npm test` and see clear pass/fail results with coverage report.
- **SC-008**: Documentation includes comprehensive testing guide with examples and best practices.
- **SC-009**: Test templates are available for services, controllers, and React components.
- **SC-010**: Zero flaky tests - all tests are deterministic and pass consistently.

## Implementation Checklist

### Phase 1: Infrastructure Setup (Days 1-2)
- [ ] Install Jest and testing dependencies for backend
- [ ] Install Vitest and testing dependencies for frontend
- [ ] Configure Jest with coverage thresholds
- [ ] Configure Vitest with coverage thresholds
- [ ] Set up test scripts in both package.json files
- [ ] Create test setup files and global mocks

### Phase 2: Backend Tests - Priority 1 (Days 3-5)
- [ ] Auth module tests (services, controllers, guards, strategies)
- [ ] User module tests (services, CRUD operations)
- [ ] AI services tests (core client, providers, mocks)
- [ ] Data sync service tests
- [ ] Recommendations module tests

### Phase 3: Backend Tests - Priority 2 (Days 6-8)
- [ ] Dashboard module tests
- [ ] Autopilot module tests
- [ ] Anomaly alerts tests
- [ ] Budget rebalancer tests
- [ ] Creative workbench tests

### Phase 4: Frontend Tests (Days 9-10)
- [ ] Authentication flow tests
- [ ] Dashboard component tests
- [ ] Shared utilities tests
- [ ] API client tests

### Phase 5: Enforcement & Documentation (Days 11-12)
- [ ] Install and configure Husky
- [ ] Set up pre-commit hooks with lint-staged
- [ ] Configure GitHub Actions CI (if applicable)
- [ ] Create test templates and generators
- [ ] Write comprehensive testing documentation
- [ ] Add testing section to README

### Phase 6: Validation (Day 13)
- [ ] Run full test suite and verify < 30s execution
- [ ] Verify coverage meets thresholds
- [ ] Test pre-commit hooks with intentionally failing tests
- [ ] Have team members review and test the testing infrastructure
- [ ] Create video walkthrough or workshop for team

## Documentation Requirements

### README Testing Section

Must include:
1. How to run tests (`npm test`, `npm run test:watch`, `npm run test:coverage`)
2. How to write tests (link to templates and examples)
3. Coverage requirements and how to check them
4. Troubleshooting common test issues
5. Best practices for test organization

### Test Templates

Must create:
1. `templates/service.spec.ts` - NestJS service test template
2. `templates/controller.spec.ts` - NestJS controller test template
3. `templates/component.test.tsx` - React component test template
4. `templates/hook.test.tsx` - React hook test template
5. `templates/utility.test.ts` - Utility function test template

## Risk Mitigation

**Risk**: Existing code may be hard to test due to tight coupling
**Mitigation**: Start with new code and refactor legacy code gradually. Document patterns for testing tightly coupled code.

**Risk**: Tests may be too slow, discouraging developers from running them
**Mitigation**: Optimize test execution, use parallel runners, implement watch mode for development.

**Risk**: Developers may try to bypass pre-commit hooks
**Mitigation**: Also enforce tests in CI/CD. Make bypassing hooks require explicit justification in PR.

**Risk**: Flaky tests may frustrate developers
**Mitigation**: Implement strict no-flaky-test policy. Quarantine flaky tests immediately and fix or remove them.

**Risk**: Writing tests for all 161 backend files may take too long
**Mitigation**: Prioritize critical paths first (auth, AI, recommendations). Create templates and automation to speed up test creation. Consider using AI tools to generate initial test scaffolds.
