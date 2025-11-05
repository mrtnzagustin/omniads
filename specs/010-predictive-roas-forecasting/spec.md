# Feature Specification: Predictive ROAS Forecasting

**Feature Branch**: `[010-predictive-roas-forecasting]`
**Created**: 2025-11-05
**Status**: Implemented
**Implementation Date**: 2025-11-05
**Input**: User description: "ML-powered forecasting of ROAS, revenue, and spend for next 7/30/90 days"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View ROAS forecasts (Priority: P1)

As a marketing manager, I can see AI-predicted ROAS for the next 7, 30, and 90 days with confidence intervals, so that I can plan budgets and set realistic performance expectations.

**Why this priority**: Forward-looking insights are critical for strategic planning and differentiates OmniAds from reactive dashboards.

**Independent Test**: Given 90 days of historical data, verify system generates forecasts for next 30 days with confidence intervals (e.g., "Predicted ROAS: 3.2x, Range: 2.8x - 3.6x").

**Acceptance Scenarios**:

1. **Given** I have 90+ days of campaign history, **When** I open the Forecasting dashboard, **Then** I see predicted ROAS, revenue, and spend for next 7, 30, and 90 days with confidence intervals (80% and 95%).
2. **Given** forecasts are generated, **When** I view the chart, **Then** I see historical actuals (solid line) and forecasted values (dashed line) with shaded confidence bands.
3. **Given** actual performance data comes in, **When** forecasts are updated daily, **Then** I can compare predicted vs actual to see forecast accuracy over time.

---

### User Story 2 - Scenario-based forecasting (Priority: P2)

As a growth manager, I can create "what-if" scenarios (e.g., "increase Meta spend by 20%") and see how predicted ROAS changes, so that I evaluate budget reallocation strategies before committing.

**Why this priority**: Scenario planning is high-value but requires stable baseline forecasting first.

**Independent Test**: Create scenario "Increase Google budget by $5K", verify forecast updates to show predicted impact on total revenue and ROAS.

**Acceptance Scenarios**:

1. **Given** I want to test a budget change, **When** I create a scenario "Increase TikTok daily budget from $500 to $750", **Then** the system shows updated forecast with predicted revenue, ROAS, and confidence intervals.
2. **Given** I have multiple scenarios, **When** I compare them side-by-side, **Then** I see a comparison table with expected outcomes ranked by projected ROAS.

---

### User Story 3 - Forecast accuracy tracking (Priority: P3)

As a data analyst, I can see historical forecast accuracy metrics (MAPE, RMSE) to understand how reliable predictions are.

**Why this priority**: Accuracy metrics build trust but are secondary to having forecasts available.

**Independent Test**: Compare 30-day-old forecasts against actual results, verify accuracy metrics are calculated and displayed.

**Acceptance Scenarios**:

1. **Given** 30 days have passed since a forecast was made, **When** I view forecast accuracy, **Then** I see MAPE (Mean Absolute Percentage Error) and RMSE for ROAS, revenue, and spend predictions.

---

### Edge Cases

- What if there's insufficient historical data (< 30 days)? Show message "Insufficient data for forecasting. Requires at least 30 days of campaign history" and disable forecasting.
- How to handle sudden trend changes (Black Friday spike)? Allow users to mark "seasonal events" in calendar which are factored into forecasting models.
- What about new campaigns with no history? Use channel-level aggregated patterns from similar campaigns as baseline.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST generate forecasts for ROAS, revenue, and spend at 7, 30, and 90-day horizons using time-series forecasting algorithms (Prophet, ARIMA, or ML models).
- **FR-002**: System MUST calculate 80% and 95% confidence intervals for all forecasts to communicate prediction uncertainty.
- **FR-003**: System MUST update forecasts daily as new actual data becomes available, retraining models weekly.
- **FR-004**: System MUST support scenario-based forecasting where users can adjust budget allocations and see predicted outcomes.
- **FR-005**: System MUST track forecast accuracy by comparing predictions against actuals and display MAPE, RMSE, and accuracy trends.
- **FR-006**: Users MUST be able to mark seasonal events (sales, holidays) in a calendar which the forecasting model incorporates.

### Key Entities

- **Forecast**: Predictions (workspaceId, forecastDate, targetDate, metricType: ROAS|REVENUE|SPEND, predictedValue, confidenceInterval80, confidenceInterval95, modelVersion)
- **ForecastScenario**: What-if scenarios (name, adjustments[], predictedOutcomes[])
- **ForecastAccuracyLog**: Historical accuracy tracking (forecastId, actualValue, errorMetrics)

### Technical Architecture

- Use Facebook Prophet or scikit-learn for time-series forecasting
- Features: historical ROAS trends, seasonality, day-of-week effects, spend levels
- Batch job runs daily to generate/update forecasts for all workspaces
- Store predictions in database for fast retrieval

## Success Criteria *(mandatory)*

- **SC-001**: Forecasts are generated for 100% of workspaces with 30+ days of historical data, updated daily.
- **SC-002**: Forecast accuracy (MAPE) is below 20% for 7-day predictions and below 30% for 30-day predictions over a 90-day evaluation period.
- **SC-003**: Scenario-based forecasts are calculated and displayed within 5 seconds of user changing parameters.
- **SC-004**: Users can view forecast vs actual comparison charts showing prediction accuracy over rolling 90-day window.
