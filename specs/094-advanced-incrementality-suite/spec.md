# Feature Specification: Advanced Incrementality Suite

**Feature Branch**: `[094-advanced-incrementality-suite]`
**Created**: 2025-11-05
**Status**: Implemented
**Implementation Date**: 2025-11-05
**Input**: User description: "Advanced Incrementality Suite - Gold standard causal impact measurement using holdout tests, geo experiments, and synthetic controls"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Geo-based incrementality testing (Priority: P1)

As a performance analyst, I can run geo-based holdout experiments to measure true incremental lift from ad campaigns so that I know which campaigns drive real growth vs. just capturing existing demand.

**Why this priority**: Incrementality testing is the gold standard for proving campaign effectiveness. This separates real impact from correlation.

**Independent Test**: Run geo experiment for 30 days with 50% markets exposed, 50% holdout, verify that system calculates incremental lift with statistical confidence intervals.

**Acceptance Scenarios**:

1. **Given** I want to test campaign incrementality, **When** I create a geo experiment, **Then** the system randomly assigns geographic markets to treatment (ads on) and control (ads off) groups ensuring statistical balance.
2. **Given** experiment is configured, **When** I launch it, **Then** campaigns run only in treatment markets while control markets see no ads for the test period.
3. **Given** experiment runs for 30+ days, **When** I view results, **Then** the system calculates incremental lift (treatment - control conversions), statistical significance (p-value), and incremental ROAS.

---

### User Story 2 - Audience-based holdout testing (Priority: P2)

As a growth marketer, I can create randomized controlled trials (RCTs) with holdout audiences to measure incremental impact at the user level so that I account for organic conversion rates and avoid over-attribution.

**Why this priority**: User-level RCTs complement geo tests for more granular insights. After geo experiments work, this adds precision.

**Independent Test**: Run audience holdout test with 90% exposed, 10% holdout, verify that incremental conversions are correctly calculated after 14 days.

**Acceptance Scenarios**:

1. **Given** I configure an audience holdout test, **When** I set holdout percentage (5-20%), **Then** the system creates matched treatment and control groups using propensity score matching or random assignment.
2. **Given** test is live, **When** users are assigned to groups, **Then** treatment group sees ads normally while control group is suppressed from all campaign targeting.
3. **Given** test completes, **When** I analyze results, **Then** the system shows incremental conversions, incremental revenue, and incremental ROAS with confidence intervals.

---

### User Story 3 - Synthetic control modeling (Priority: P3)

As a data scientist, I can use synthetic control methods to measure incrementality when randomization isn't possible so that I can estimate causal impact for brand campaigns, always-on programs, or platform-wide changes.

**Why this priority**: Synthetic controls enable incrementality measurement without holdouts. Advanced methodology for sophisticated users.

**Independent Test**: Run synthetic control analysis comparing treated region to synthetic control (weighted combination of untreated regions), verify that incremental lift estimates match holdout test results within 20%.

**Acceptance Scenarios**:

1. **Given** I can't run a randomized test, **When** I configure synthetic control analysis, **Then** the system builds a synthetic control group by weighting untreated markets to match pre-treatment trends in the treated market.
2. **Given** synthetic control is created, **When** campaign launches, **Then** the system compares actual performance in treated market vs. counterfactual predictions from synthetic control.
3. **Given** analysis completes, **When** I review results, **Then** I see incremental lift with credible intervals and sensitivity analysis showing robustness of findings.

---

### Edge Cases

- What happens when markets have different seasonality? System accounts for time-varying confounders using difference-in-differences or fixed effects models.
- How does system handle spillover effects (users seeing ads in one geo, converting in another)? Advanced models detect and adjust for geographic spillover using mobile location data.
- What if sample size is too small for statistical power? System calculates minimum detectable effect (MDE) and recommends longer test duration or larger markets.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support geo-based experiments with random assignment of markets to treatment/control groups ensuring statistical balance.
- **FR-002**: System MUST suppress campaigns in control geos/audiences and ensure zero ad exposure during test periods.
- **FR-003**: System MUST calculate incremental lift using difference-in-differences or causal inference methods with confidence intervals.
- **FR-004**: System MUST perform power analysis to recommend test duration and sample size for desired minimum detectable effect.
- **FR-005**: System MUST support audience-level holdout tests with propensity score matching or randomization for user assignment.
- **FR-006**: System MUST implement synthetic control methods using weighted combinations of untreated units to estimate counterfactuals.
- **FR-007**: System MUST detect and adjust for spillover effects, contamination, and non-compliance in experiments.
- **FR-008**: System MUST provide detailed experiment reports with incremental conversions, incremental revenue, incremental ROAS, p-values, and confidence intervals.

### Non-Functional Requirements

- **NFR-001**: Geo assignment and audience randomization MUST complete in < 1 minute for experiments up to 1M users.
- **NFR-002**: Incremental lift calculations MUST update daily with cumulative results throughout test period.
- **NFR-003**: System MUST support 100+ concurrent incrementality experiments across workspaces.
- **NFR-004**: Statistical models MUST achieve >= 80% power for detecting 10% lift with p < 0.05.

### Key Entities

- **IncrementalityExperiment**: Experiment configuration with test_type (geo, audience, synthetic), treatment_criteria, control_criteria, start_date, end_date, and hypothesis
- **TreatmentGroup**: Treatment market/audience definitions with assignment_method (random, matched), size, and exposure_status
- **ControlGroup**: Control market/audience definitions with suppression_rules and matching_criteria
- **ExperimentResult**: Daily and cumulative results with treatment_conversions, control_conversions, incremental_lift, p_value, and confidence_intervals
- **SyntheticControl**: Synthetic control configuration with donor_pool, weights, pre_treatment_fit_r2, and counterfactual_predictions

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Incrementality experiments achieve >= 80% statistical power for detecting 10%+ lift with p < 0.05.
- **SC-002**: Geo experiments identify non-incremental campaigns (those with < 5% lift) within 30 days, enabling budget reallocation.
- **SC-003**: Incremental ROAS measurements are 30-50% lower than last-click attribution ROAS, revealing true causal impact.
- **SC-004**: 100% of experiments produce actionable insights (continue, optimize, or pause) with statistical confidence.
