# Validate Speckit Structure

You are validating that all feature specifications follow the required Speckit workflow structure.

## Purpose

This command checks that:
1. All specs have required files (spec.md, plan.md, tasks.md)
2. The Speckit workflow structure is maintained
3. Features are ready for implementation

## Process

### 1. Run Validation Script

Execute the root-level validation script:
```bash
bash scripts/check-speckit.sh
```

### 2. Interpret Results

#### If Validation Fails:
The script will identify specs with missing files:
- Missing `spec.md` → Feature not properly specified
- Missing `plan.md` → No implementation plan exists
- Missing `tasks.md` → No task breakdown exists

#### If Validation Succeeds:
All specs meet the required structure:
- ✓ All specs have spec.md
- ✓ All specs have plan.md
- ✓ All specs have tasks.md
- ✓ Constitution exists at `.specify/memory/constitution.md`

### 3. Remediation Steps

For each spec with missing files, offer to help:

**If spec.md is missing:**
```bash
# Run speckit-new to create the specification
/speckit-new
```

**If plan.md is missing:**
```bash
# Run speckit-plan to generate implementation plan
/speckit-plan
```

**If tasks.md is missing:**
```bash
# Run speckit-tasks to generate task breakdown
/speckit-tasks
```

## Validation Script Details

The `scripts/check-speckit.sh` script validates:
1. **Constitution exists**: `.specify/memory/constitution.md` must be present and non-empty
2. **Specs directory exists**: `specs/` directory must exist
3. **Required files per spec**: Each `specs/XXX-*/` must contain:
   - `spec.md` - Feature specification
   - `plan.md` - Implementation plan
   - `tasks.md` - Task breakdown

## Output Interpretation

### Success Output:
```
✓ Constitution exists: .specify/memory/constitution.md
✓ Specs directory exists
✓ Checking spec directories...

✓ specs/010-advanced-targeting
  ✓ spec.md
  ✓ plan.md
  ✓ tasks.md

All specs are valid!
Total specs validated: 1
```

### Failure Output:
```
✓ Constitution exists: .specify/memory/constitution.md
✓ Specs directory exists
✓ Checking spec directories...

✗ specs/011-campaign-optimization
  ✓ spec.md
  ✗ plan.md (MISSING)
  ✗ tasks.md (MISSING)

ERROR: Some specs are missing required files.

Each spec must have: spec.md, plan.md, and tasks.md

To fix:
1. Run /speckit-plan to generate plan.md
2. Run /speckit-tasks to generate tasks.md

See .specify/memory/constitution.md for complete workflow.
```

## Quick Help Commands

If you're inside a spec directory, you can quickly generate missing files:

```bash
# Generate missing plan.md
/speckit-plan

# Generate missing tasks.md
/speckit-tasks
```

## Workflow Reminder

The required Speckit workflow is:
```
📝 spec.md → 📐 plan.md → ✅ tasks.md → 💻 Implementation → 🧪 Testing → 📚 Documentation
```

**You cannot skip any step in this workflow.**

## Related Commands

- `/speckit-new` - Create new feature specification
- `/speckit-plan` - Generate implementation plan from spec
- `/speckit-tasks` - Generate task breakdown from plan
- `/speckit-validate` - Validate all specs (this command)

## Enforcement Mechanisms

Speckit compliance is enforced through:
1. **Manual validation**: This command (`/speckit-validate`)
2. **Git pre-commit hooks**: Block commits without required docs
3. **GitHub Actions**: Validate on all PRs and pushes to main/develop

## Success Criteria

A feature is "Speckit compliant" when:
- [ ] `spec.md` exists and is complete
- [ ] `plan.md` exists with all sections filled
- [ ] `tasks.md` exists with granular, testable tasks
- [ ] All files are in `specs/XXX-feature-name/` directory
- [ ] Constitution compliance verified

---

**Run `bash scripts/check-speckit.sh` now to validate all specs.**
