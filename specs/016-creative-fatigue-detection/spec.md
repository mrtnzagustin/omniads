# Feature Specification: Creative Fatigue Detection

**Feature Branch**: `[016-creative-fatigue-detection]`
**Created**: 2025-11-05
**Status**: Implemented
**Implementation Date**: 2025-11-05
**Input**: "Automatic detection of creative fatigue with refresh recommendations"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Detect creative fatigue automatically (Priority: P1)

As a media buyer, I receive automatic alerts when ad creatives show fatigue signals (declining CTR, rising CPM), so that I refresh creatives before performance significantly degrades.

**Why this priority**: Proactive fatigue detection prevents wasted spend and is uniquely valuable.

**Independent Test**: Simulate creative with declining CTR over 7 days, verify system detects fatigue and sends alert.

**Acceptance Scenarios**:

1. **Given** a creative has been running for 14+ days, **When** CTR declines by 30%+ from peak, **Then** the system flags it as "Fatigued" and sends a notification with recommendation to refresh.
2. **Given** I view the Creative Health Dashboard, **When** I open it, **Then** I see all creatives categorized as "Fresh" (0-7 days), "Aging" (8-21 days with stable performance), "Fatigued" (declining metrics), or "Exhausted" (>30 days active).
3. **Given** a creative is flagged as fatigued, **When** I view details, **Then** I see performance trend charts showing CTR/CPM degradation with markers indicating when fatigue started.

---

### User Story 2 - Receive creative refresh recommendations (Priority: P2)

As a creative strategist, I can see AI-recommended creative refreshes (new colors, new messaging, new formats) based on what's currently working, so that I quickly iterate on fatigued creatives.

**Why this priority**: Recommendations speed up refresh process but require fatigue detection working first.

**Independent Test**: Trigger fatigue on a video creative, verify AI suggests "Try carousel format" with rationale based on workspace trends.

**Acceptance Scenarios**:

1. **Given** a creative is fatigued, **When** AI analyzes it, **Then** it recommends specific changes: "Try shorter video (15s vs current 30s)" or "Test different color palette (current blue vs suggested warm tones)".
2. **Given** recommendations are provided, **When** I click "Auto-generate variant", **Then** the system queues AI ad copy generation or creative template with suggested changes.

---

### Edge Cases

- What if a creative naturally has seasonal performance patterns? Use seasonality-adjusted baselines to avoid false fatigue signals during off-peak periods.
- How to handle new creatives with limited data? Require minimum 500 impressions before fatigue analysis.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST monitor all active creatives daily for fatigue signals: CTR decline (>20% from 7-day peak), CPM increase (>30% from baseline), frequency above 3.
- **FR-002**: System MUST categorize creatives into lifecycle stages: Fresh, Aging, Fatigued, Exhausted based on performance trends and duration.
- **FR-003**: System MUST send automatic alerts when creatives enter "Fatigued" status with performance data and refresh recommendations.
- **FR-004**: System MUST provide AI-powered refresh recommendations analyzing workspace patterns and suggesting format, messaging, or visual changes.
- **FR-005**: System MUST track creative refresh history and measure performance improvement post-refresh to validate recommendations.

### Key Entities

- **CreativeFatigueStatus**: Health tracking (creativeId, status, fatigueScore, detectedAt, alertSent)
- **CreativeRefreshRecommendation**: AI suggestions (creativeId, recommendationType, rationale, generatedVariantId)

### Technical Architecture

- Daily batch job analyzes performance trends for all active creatives
- Fatigue score calculation: weighted combination of CTR trend, CPM trend, frequency, days active
- Alert triggers when fatigue score exceeds threshold (configurable, default: 70/100)

## Success Criteria *(mandatory)*

- **SC-001**: 95% of creatives with genuine performance decline are detected as fatigued within 48 hours of decline beginning.
- **SC-002**: False positive rate for fatigue detection is below 10% (validated through manual review of 100 flagged creatives).
- **SC-003**: Creative refresh recommendations result in 20%+ performance improvement when followed (measured on 50 refreshed creatives).
- **SC-004**: Users receive fatigue alerts via email/WhatsApp within 4 hours of detection during business hours.
