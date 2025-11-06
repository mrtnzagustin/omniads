# Archived Scripts

This directory contains scaffolding and generation scripts that were used during the initial development of OmniAds. These scripts have served their purpose and are archived here for historical reference.

## Contents

### Feature Generation Scripts
These scripts were used to generate feature specifications and implementations in bulk:

- `create-20-features.sh` - Generated features 108-127
- `create_features_088_107.sh` - Generated features 088-107
- `create_specs_048_067.sh` - Generated specs 048-067
- `create_specs_068_087.sh` - Generated specs 068-087
- `create_specs_128_147.sh` - Generated specs 128-147
- `generate-features.sh` - Generic feature generation script
- `generate-feature-implementation.sh` - Feature implementation generator

### Implementation Scripts
These scripts were used to implement features in bulk:

- `implement-all-features.sh` - Master implementation script for features 109-127
- `implement_features_048_067.sh` - Implementation for features 048-067
- `implement_features_129_147.sh` - Implementation for features 129-147

### Test Generation Scripts
These scripts were used to generate test files:

- `generate-tests.sh` - Generic test generation script
- `create_tests_129_147.sh` - Test generation for features 129-147
- `run-all-tests.sh` - Test runner for specific features

### Spec Update Scripts
These scripts were used to update spec files:

- `update-specs.sh` - Generic spec updater
- `update_specs_068_087.sh` - Spec updates for features 068-087
- `update_specs_129_147.sh` - Spec updates for features 129-147
- `update_specs_status.sh` - Spec status updater
- `update_app_module_129_147.sh` - App module updates for features 129-147

## Why Archived?

These scripts were part of the **initial scaffolding phase** and are no longer needed for day-to-day development because:

1. **All features have been generated** - The specs for features 001-147 have already been created
2. **Constitution established** - The new Speckit constitution (.specify/memory/constitution.md) defines the proper workflow for new features
3. **Better tooling available** - Use Speckit commands (`/speckit.spec`, `/speckit.plan`, `/speckit.tasks`) for new features
4. **Not maintainable** - These scripts were one-time-use and not designed for ongoing maintenance

## For New Features

**DO NOT use these archived scripts.** Instead, follow the proper workflow defined in `.specify/memory/constitution.md`:

1. Create spec: `/speckit.spec <feature-name>`
2. Generate plan: `/speckit.plan <feature-name>`
3. Generate tasks: `/speckit.tasks <feature-name>`
4. Implement following tasks.md
5. Run tests and quality gates

## Historical Value

These scripts are preserved for:
- Understanding how the initial 147 features were created
- Reference for any troubleshooting of existing features
- Learning from the patterns used during scaffolding
- Audit trail of the project's evolution

## Restoration

If you need to reference or use any of these scripts:

```bash
# View a script
cat scripts/archive/<script-name>.sh

# Copy back to root if needed (not recommended)
cp scripts/archive/<script-name>.sh ./<script-name>.sh
```

**Warning**: Using these scripts without understanding the current architecture may create inconsistencies.

---

**Archive Date**: 2025-11-05
**Archived By**: Claude (constitution compliance cleanup)
**Safe to Delete**: No - keep for historical reference
