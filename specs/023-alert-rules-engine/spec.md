# Feature Specification: Custom Alert Rules Engine

**Feature Branch**: `[023-alert-rules-engine]`
**Created**: 2025-11-05
**Status**: Implemented
**Implementation Date**: 2025-11-05

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create custom alert rules with complex conditions (Priority: P1)

As a performance marketer, I can create custom alerts with complex rules (e.g., "Alert if ROAS < 2.0 AND spend > $500 AND CTR declining for 3 consecutive days"), so that I'm notified of specific conditions that matter to my strategy.

**Acceptance Scenarios**:
1. **Given** I create a rule "ROAS < 2.5 for any campaign with spend > $1K", **When** Campaign X meets these conditions, **Then** I receive an alert within 15 minutes with campaign details and suggested actions.
2. **Given** I want complex logic, **When** I configure "(ROAS < 2.0 OR CPA > $50) AND (Platform = 'Meta' OR Platform = 'TikTok')", **Then** the rule evaluates correctly using AND/OR logic.
3. **Given** a rule triggers frequently, **When** it fires 5+ times in one day, **Then** the system automatically suggests adjusting thresholds to reduce noise.

### User Story 2 - Configure alert channels and routing (Priority: P1)

As a team lead, I can route different alert types to different channels (critical alerts to WhatsApp, informational to email, high-priority to Slack), so that notifications are appropriately prioritized.

**Acceptance Scenarios**:
1. **Given** I configure routing rules, **When** a CRITICAL alert fires, **Then** it's sent via WhatsApp + email + Slack simultaneously.
2. **Given** a LOW priority alert fires, **When** it triggers, **Then** it's only sent via email and grouped with other low-priority alerts in a daily digest.

### User Story 3 - Alert escalation and snoozing (Priority: P2)

As a user, I can snooze alerts for 1/4/24 hours or set escalation rules (if alert unacknowledged for 1 hour, escalate to manager).

**Acceptance Scenarios**:
1. **Given** I receive an alert during off-hours, **When** I snooze it for 8 hours, **Then** it reappears in 8 hours if condition still exists.
2. **Given** an alert is unacknowledged for 1 hour, **When** escalation time passes, **Then** the alert is sent to the configured escalation contact.

### Edge Cases
- What if rule creates alert storm (100+ alerts/hour)? Implement rate limiting and auto-disable noisy rules with admin notification.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST support creating custom alert rules with complex conditions using AND/OR logic, comparison operators (<, >, =, !=), and multi-day trend detection.
- **FR-002**: System MUST evaluate alert rules continuously (every 15 minutes) against live campaign data.
- **FR-003**: System MUST support routing alerts to multiple channels (email, WhatsApp, Slack, in-app) based on priority levels.
- **FR-004**: System MUST support alert snoozing (1/4/8/24 hours) and escalation rules.
- **FR-005**: System MUST implement alert rate limiting to prevent alert storms (max 10 alerts per rule per hour).
- **FR-006**: System MUST provide alert analytics showing which rules fire most frequently and user response times.

### Key Entities
- **AlertRule**: Custom rules (name, conditions, priority, channels[], escalationConfig, enabled)
- **AlertInstance**: Fired alerts (ruleId, triggeredAt, acknowledgedAt, acknowledgedBy, snoozedUntil, escalated)
- **AlertCondition**: Rule conditions (field, operator, value, logicalOperator: AND|OR)

### Technical Architecture
- Rule evaluation engine runs every 15 minutes via scheduled job
- Condition evaluator uses dynamic SQL queries or in-memory data filtering
- Alert routing via existing notification services (email, WhatsApp, Slack)
- Rate limiting using Redis counters

## Success Criteria *(mandatory)*
- **SC-001**: Alert rules evaluate correctly 99.9%+ of the time with zero false negatives for critical conditions.
- **SC-002**: Alerts are delivered within 15 minutes of condition being met.
- **SC-003**: Complex rules with 5+ conditions evaluate correctly (validated through 100 test cases).
- **SC-004**: Alert rate limiting prevents storms, with noisy rules auto-disabled after threshold breach.
