# Feature Specification: Multi-Channel Attribution Modeling

**Feature Branch**: `[009-multi-channel-attribution]`
**Created**: 2025-11-05
**Status**: Draft
**Input**: User description: "Marketing Mix Modeling and multi-touch attribution to understand channel contribution to conversions"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View channel contribution analysis (Priority: P1)

As a marketing strategist, I can see which marketing channels (Meta, Google, TikTok, Organic) contribute most to conversions using multiple attribution models, so that I understand the true value of each channel beyond last-click attribution.

**Why this priority**: Attribution is fundamental for accurate ROI measurement and budget allocation decisions.

**Independent Test**: Create a conversion with multiple touchpoints (TikTok ad → Google search → Meta retarget → purchase), verify all attribution models calculate channel contributions correctly.

**Acceptance Scenarios**:

1. **Given** a customer journey with multiple touchpoints, **When** I view the attribution report, **Then** I see channel contributions calculated using Last-Click, First-Click, Linear, Time-Decay, and Position-Based models.
2. **Given** I select the "Linear" model, **When** I compare channel ROAS, **Then** each touchpoint receives equal credit and ROAS is calculated accordingly.
3. **Given** I want to understand assisted conversions, **When** I view the channel report, **Then** I see metrics like "Assist Rate" showing how often each channel participates in conversions without being the last click.

---

### User Story 2 - Configure custom attribution models (Priority: P2)

As a data analyst, I can create custom attribution models with weighted touchpoints based on business logic, so that attribution reflects my company's unique customer journey patterns.

**Why this priority**: Custom models improve accuracy but require standard models working first.

**Independent Test**: Create a custom model with 40% weight on first click, 60% on last click, verify conversions are attributed accordingly.

**Acceptance Scenarios**:

1. **Given** I want a custom attribution model, **When** I configure weights for each position (first: 30%, middle: 20%, last: 50%), **Then** the system applies these weights to all multi-touch conversions.
2. **Given** I've configured a custom model, **When** I apply it to historical data, **Then** I can compare how channel performance changes versus standard models.

---

### User Story 3 - Analyze customer journey paths (Priority: P2)

As a growth manager, I can visualize common customer journey paths from first touch to conversion, so that I optimize channel sequencing and identify high-converting paths.

**Why this priority**: Journey insights drive strategic optimizations but require basic attribution infrastructure first.

**Independent Test**: Generate 100 conversions with varied paths, verify top conversion paths are identified with frequency and conversion rates.

**Acceptance Scenarios**:

1. **Given** there are 30 days of conversion data, **When** I view the Journey Paths report, **Then** I see the top 20 paths ranked by frequency (e.g., "TikTok → Google → Meta → Conversion: 45 times, 12% conversion rate").
2. **Given** I select a specific path, **When** I drill down, **Then** I see average time between touchpoints, drop-off rates, and ROAS for customers who followed that path.

---

### Edge Cases

- What happens with incomplete journey data (user cleared cookies)? Tag journeys as "partial" and provide estimated attribution using probabilistic modeling.
- How to handle touchpoints occurring within minutes (user clicked multiple ads)? Implement deduplication window (default: 30 minutes) to merge redundant touchpoints.
- What if there are 20+ touchpoints in one journey? Cap attribution calculations at first 15 touchpoints to prevent performance issues.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST track customer touchpoints across all channels (Meta, Google, TikTok, Organic, Email) with timestamps and store them in a TouchpointEvent entity.
- **FR-002**: System MUST implement five standard attribution models: Last-Click, First-Click, Linear, Time-Decay (7-day half-life), and Position-Based (40% first, 40% last, 20% middle).
- **FR-003**: System MUST calculate attributed revenue and ROAS for each channel under each attribution model, allowing users to switch models in the UI.
- **FR-004**: System MUST identify and visualize top customer journey paths showing sequence, frequency, time-to-convert, and conversion rates.
- **FR-005**: System MUST support custom attribution models where users can define position-based weights (first, middle, last) via configuration.
- **FR-006**: System MUST calculate assisted conversion metrics showing how often each channel participates in conversions without being the last click.

### Key Entities

- **TouchpointEvent**: User interaction tracking (userId, channel, campaignId, adId, timestamp, sessionId, eventType: IMPRESSION | CLICK | VIEW)
- **ConversionPath**: Complete journey from first touch to conversion (userId, touchpoints[], totalRevenue, conversionTimestamp)
- **AttributionResult**: Calculated attribution by model (channel, model, attributedRevenue, attributedConversions, attributedROAS)
- **CustomAttributionModel**: User-defined models (name, weights, rules)

### Technical Architecture

Use event tracking via pixel/SDK → Store in TouchpointEvent → Batch process nightly to build ConversionPath → Calculate AttributionResult for all models

## Success Criteria *(mandatory)*

- **SC-001**: 100% of conversions with trackable touchpoints have attribution calculated for all 5 standard models within 24 hours.
- **SC-002**: Attribution reports load in under 3 seconds for 90 days of data with 10,000+ conversions.
- **SC-003**: Users can switch between attribution models in the UI and see updated channel ROAS instantly (cached results).
- **SC-004**: Top 20 customer journey paths are accurately identified and ranked by conversion frequency for any date range.
