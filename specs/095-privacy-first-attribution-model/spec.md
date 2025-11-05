# Feature Specification: Privacy-First Attribution Model

**Feature Branch**: `[095-privacy-first-attribution-model]`
**Created**: 2025-11-05
**Status**: Implemented
**Implementation Date**: 2025-11-05
**Input**: User description: "Privacy-First Attribution Model - Cookie-less multi-touch attribution using AI, probabilistic matching, and aggregated conversion modeling"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Probabilistic attribution without cookies (Priority: P1)

As a marketer adapting to privacy changes, I can measure multi-touch attribution without third-party cookies using AI-powered probabilistic matching so that I maintain attribution accuracy despite signal loss.

**Why this priority**: Cookie deprecation breaks traditional attribution. This preserves measurement capability in privacy-first world.

**Independent Test**: Run campaigns for 30 days with cookie-based vs. privacy-first attribution, verify that privacy model captures >= 70% of conversions with comparable path accuracy.

**Acceptance Scenarios**:

1. **Given** third-party cookies are deprecated, **When** I enable privacy-first attribution, **Then** the system uses probabilistic matching based on first-party data, device fingerprints (privacy-safe), and statistical modeling to reconstruct customer journeys.
2. **Given** customer journeys are reconstructed, **When** I view attribution reports, **Then** I see multi-touch attribution across channels (Meta, Google, TikTok, email, organic) with confidence scores for each touchpoint.
3. **Given** attribution model is active, **When** I compare it to cookie-based historical data, **Then** the system shows model accuracy metrics and reconciliation reports.

---

### User Story 2 - Aggregated conversion modeling (Priority: P2)

As a performance analyst, I can use aggregated conversion modeling (similar to Google's ECM) to estimate conversions that can't be directly measured so that I get complete performance visibility despite privacy restrictions.

**Why this priority**: Direct measurement gaps create blind spots. Modeling fills gaps for complete picture. Builds on P1 probabilistic foundations.

**Independent Test**: Configure conversion modeling, verify that modeled conversions + observed conversions match ground truth (transaction logs) within 15%.

**Acceptance Scenarios**:

1. **Given** some conversions can't be directly measured (iOS ATT opt-outs, cross-device, etc.), **When** conversion modeling runs, **Then** the system uses machine learning to estimate missing conversions based on observable patterns.
2. **Given** modeled conversions are generated, **When** I view reports, **Then** I see breakdown of observed vs. modeled conversions with model confidence intervals.
3. **Given** modeling is active, **When** I compare total conversions to ground truth (order exports), **Then** the system achieves >= 85% accuracy in total conversion volume.

---

### User Story 3 - AI-powered attribution weighting (Priority: P3)

As a data-driven marketer, I can use AI to learn optimal attribution weights from conversion data so that I move beyond rule-based models (linear, time-decay) to data-driven attribution that reflects actual customer journeys.

**Why this priority**: Data-driven attribution is more accurate than heuristics. After probabilistic + modeling work, this optimizes credit assignment.

**Independent Test**: Train AI attribution model on 6 months of data, verify that it outperforms time-decay model in predicting future conversions by >= 20%.

**Acceptance Scenarios**:

1. **Given** I have 6+ months of customer journey data, **When** I train AI attribution model, **Then** the system learns touchpoint weights that maximize predictive accuracy for future conversions.
2. **Given** AI model is trained, **When** I apply it to campaigns, **Then** each touchpoint receives data-driven credit allocation rather than rule-based weights.

---

### Edge Cases

- What happens when first-party data is sparse (new customers, new campaigns)? System falls back to cohort-level statistical models and gradually personalizes as data accumulates.
- How does system handle cross-device journeys? Uses probabilistic cross-device graphs and deterministic signals (logged-in users) to link devices.
- What if modeled conversions are inaccurate? System provides calibration dashboards showing observed vs. modeled conversion comparisons and allows model retraining.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST implement probabilistic attribution using first-party data, privacy-safe fingerprints, and statistical matching to reconstruct customer journeys.
- **FR-002**: System MUST support 6 standard attribution models (last-click, first-click, linear, time-decay, position-based, data-driven).
- **FR-003**: System MUST use machine learning (XGBoost, neural networks) to estimate conversions that can't be directly measured.
- **FR-004**: System MUST calibrate modeled conversions against ground truth data (order exports, CRM data) and report accuracy metrics.
- **FR-005**: System MUST train AI attribution models using historical journey data to learn optimal touchpoint weights.
- **FR-006**: System MUST provide attribution reports showing touchpoint credit across all channels with confidence intervals.
- **FR-007**: System MUST support cross-device journey stitching using probabilistic device graphs and logged-in user signals.
- **FR-008**: System MUST operate in full compliance with GDPR, CCPA, and other privacy regulations without requiring third-party cookies.

### Non-Functional Requirements

- **NFR-001**: Attribution model MUST process 1M+ events per day in near-real-time (< 1 hour latency).
- **NFR-002**: Probabilistic matching MUST achieve >= 70% journey reconstruction accuracy compared to cookie-based baseline.
- **NFR-003**: Conversion modeling MUST achieve >= 85% accuracy in total conversion volume vs. ground truth.
- **NFR-004**: AI attribution model MUST outperform rule-based models by >= 15% in predictive accuracy.

### Key Entities

- **AttributionModel**: Model configuration with model_type, training_data, touchpoint_weights, and accuracy_metrics
- **CustomerJourney**: Reconstructed user journey with touchpoints array, confidence_score, and attribution_method (deterministic, probabilistic)
- **Touchpoint**: Individual marketing interaction with channel, timestamp, attributed_credit, and confidence_level
- **ModeledConversion**: Estimated conversions with conversion_probability, model_version, and confidence_interval
- **AttributionCalibration**: Model accuracy tracking with observed_conversions, modeled_conversions, rmse, and bias_metrics

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Privacy-first attribution captures >= 70% of customer journeys with comparable accuracy to cookie-based attribution.
- **SC-002**: Conversion modeling achieves >= 85% accuracy in total conversion volume compared to ground truth transaction logs.
- **SC-003**: AI data-driven attribution outperforms rule-based models by >= 15% in predicting future conversion patterns.
- **SC-004**: System maintains 100% compliance with GDPR, CCPA, and privacy regulations with zero third-party cookie dependencies.
