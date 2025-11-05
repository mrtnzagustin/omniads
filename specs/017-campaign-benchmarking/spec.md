# Feature Specification: Campaign Performance Benchmarking

**Feature Branch**: `[017-campaign-benchmarking]`
**Created**: 2025-11-05
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Compare campaigns against industry benchmarks (Priority: P1)

As a marketing manager, I can see how my campaigns perform vs industry averages (CTR, CPC, CVR, ROAS) by vertical and region, so that I understand if my performance is competitive.

**Acceptance Scenarios**:
1. **Given** I select my industry vertical (Fashion/E-commerce), **When** I view benchmarks, **Then** I see my ROAS (3.2x) vs industry average (2.8x) with percentile ranking (70th percentile).
2. **Given** my CTR is below benchmark, **When** I view the gap analysis, **Then** I receive AI recommendations to improve ("Your CTR is 0.8% vs 1.2% average - try shorter video creatives").

### User Story 2 - Track performance trends vs benchmarks over time (Priority: P2)

As a data analyst, I can see 90-day trends showing how my performance gap vs benchmarks is evolving, so that I track improvement initiatives.

**Acceptance Scenarios**:
1. **Given** 90 days of data, **When** I view trend charts, **Then** I see my ROAS line vs industry benchmark line with narrowing/widening gaps highlighted.

### Edge Cases
- What if no benchmark data exists for niche vertical? Show broader category benchmarks with disclaimer.
- How to keep benchmarks current? Update monthly from aggregated anonymous user data and public industry reports.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST provide industry benchmark data for key metrics (CTR, CPC, CPA, CVR, ROAS) segmented by vertical (10+ categories) and region.
- **FR-002**: System MUST calculate user's percentile ranking vs benchmarks and highlight performance gaps.
- **FR-003**: System MUST show trend analysis comparing user performance vs benchmarks over 30/60/90 days.
- **FR-004**: System MUST provide AI recommendations when performance is below benchmark (bottom 40th percentile).

### Key Entities
- **IndustryBenchmark**: Aggregate data (vertical, region, metric, p50, p75, p90, updatedAt)
- **BenchmarkComparison**: User vs industry (workspaceId, metric, userValue, benchmarkValue, percentile, gap)

### Technical Architecture
- Aggregate anonymous metrics from all OmniAds users monthly
- Supplement with public data (Meta Business benchmarks, Google Ads benchmarks)
- PostgreSQL for storage with indexed queries by vertical/region

## Success Criteria *(mandatory)*
- **SC-001**: Benchmark data is available for 10+ industry verticals and updated monthly.
- **SC-002**: 90% of users with 30+ days of data can view their percentile rankings vs benchmarks.
- **SC-003**: Benchmark comparison page loads in under 2 seconds.
