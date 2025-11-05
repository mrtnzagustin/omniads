# Feature Specification: Display & Native Ad Tracker

**Feature Branch**: `[013-display-ad-tracker]`
**Created**: 2025-11-05
**Status**: Draft
**Input**: "Track display and native ads across GDN, Taboola, Outbrain (inspired by AdBeat)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover competitor display ads (Priority: P1)

As a media buyer, I can see where competitors run display and native ads (publishers, ad networks) with creative examples, so that I identify effective placements and networks.

**Why this priority**: Display ad intelligence is currently missing from OmniAds and highly valuable for media buyers.

**Independent Test**: Track competitor, verify system discovers their display ads on GDN, Taboola, Outbrain within 48 hours.

**Acceptance Scenarios**:

1. **Given** I track a competitor, **When** display ad discovery runs, **Then** I see their active display/native ads with thumbnails, ad copy, and detected publishers (e.g., "Seen on CNN.com, Forbes.com").
2. **Given** I want to analyze ad networks, **When** I view the network breakdown, **Then** I see estimated budget allocation across GDN, Facebook Audience Network, Taboola, Outbrain.
3. **Given** I select a display ad, **When** I view details, **Then** I see the creative, detected landing page, estimated impressions, and publisher list where it appeared.

---

### User Story 2 - Analyze top publishers and placements (Priority: P2)

As a marketing strategist, I can see which publishers and placements drive most traffic for competitors, so that I prioritize similar placements for my campaigns.

**Why this priority**: Publisher insights optimize media buying but require ad tracking infrastructure first.

**Independent Test**: Analyze competitor with 100+ display ads, verify top 20 publishers are ranked by estimated impression share.

**Acceptance Scenarios**:

1. **Given** competitor display ads are tracked, **When** I view publisher analysis, **Then** I see top publishers ranked by estimated impressions/spend with example ads from each.
2. **Given** I want to benchmark my placements, **When** I compare my publishers vs competitors, **Then** I see overlap and unique publishers for competitive intelligence.

---

### Edge Cases

- What if display ads are ephemeral (rotate frequently)? Increase crawl frequency to 2x daily for active competitors.
- How to estimate spend without direct data? Use impression estimates combined with industry CPM benchmarks.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST discover competitor display and native ads from ad networks (GDN, Taboola, Outbrain) using web crawling or API integration.
- **FR-002**: System MUST store display ad data including creative, ad copy, landing page, detected publishers, and ad network.
- **FR-003**: System MUST identify top publishers where competitors advertise, ranked by estimated impressions.
- **FR-004**: System MUST estimate monthly spend on display/native advertising by network and publisher.
- **FR-005**: System MUST provide filtering by ad network, publisher, format (banner, native article, video).

### Key Entities

- **DisplayAd**: Tracked display ads (competitorId, adNetwork, creativeURL, adCopy, landingPage, publishers[], firstSeen, lastSeen)
- **PublisherPlacement**: Publisher tracking (publisher, competitor, adNetwork, estimatedImpressions, estimatedSpend)

### Technical Architecture

- Web scraping + ad network APIs (where available)
- Image storage in S3 for creative archives
- Impression/spend estimation using CPM benchmarks by network and publisher category

## Success Criteria *(mandatory)*

- **SC-001**: System discovers 70%+ of competitor display ads visible in public ad crawls within 48 hours of ad going live.
- **SC-002**: Top 20 publishers are accurately identified for competitors with 100+ display ads.
- **SC-003**: Display ad gallery loads in under 3 seconds for 500+ ads with thumbnail previews.
