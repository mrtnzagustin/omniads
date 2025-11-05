# Feature Specification: Unified Audience Segmentation

**Feature Branch**: `[101-unified-audience-segmentation]`
**Created**: 2025-11-05
**Status**: Implemented
**Implementation Date**: 2025-11-05
**Input**: User description: "Unified Audience Segmentation - Cross-platform audience builder with AI-powered segmentation, lookalikes, and automatic sync to Meta/Google/TikTok"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Universal audience builder (Priority: P1)

As a targeting specialist, I can build audience segments once in OmniAds and automatically sync them to Meta, Google, and TikTok so that I maintain consistent targeting across platforms without rebuilding audiences three times.

**Why this priority**: Building audiences separately on each platform wastes 5-10 hours per campaign. Universal builder saves time and ensures consistency.

**Independent Test**: Create one audience segment, sync to 3 platforms, verify that segment size and composition match within 10% across platforms.

**Acceptance Scenarios**:

1. **Given** I want to create an audience, **When** I use the universal builder, **Then** I can combine criteria from multiple sources (CRM data, website visitors, purchase behavior, engagement signals) into one unified segment.
2. **Given** segment is defined, **When** I click "Sync to Platforms", **Then** the system creates equivalent audiences on Meta Custom Audiences, Google Customer Match, and TikTok Custom Audiences simultaneously via API.
3. **Given** audiences are synced, **When** I view status, **Then** I see match rates, segment sizes, and last sync timestamps for each platform with automatic daily refresh.

---

### User Story 2 - AI-powered smart segmentation (Priority: P2)

As a growth marketer, I can use AI to automatically discover high-value audience segments based on conversion patterns, engagement behavior, and predictive scoring so that I find profitable audiences I wouldn't have identified manually.

**Why this priority**: AI discovers hidden segments that outperform manual targeting by 20-40%. After basic builder works, AI adds intelligence.

**Independent Test**: Run AI segmentation on 6 months of customer data, verify that AI-discovered segments have >= 30% higher conversion rates than manual demographic segments.

**Acceptance Scenarios**:

1. **Given** I have customer and campaign data, **When** I run AI segmentation, **Then** the system uses clustering and pattern recognition to identify distinct behavioral segments (e.g., "weekend evening browsers who convert on mobile").
2. **Given** AI segments are discovered, **When** I review them, **Then** I see segment definitions, size, predicted performance scores, and recommended use cases (acquisition, retention, upsell).
3. **Given** I activate AI segments, **When** I launch campaigns, **Then** they perform 20-40% better than manual demographic targeting.

---

### User Story 3 - Cross-platform lookalike amplification (Priority: P3)

As a performance marketer, I can create cross-platform lookalike audiences that combine best customers from all platforms to find high-quality prospects so that I expand reach beyond single-platform lookalikes.

**Why this priority**: Cross-platform lookalikes capture users who exist on multiple platforms, improving quality. Builds on P1/P2 infrastructure.

**Independent Test**: Create cross-platform lookalike from top 1,000 customers, verify that it finds 50%+ more high-quality prospects than single-platform lookalikes.

**Acceptance Scenarios**:

1. **Given** I have high-value customers across platforms, **When** I create cross-platform lookalike, **Then** the system combines customer signals from Meta, Google, and TikTok to find users who match multi-platform behavioral patterns.
2. **Given** cross-platform lookalike is created, **When** I deploy it, **Then** each platform receives optimized lookalike seeds that reflect unified customer profiles.

---

### Edge Cases

- What happens when match rates are low (< 30%) on some platforms? System provides recommendations to improve match rates (add email hashing, include phone numbers, expand data sources).
- How does system handle audience size minimums (1,000 on Meta, 1,000 on Google)? Warns users when segments are below platform minimums and suggests expansion criteria.
- What if customers opt out or request data deletion? System automatically removes opted-out users from all synced audiences and maintains GDPR/CCPA compliance logs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide universal audience builder supporting multiple data sources (CRM uploads, website pixels, purchase data, engagement signals).
- **FR-002**: System MUST sync audiences to Meta Custom Audiences, Google Customer Match, and TikTok Custom Audiences via API.
- **FR-003**: System MUST maintain automated daily audience refresh syncing additions/removals to platforms.
- **FR-004**: System MUST use AI clustering and pattern recognition to discover behavioral segments from customer data.
- **FR-005**: System MUST score AI-discovered segments with predicted performance metrics (conversion probability, LTV, engagement likelihood).
- **FR-006**: System MUST create cross-platform lookalike audiences by combining seed data from multiple platforms.
- **FR-007**: System MUST provide audience analytics showing match rates, size, composition, and performance by platform.
- **FR-008**: System MUST support audience suppression (exclude converters, competitors, churned customers) across all platforms.

### Non-Functional Requirements

- **NFR-001**: Audience sync to 3 platforms MUST complete in < 15 minutes for audiences up to 100,000 users.
- **NFR-002**: AI segmentation MUST process 1M+ customer records in < 30 minutes.
- **NFR-003**: Match rates MUST achieve >= 60% on Meta, >= 40% on Google, >= 50% on TikTok for email-based audiences.
- **NFR-004**: System MUST support 1,000+ active audiences per workspace with daily refresh.

### Key Entities

- **UnifiedAudience**: Audience definition with name, inclusion_criteria, exclusion_criteria, data_sources, and sync_config
- **AudienceSegment**: Individual segment with segment_type (manual, ai_discovered, lookalike), size, predicted_performance, and composition
- **PlatformAudience**: Platform-specific audience instance with platform, audience_id, match_rate, size, and last_sync
- **AISegmentDiscovery**: AI-discovered segment with clustering_method, segment_characteristics, performance_prediction, and confidence_score
- **LookalikeConfiguration**: Lookalike settings with seed_audience, similarity_percentage, platforms, and expected_reach
- **AudienceSyncLog**: Sync history with sync_timestamp, users_added, users_removed, errors, and match_rate_by_platform

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Universal audience builder reduces audience creation time by 70% (from 5-10 hours to < 90 minutes for multi-platform campaigns).
- **SC-002**: AI-discovered segments outperform manual demographic targeting by 20-40% in conversion rates.
- **SC-003**: Cross-platform lookalikes find 50%+ more high-quality prospects compared to single-platform lookalikes.
- **SC-004**: Automated audience sync maintains 99%+ accuracy with daily refresh ensuring targeting consistency across platforms.
