# Generate Implementation Plan

You are creating a detailed implementation plan (plan.md) for an OmniAds feature based on its specification.

## Prerequisites

Before running this command:
1. `spec.md` must exist in the feature directory
2. The spec must be complete with all required sections
3. You must have read `.specify/memory/constitution.md`

## Process

### 1. Read Required Documents
```bash
# Read the feature specification
cat specs/XXX-feature-name/spec.md

# Read the constitution for tech stack and standards
cat .specify/memory/constitution.md

# Use the plan template
cat .specify/templates/plan-template.md
```

### 2. Generate Comprehensive plan.md

Create a detailed implementation plan including:

#### A. Overview
- 2-3 sentence feature summary
- Link to spec.md

#### B. Technical Architecture
- **Backend Architecture**: NestJS modules, services, controllers, repositories
- **Database Schema**: TypeORM entities with relationships, indexes, migrations
- **Frontend Architecture**: React components hierarchy, routing, state management
- **External Services**: Third-party integrations (Anthropic Claude, OpenAI, payment gateways)

#### C. Implementation Phases
Break down into sequential phases:
1. **Phase 1: Database & Backend Foundation**
2. **Phase 2: Business Logic & Services**
3. **Phase 3: API Endpoints & Controllers**
4. **Phase 4: Frontend Components & UI**
5. **Phase 5: Integration & Testing**
6. **Phase 6: Documentation & Deployment**

Each phase must include:
- Specific tasks to complete
- Expected deliverables
- Testing checkpoints

#### D. Dependencies
- **External Dependencies**: Third-party APIs, libraries, services
- **Internal Dependencies**: Other features that must be implemented first
- **Feature Dependencies**: Other specs that this feature builds upon

#### E. Risk Assessment
- **Technical Risks**: Complexity, unknowns, performance concerns
- **Integration Risks**: Third-party service availability, API changes
- **Timeline Risks**: Blocking dependencies, resource constraints
- **Mitigation Strategies**: For each identified risk

#### F. Testing Strategy
- **Unit Tests**: Services, controllers, utilities (80%+ coverage required)
- **Integration Tests**: API endpoints, database operations, external services
- **E2E Tests**: Critical user flows
- **Load Tests**: Performance benchmarks (if applicable)

#### G. Success Criteria
- **Functional**: All acceptance criteria from spec.md met
- **Technical**: All tests pass, coverage thresholds met, builds succeed
- **Performance**: Response times, throughput targets
- **Quality**: Code review approved, no critical bugs

#### H. Timeline Estimate
- Time estimate per phase (in days/hours)
- Total estimated effort
- Parallel work opportunities

## Tech Stack Constraints

**MUST use these technologies** (from constitution.md):

**Backend:**
- NestJS 10.3.0+ with TypeScript
- PostgreSQL 14+ with TypeORM 0.3.19+
- JWT + Passport.js for authentication
- Anthropic Claude API or OpenAI API for AI features
- Jest 30.2.0+ for testing

**Frontend:**
- React 18.2.0+ with TypeScript 5.3.3+
- Vite 5.0.11+ for build
- shadcn/ui (Radix UI) + Tailwind CSS 3.4.1+
- Recharts 2.10.3+ for charts
- Zustand 4.4.7+ for state management
- Vitest 4.0.7+ for testing

**No other technologies allowed without approval.**

## Key Principles

- **Constitution compliance**: Verify all technical decisions align with constitution.md
- **Realistic estimates**: Don't underestimate complexity
- **Test everything**: Testing must be integrated into every phase
- **Document as you go**: Documentation updates should be a dedicated phase
- **RBAC from start**: Security and authorization from the beginning

## Database Schema Guidelines

For TypeORM entities, include:
- Column definitions with types
- Relationships (@OneToMany, @ManyToOne, @ManyToMany)
- Indexes for performance
- Constraints and validations
- Migration scripts (up/down)

Example:
```typescript
@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  name: string;

  @ManyToOne(() => Advertiser, advertiser => advertiser.campaigns)
  advertiser: Advertiser;

  @CreateDateColumn()
  createdAt: Date;
}
```

## API Documentation Format

For each endpoint, specify:
- HTTP method and path
- Authentication required (JWT, roles)
- Request DTO with validation rules
- Response schema
- Error responses (400, 401, 403, 404, 500)

Example:
```typescript
POST /api/campaigns
Auth: JWT (role: ADVERTISER)
Request: CreateCampaignDto
Response: { id, name, status, budget, createdAt }
Errors: 400 (validation), 401 (unauthorized), 403 (forbidden)
```

## Output

Create `specs/XXX-feature-name/plan.md` with:
1. All sections filled in completely
2. Specific technical details (not generic)
3. Realistic time estimates
4. Clear dependencies and risks
5. Detailed database schemas and API specs

## Validation

Before finishing, verify:
- [ ] Tech stack matches constitution.md
- [ ] All phases include testing checkpoints
- [ ] Database schema includes migrations
- [ ] API endpoints include validation and auth
- [ ] Risks identified with mitigation strategies
- [ ] Timeline estimates are realistic

---

**After generating plan.md, suggest running `/speckit-tasks` to create the task breakdown.**
