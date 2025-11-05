# Feature Specification: Performance Anomaly Alerts

**Feature Branch**: `[002-performance-anomaly-alerts]`
**Created**: 2025-11-05
**Status**: Implemented
**Implementation Date**: 2025-11-05
**Input**: User description: "Performance Anomaly Alerts"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Detect spend/ROAS anomalies (Priority: P1)

As a performance marketer, I receive immediate alerts when spend, conversions, or ROAS deviate beyond dynamic thresholds so I can intervene before budget is wasted.

**Why this priority**: Rapid anomaly detection protects revenue; without it, the alerting platform has no value.

**Independent Test**: Replay historical campaign data with injected anomalies and verify alerts fire with correct severity, context, and deduplication.

**Acceptance Scenarios**:

1. **Given** the anomaly service monitors synced metrics hourly, **When** ROAS drops below the adaptive lower control limit, **Then** a high-severity alert is created with impacted campaigns and recommended actions.
2. **Given** spend spikes because of scheduled promotions, **When** the anomaly baseline already accounts for expected seasonality, **Then** the system does not raise a false positive alert.
3. **Given** multiple metrics breach simultaneously, **When** the detection job runs, **Then** the alert groups correlated signals into a single notification with aggregated impact.

---

### User Story 2 - Route notifications to the right channel (Priority: P2)

As an operations lead, I configure alert routing (email, in-app, WhatsApp) and escalation rules to make sure the correct teammate is notified at the right urgency level.

**Why this priority**: Without routing, alerts create noise and will be ignored; it is the next critical capability after detection.

**Independent Test**: Configure a playbook where P1 alerts go to WhatsApp and P2 to email, simulate each severity, and validate delivery + acknowledgement tracking.

**Acceptance Scenarios**:

1. **Given** a workspace routing rule points P1 alerts to WhatsApp, **When** a critical anomaly fires, **Then** the assigned on-call receives a WhatsApp message with summary and acknowledge button.
2. **Given** an alert remains unacknowledged for 15 minutes, **When** the escalation timer expires, **Then** the system re-routes the alert to the backup channel and logs the escalation.

---

### User Story 3 - Investigate and resolve alerts (Priority: P3)

As a marketing analyst, I can see an alert timeline with root-cause hints, link it to remediation tasks, and close the alert with a resolution summary for future learning.

**Why this priority**: Structured resolution drives accountability and builds the knowledge base; it can follow detection and routing.

**Independent Test**: Create a mock alert, attach investigation notes, link to a recommendation or task, and close it—ensure audit trail is complete without requiring live data.

**Acceptance Scenarios**:

1. **Given** I open an alert in the UI, **When** I view the detail panel, **Then** I see metric trend charts, impacted entities, and AI-generated probable causes.
2. **Given** I resolve an alert, **When** I submit the closure form, **Then** the system records resolution summary, time to detect, and time to resolve metrics for reporting.

---

### Edge Cases

- How to handle missing data intervals from ad APIs? Skip anomaly detection for that interval and tag the alert timeline with "data gap".
- What if duplicate alerts are generated due to overlapping detection windows? Deduplicate by metric + campaign + period fingerprint and increment occurrence count.
- How to support workspaces without WhatsApp integration? Fall back to email/in-app while marking the missing channel in routing configuration.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST compute adaptive baselines per metric, platform, and campaign using rolling windows and seasonality adjustments.
- **FR-002**: System MUST generate anomaly events when actual metrics breach upper/lower control limits beyond configured sensitivity.
- **FR-003**: Users MUST be able to configure severity thresholds, quiet hours, and channel routing rules per workspace.
- **FR-004**: System MUST deliver notifications through email, in-app, and WhatsApp (via Twilio mock) with acknowledgement tracking.
- **FR-005**: System MUST support escalation policies when alerts remain unacknowledged beyond SLA.
- **FR-006**: System MUST provide an alert timeline UI showing metric charts, impacted entities, root-cause insights, and resolution notes.
- **FR-007**: System MUST persist alert state (open, acknowledged, resolved), audit logs, and linkages to recommendations or tasks.

### Key Entities *(include if feature involves data)*

- **AnomalyBaseline**: Stores rolling statistics per metric/campaign (mean, variance, seasonality vectors, lastUpdated).
- **AnomalyAlert**: Represents detected anomaly (metric, severity, impacted entities, detectedAt, acknowledgedAt, resolvedAt, resolutionSummary).
- **AlertRoutingRule**: Defines channel, recipients, quiet hours, SLA, and escalation tree per severity level.
- **AlertNotificationLog**: Records notification deliveries, acknowledgement tokens, and failures for each channel.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of critical anomalies (P1) are detected and notified within 5 minutes of metric ingestion.
- **SC-002**: False positive rate stays under 8% measured by alerts marked "no action needed" during pilot.
- **SC-003**: 100% of P1 alerts have recorded resolution summaries within 24 hours of detection.
- **SC-004**: Average time-to-acknowledge for routed alerts is under 10 minutes once WhatsApp channel is enabled.
