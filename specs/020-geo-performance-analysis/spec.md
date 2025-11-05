# Feature Specification: Geo-Performance Analysis

**Feature Branch**: `[020-geo-performance-analysis]`
**Created**: 2025-11-05
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View performance by geographic region (Priority: P1)

As a media buyer, I can see campaign performance broken down by country, state/province, and city with heatmaps and tables, so that I identify high-performing regions and optimize geographic targeting.

**Acceptance Scenarios**:
1. **Given** campaigns run in multiple regions, **When** I view Geo Analysis, **Then** I see a heatmap showing ROAS by country with color-coded performance (green=high, red=low).
2. **Given** I want to drill down, **When** I click on "United States", **Then** I see state-level breakdown with metrics (impressions, conversions, ROAS, CPA) per state.
3. **Given** I identify top-performing cities, **When** I sort by ROAS, **Then** I see "Buenos Aires: 4.2x ROAS, $2,500 spend" at the top.

### User Story 2 - Receive geo-based optimization recommendations (Priority: P2)

As a performance marketer, I receive AI recommendations to increase budget in high-performing regions and decrease in underperforming ones.

**Acceptance Scenarios**:
1. **Given** geo data shows significant performance variance, **When** AI analyzes it, **Then** I receive recommendations like "Increase California budget by 30% (4.5x ROAS) and reduce Texas budget by 20% (1.2x ROAS)".

### Edge Cases
- What if geo data is unavailable for some conversions? Show "Unknown Location" bucket with percentage of unattributed traffic.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST aggregate campaign performance by geographic levels: country, state/province, city.
- **FR-002**: System MUST provide heatmap visualization of ROAS/CPA by region with interactive drill-down.
- **FR-003**: System MUST calculate geo-specific metrics: conversion rate, average order value, customer lifetime value by region.
- **FR-004**: System MUST provide AI recommendations for geo-based budget optimization.

### Key Entities
- **GeoPerformance**: Regional metrics (region, level: COUNTRY|STATE|CITY, impressions, clicks, conversions, revenue, roas)

## Success Criteria *(mandatory)*
- **SC-001**: Geo performance data is available for 95%+ of conversions with location tracking enabled.
- **SC-002**: Heatmaps render in under 3 seconds for 100+ regions.
- **SC-003**: Users can drill down from country → state → city in under 2 clicks per level.
