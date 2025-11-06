#!/bin/bash

# Feature definitions: number|name|description
FEATURES=(
  "068|multi-platform-opportunity-scorer|Multi-Platform Opportunity Scorer - Score campaign setup quality (0-100) across all platforms like Meta Advantage+"
  "069|ai-creative-testing-arena|AI Creative Testing Arena - Automated A/B/n testing with AI-generated variants and performance prediction"
  "070|sentiment-driven-budget-allocator|Sentiment-Driven Budget Allocator - Adjust budgets based on comment sentiment analysis in real-time"
  "071|competitive-ad-intelligence-cloner|Competitive Ad Intelligence Cloner - Clone and adapt top-performing competitor ads with AI"
  "072|roas-guarantee-engine|ROAS Guarantee Engine - Guarantee ROAS targets with auto-optimization and budget insurance"
  "073|influencer-performance-predictor|Influencer Performance Predictor - ML model to predict influencer campaign ROI before hiring"
  "074|dynamic-landing-page-generator|Dynamic Landing Page Generator - Auto-generate personalized landing pages per audience segment"
  "075|smart-creative-auto-refresh|Smart Creative Auto-Refresh - Detect creative fatigue and auto-generate refreshed variants"
  "076|voice-search-ad-optimizer|Voice Search Ad Optimizer - Optimize campaigns for voice search queries (Alexa, Google Assistant)"
  "077|retail-media-network-hub|Retail Media Network Hub - Unified dashboard for Amazon Ads, Walmart Connect, Instacart Ads"
  "078|ai-copywriter-multivariate|AI Copywriter Multivariate - Generate 50+ copy variants with AI and auto-test best performers"
  "079|cross-platform-symphony-integration|Cross-Platform Symphony Integration - Direct integration with TikTok Symphony creative tools"
  "080|smart-budget-insurance-pool|Smart Budget Insurance Pool - Collective budget insurance with shared risk pool"
  "081|realtime-competitor-bid-monitor|Real-Time Competitor Bid Monitor - Monitor competitor bidding patterns in real-time"
  "082|unified-social-inbox|Unified Social Inbox - All ad comments, DMs, reviews in one AI-moderated inbox"
  "083|ai-max-campaign-replicator|AI Max Campaign Replicator - Replicate Google's AI Max across Meta, TikTok, and other platforms"
  "084|customer-lifecycle-journey-mapper|Customer Lifecycle Journey Mapper - Visualize and optimize full customer lifecycle across platforms"
  "085|cross-platform-broad-match-optimizer|Cross-Platform Broad Match Optimizer - Intelligent broad match optimization across all platforms"
  "086|sustainability-ad-impact-scorer|Sustainability Ad Impact Scorer - Score ads by carbon footprint and sustainability impact"
  "087|first-party-data-enrichment-hub|First-Party Data Enrichment Hub - Enrich first-party data with AI predictions (propensity, LTV, churn)"
)

for feature in "${FEATURES[@]}"; do
  IFS='|' read -r number slug description <<< "$feature"

  DIR="/home/user/omniads/specs/${number}-${slug}"
  mkdir -p "$DIR"

  SPEC_FILE="$DIR/spec.md"

  # Extract feature title from description (before the dash)
  FEATURE_TITLE=$(echo "$description" | cut -d'-' -f1 | xargs)
  # Extract feature description (after the dash)
  FEATURE_DESC=$(echo "$description" | cut -d'-' -f2- | xargs)

  cat > "$SPEC_FILE" << SPECEOF
# Feature Specification: ${FEATURE_TITLE}

**Feature Branch**: \`[${number}-${slug}]\`
**Created**: 2025-11-05
**Status**: Draft
**Input**: User description: "${description}"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core functionality (Priority: P1)

As a marketing professional, I can use ${FEATURE_TITLE} to ${FEATURE_DESC} so that I can improve campaign performance and efficiency.

**Why this priority**: This represents the core value proposition that makes the feature independently valuable.

**Independent Test**: Connect campaign data and verify that the feature provides actionable insights and recommendations.

**Acceptance Scenarios**:

1. **Given** relevant campaign data exists, **When** I access this feature, **Then** I see actionable insights and can take optimization actions.
2. **Given** I configure feature settings, **When** I save preferences, **Then** the system applies these settings to future operations.
3. **Given** the feature processes data, **When** processing completes, **Then** I receive notifications with key findings.

---

### User Story 2 - Advanced configuration (Priority: P2)

As a power user, I can customize ${FEATURE_TITLE} behavior and set up automation rules so that the system works according to my specific needs.

**Why this priority**: Customization enables the feature to adapt to diverse business requirements.

**Independent Test**: Configure custom rules and verify they apply correctly to test scenarios.

**Acceptance Scenarios**:

1. **Given** advanced settings are available, **When** I configure automation rules, **Then** the system executes actions based on my criteria.
2. **Given** I want to control feature behavior, **When** I set thresholds and limits, **Then** the system respects these boundaries.

---

### User Story 3 - Analytics and reporting (Priority: P3)

As a data analyst, I can access historical data and performance metrics from ${FEATURE_TITLE} so that I can measure feature impact and ROI.

**Why this priority**: Measurement enables continuous improvement and ROI validation.

**Independent Test**: Access analytics dashboard and verify metrics are accurate and exportable.

**Acceptance Scenarios**:

1. **Given** historical data exists, **When** I view analytics, **Then** I see trends, comparisons, and performance indicators.
2. **Given** I need to share results, **When** I export data, **Then** I receive reports in multiple formats.

---

### Edge Cases

- What happens when insufficient data is available? Provide clear messaging and minimum data requirements.
- How does system handle API failures or rate limits? Implement retry logic and graceful degradation.
- What if conflicting settings are configured? Validate settings and provide clear error messages.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide core feature functionality with intuitive user interface.
- **FR-002**: System MUST integrate with existing campaign data and ad platform APIs.
- **FR-003**: System MUST support configuration and customization per workspace.
- **FR-004**: System MUST log all actions and decisions for audit trail.
- **FR-005**: System MUST provide real-time or near-real-time data processing where applicable.
- **FR-006**: System MUST support export and reporting capabilities.
- **FR-007**: System MUST handle errors gracefully and provide actionable error messages.
- **FR-008**: System MUST respect workspace isolation and data privacy.

### Non-Functional Requirements

- **NFR-001**: Feature MUST process requests within 5 seconds for 95th percentile.
- **NFR-002**: System MUST scale to handle 1000+ concurrent users per workspace.
- **NFR-003**: Feature MUST maintain 99.9% uptime during business hours.
- **NFR-004**: All AI/ML operations MUST complete within 30 seconds or provide progress updates.

### Key Entities

- **${FEATURE_TITLE}Config**: Configuration entity for user preferences and rules
- **${FEATURE_TITLE}Result**: Results and recommendations generated by the feature
- **${FEATURE_TITLE}History**: Historical tracking of feature usage and outcomes

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Feature successfully processes 95%+ of requests without errors within 30 days of launch.
- **SC-002**: Users report 80%+ satisfaction with feature usefulness in surveys.
- **SC-003**: Feature contributes to measurable improvement in key metrics (ROAS, efficiency, time saved) within 60 days.
- **SC-004**: Documentation and support requests decrease by 50% after first 30 days as feature becomes intuitive.
SPECEOF

  echo "Created spec for ${number}: ${FEATURE_TITLE}"
done

echo ""
echo "All 20 specs created successfully (068-087)!"
echo "Run 'ls specs/ | grep -E \"^0(6[8-9]|7[0-9]|8[0-7])\"' to verify."
