# Feature Specification: Competitor Ad Intelligence

**Feature Branch**: `[011-competitor-ad-intelligence]`
**Created**: 2025-11-05
**Status**: Draft
**Input**: User description: "Track competitor ads, creatives, messaging, and estimated spend (inspired by SpyFu/AdBeat)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add competitors to track (Priority: P1)

As a marketing strategist, I can add competitor domains/brands to track, and the system automatically discovers their ads across Meta, Google, and TikTok, so that I stay informed about competitive positioning.

**Why this priority**: Competitor tracking is the foundation for all competitive intelligence features.

**Independent Test**: Add competitor domain "competitor.com", verify system discovers their active ads within 24 hours.

**Acceptance Scenarios**:

1. **Given** I want to track a competitor, **When** I add their domain "example.com" or brand name, **Then** the system queues a discovery job to find their ads across Meta Ad Library, Google Transparency Center, and TikTok Creative Center.
2. **Given** a competitor has been added, **When** discovery completes, **Then** I see a list of their active ads with thumbnails, ad copy, call-to-action, and detected platforms.
3. **Given** I track multiple competitors, **When** I view the competitors list, **Then** I see each competitor with metrics: total ads found, active ads, estimated spend (if available), and last updated timestamp.

---

### User Story 2 - Analyze competitor ad creatives (Priority: P1)

As a creative director, I can browse competitor ad creatives, filter by platform/format, and see which ads have been running longest (indicating success), so that I identify winning creative patterns.

**Why this priority**: Creative insights drive immediate action and differentiation.

**Independent Test**: Browse competitor ads, sort by "running duration", verify longest-running ads appear first.

**Acceptance Scenarios**:

1. **Given** a competitor has 50+ ads tracked, **When** I view their ads gallery, **Then** I can filter by platform (Meta/Google/TikTok), format (image/video/carousel), and sort by first-seen date, last-seen date, or estimated impressions.
2. **Given** I select a competitor ad, **When** I view details, **Then** I see the creative, headline, description, CTA, detected landing page URL, and a timeline showing when it was active.
3. **Given** an ad has been running for 60+ days, **When** I view it, **Then** the system flags it as "Long-running (likely successful)" to highlight proven creatives.

---

### User Story 3 - Competitor spend estimates (Priority: P2)

As a CMO, I can see estimated monthly ad spend for each competitor by platform, so that I understand their investment levels and competitive pressure.

**Why this priority**: Spend estimates inform strategic budget decisions but require significant data aggregation first.

**Independent Test**: For a tracked competitor with public spend data (via Meta Ad Library), verify system displays estimated monthly spend.

**Acceptance Scenarios**:

1. **Given** a competitor has ads with spend data available (Meta Ad Library), **When** I view their profile, **Then** I see estimated monthly spend by platform with a disclaimer "Estimates based on public data".
2. **Given** spend estimates are available, **When** I view the trend chart, **Then** I see how their estimated spend has changed over the past 6 months.

---

### User Story 4 - Receive competitor alerts (Priority: P3)

As a marketing manager, I can set alerts when competitors launch new campaigns or significantly increase spend, so that I can react quickly to competitive moves.

**Why this priority**: Alerts provide proactive insights but require stable tracking infrastructure first.

**Independent Test**: Set alert "notify when Competitor X launches 5+ new ads in one day", launch matching scenario, verify alert is sent.

**Acceptance Scenarios**:

1. **Given** I configure an alert "Notify when [Competitor] launches 10+ new ads", **When** the competitor launches 12 new ads, **Then** I receive an email/WhatsApp notification with a summary and link to view the ads.

---

### Edge Cases

- What if a competitor removes an ad before we track it? Store historical snapshots so once an ad is discovered, it remains in our database even if the competitor deletes it.
- How to handle private/unlisted ads not in public ad libraries? Acknowledge limitation and only track publicly disclosed ads (Meta Ad Library, Google Transparency).
- What if competitor brands have similar names? Allow users to refine matches and exclude false positives.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to add competitors by domain, brand name, or Facebook Page ID, and automatically discover their ads from public sources.
- **FR-002**: System MUST integrate with Meta Ad Library API, Google Ads Transparency Center, and TikTok Creative Center (or equivalents) to fetch competitor ads.
- **FR-003**: System MUST store competitor ad data including creative (image/video URL), ad copy, headline, CTA, platform, first seen date, last seen date, and landing page.
- **FR-004**: System MUST provide filtering and sorting options: by platform, format, date range, running duration, and keyword search.
- **FR-005**: System MUST flag long-running ads (60+ days active) as "likely successful" based on the assumption that advertisers stop unsuccessful ads quickly.
- **FR-006**: System MUST estimate monthly spend for competitors using Meta Ad Library spend ranges (where available) and display with appropriate disclaimers.
- **FR-007**: System MUST support alerts when competitors launch new campaigns (X+ new ads in Y days) or estimated spend changes significantly.

### Key Entities

- **Competitor**: Tracked competitors (workspaceId, name, domain, facebookPageId, status: ACTIVE|PAUSED)
- **CompetitorAd**: Discovered ads (competitorId, platform, adId, creative URL, adCopy, headline, CTA, landingPageURL, firstSeenDate, lastSeenDate, estimatedImpressions, status: ACTIVE|INACTIVE)
- **CompetitorSpendEstimate**: Spend tracking (competitorId, platform, month, estimatedSpendMin, estimatedSpendMax, dataSource)
- **CompetitorAlert**: Alert configurations (competitorId, alertType, threshold, notificationChannels)

### Technical Architecture

- **Data Collection**: Scheduled jobs (daily) fetch ads from public APIs
- **Storage**: PostgreSQL for structured data, S3 for creative assets
- **Deduplication**: Hash-based detection to avoid storing duplicate ads
- **Spend Estimation**: Use Meta Ad Library spend ranges; extrapolate for Google/TikTok using impression estimates

## Success Criteria *(mandatory)*

- **SC-001**: 95% of competitor ads publicly available in Meta Ad Library are discovered and stored within 24 hours of being added to tracking.
- **SC-002**: Users can browse competitor ads with filters/sorting, and results load in under 2 seconds for galleries with 500+ ads.
- **SC-003**: Long-running ads (60+ days) are correctly flagged, and users report this metric is helpful for creative inspiration (qualitative feedback).
- **SC-004**: Spend estimates (where available) are within ±30% of actual spend based on validation against known benchmarks or disclosed spend data.
- **SC-005**: Competitor alerts trigger correctly based on configured thresholds with zero false negatives (all qualifying events trigger alerts) during 30-day pilot.
