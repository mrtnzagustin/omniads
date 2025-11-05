# Feature Specification: Product Performance Analytics

**Feature Branch**: `[024-product-performance-analytics]`
**Created**: 2025-11-05
**Status**: Implemented
**Implementation Date**: 2025-11-05

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View detailed product-level performance (Priority: P1)

As an e-commerce manager, I can see which products drive the most revenue, have the highest ROAS, and convert best from ads vs organic, so that I optimize product promotion strategies.

**Acceptance Scenarios**:
1. **Given** I have 100+ products, **When** I view Product Analytics, **Then** I see a table ranked by ad-driven revenue showing: product name, total revenue, ad spend, ROAS, organic revenue, total conversions.
2. **Given** I select a product, **When** I drill down, **Then** I see which campaigns promote it, creative performance, audience segments that convert best, and average order value.
3. **Given** I want to find underutilized products, **When** I filter by "High organic conversion, low ad spend", **Then** I see products that are naturally popular but under-advertised (PROMOTE_ORGANIC opportunity).

### User Story 2 - Identify cross-sell and bundle opportunities (Priority: P2)

As a merchandiser, I can see which products are frequently purchased together, so that I create bundle campaigns or cross-sell recommendations.

**Acceptance Scenarios**:
1. **Given** 30 days of order data, **When** I view Product Affinity analysis, **Then** I see product pairs with co-purchase rates (e.g., "Jean + T-shirt: 35% co-purchase rate").
2. **Given** strong affinity exists, **When** AI analyzes it, **Then** it suggests "Create bundle campaign: Jean + T-shirt for $89 (12% discount)".

### User Story 3 - Forecast product demand (Priority: P3)

As an inventory manager, I can see predicted demand for products over next 30 days based on ad campaigns and seasonality.

**Acceptance Scenarios**:
1. **Given** historical sales data and active campaigns, **When** I view demand forecast, **Then** I see predicted units sold by product for next 7/14/30 days with confidence intervals.

### Edge Cases
- What if products have variations (sizes/colors)? Support grouping by parent SKU or viewing by variant.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST aggregate product-level performance across all campaigns showing revenue, spend, ROAS, conversions, AOV.
- **FR-002**: System MUST identify product affinity using market basket analysis (products frequently purchased together).
- **FR-003**: System MUST compare ad-driven vs organic performance per product.
- **FR-004**: System MUST provide AI recommendations for underutilized high-potential products (PROMOTE_ORGANIC) and bundle opportunities (CREATE_BUNDLE).
- **FR-005**: System MUST forecast product demand for 7/14/30 days using historical data and active campaigns.

### Key Entities
- **ProductPerformance**: Aggregated metrics (productId, adRevenue, organicRevenue, adSpend, roas, conversions, aov)
- **ProductAffinity**: Cross-sell data (productA, productB, coPurchaseRate, frequency, avgOrderValue)
- **ProductDemandForecast**: Predictions (productId, forecastDate, predictedUnits, confidence)

## Success Criteria *(mandatory)*
- **SC-001**: Product performance data is accurate within 5% of actual platform data (spot-checked for 50 products).
- **SC-002**: Product affinity analysis identifies bundle opportunities with 30%+ co-purchase rate.
- **SC-003**: Demand forecasts have MAPE < 25% for 7-day predictions.
