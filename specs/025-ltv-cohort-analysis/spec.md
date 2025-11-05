# Feature Specification: LTV & Cohort Analysis

**Feature Branch**: `[025-ltv-cohort-analysis]`
**Created**: 2025-11-05
**Status**: Implemented
**Implementation Date**: 2025-11-05

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Calculate customer lifetime value by acquisition channel (Priority: P1)

As a CFO, I can see the lifetime value (LTV) of customers acquired through each marketing channel, so that I understand true ROI beyond first purchase.

**Acceptance Scenarios**:
1. **Given** I have 6 months of customer data, **When** I view LTV by channel, **Then** I see "Meta ads: $245 avg LTV, Google: $198 avg LTV, Organic: $312 avg LTV" with breakdown by 30/60/90/180-day LTV.
2. **Given** I want to compare LTV vs CAC, **When** I view the profitability chart, **Then** I see LTV:CAC ratio by channel (e.g., "Meta: 3.2:1, Google: 2.8:1").
3. **Given** I select a channel, **When** I drill down, **Then** I see LTV curves showing cumulative revenue over customer lifetime up to 12 months.

### User Story 2 - Analyze cohort retention and repeat purchase rates (Priority: P1)

As a growth manager, I can see cohort retention heatmaps showing how many customers return for 2nd, 3rd, 4th purchases by acquisition month/channel.

**Acceptance Scenarios**:
1. **Given** 12 months of cohorts, **When** I view retention heatmap, **Then** I see "Jan 2024 cohort: 35% made 2nd purchase, 18% made 3rd purchase" with color-coded visualization.
2. **Given** I compare channels, **When** I view retention comparison, **Then** I see "Google customers have 25% higher repeat rate vs Meta customers".

### User Story 3 - Forecast LTV for active customers (Priority: P2)

As a data scientist, I can see predicted LTV for currently active customers based on their behavior patterns.

**Acceptance Scenarios**:
1. **Given** a customer has made 2 purchases, **When** I view their profile, **Then** I see "Predicted LTV: $450 (based on similar customers)".

### Edge Cases
- What if customers have multiple touchpoints? Attribute LTV to first-touch channel with partial credit to assist channels using attribution model.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST calculate customer LTV by acquisition channel showing 30/60/90/180/365-day LTV.
- **FR-002**: System MUST calculate LTV:CAC ratio by channel and campaign.
- **FR-003**: System MUST provide cohort analysis with retention heatmaps showing repeat purchase rates by month.
- **FR-004**: System MUST compare cohort performance across channels, campaigns, and time periods.
- **FR-005**: System MUST forecast LTV for active customers using machine learning based on behavioral patterns.

### Key Entities
- **CustomerLTV**: Lifetime value tracking (customerId, acquisitionChannel, acquisitionCampaignId, ltv30, ltv90, ltv180, ltv365, predictedLTV)
- **Cohort**: Grouped customers (cohortMonth, acquisitionChannel, customerCount, avgLTV, retentionRates[])
- **CohortRetention**: Retention tracking (cohortId, period: MONTH_1|MONTH_2|..., retainedCustomers, repeatPurchaseRate)

### Technical Architecture
- Batch job calculates LTV daily for all customers
- Cohort analysis uses SQL window functions for efficient aggregation
- LTV prediction using random forest or gradient boosting on customer features (purchase frequency, AOV, days since last purchase)

## Success Criteria *(mandatory)*
- **SC-001**: LTV calculations are accurate within 5% of manual calculations (validated on 100 customer sample).
- **SC-002**: Cohort retention heatmaps render in under 3 seconds for 12 months of data.
- **SC-003**: Predicted LTV has MAPE < 20% when compared to actual LTV 6 months later (backtested on historical data).
