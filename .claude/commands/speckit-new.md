# Create New Feature Specification

You are helping create a new feature specification for the OmniAds platform following the Speckit methodology.

## Process

Follow these steps in order:

### 1. Gather Requirements
Ask the user for:
- **Feature number** (format: XXX, e.g., 010)
- **Feature name** (kebab-case, e.g., advanced-targeting-engine)
- **Brief description** (what the feature does)

### 2. Create Directory Structure
```bash
mkdir -p specs/XXX-feature-name
```

### 3. Generate Comprehensive spec.md

Create a detailed specification using `.specify/templates/spec-template.md` as the base structure. The spec.md must include:

1. **Header** (Feature #, Name, Status, Epic, Priority, Owner, Target Version)
2. **Overview** (2-3 paragraphs explaining what, why, who)
3. **Problem Statement** (Current state, desired state, consequences)
4. **User Personas** (Advertisers, Publishers, Admins workflows)
5. **Functional Requirements** (User stories with Given-When-Then, UI components, data models, business logic)
6. **Non-Functional Requirements** (Security, performance, scalability, i18n, accessibility)
7. **API Specifications** (Endpoints, request/response schemas, auth, errors)
8. **AI/ML Specifications** (if applicable - prompts, models, inputs/outputs, human review)
9. **Edge Cases & Error Handling** (Specific failure scenarios + detection + recovery)
10. **Testing Strategy** (Unit, integration, E2E, accessibility, load tests)
11. **Success Metrics** (Quantitative + qualitative measures)
12. **Dependencies** (Internal features, external services, migrations)
13. **Open Questions** (Unresolved items needing clarification)

### 4. Work Interactively with User
- Fill in all sections collaboratively
- Ask clarifying questions for incomplete sections
- Ensure all acceptance criteria use Given-When-Then format
- Validate alignment with OmniAds tech stack (from constitution.md)

### 5. Generate Derived Documents
Once spec.md is complete and approved:
1. Run `/speckit-plan` to generate plan.md
2. Run `/speckit-tasks` to generate tasks.md

### 6. Confirm Completion
Verify all three files exist:
- ✓ `specs/XXX-feature-name/spec.md`
- ✓ `specs/XXX-feature-name/plan.md`
- ✓ `specs/XXX-feature-name/tasks.md`

Mark the feature as "Ready for Implementation" once all documents are complete.

## Key Principles

- **Spec-driven development**: spec.md → plan.md → tasks.md → Implementation
- **No coding without specs**: All three documents must exist before any code is written
- **Alignment with constitution**: All decisions must align with `.specify/memory/constitution.md`
- **Tech stack compliance**: Use only approved technologies from the OmniAds stack

## Tech Stack Reference

**Backend (NestJS):**
- NestJS 10.3.0+, TypeScript, PostgreSQL 14+, TypeORM 0.3.19+
- JWT + Passport.js, bcrypt
- Anthropic Claude API or OpenAI API
- Jest for testing

**Frontend (React):**
- React 18.2.0+, TypeScript 5.3.3+, Vite 5.0.11+
- shadcn/ui (Radix UI), Tailwind CSS 3.4.1+
- Recharts 2.10.3+, Zustand 4.4.7+
- Vitest + React Testing Library

## Reference Files

- Constitution: `.specify/memory/constitution.md`
- Template: `.specify/templates/spec-template.md`
- AI Instructions: `.specify/AI_AGENT_INSTRUCTIONS.md`

---

**Start by asking the user for the feature number, name, and description.**
