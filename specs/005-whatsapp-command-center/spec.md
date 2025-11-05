# Feature Specification: WhatsApp Command Center

**Feature Branch**: `[005-whatsapp-command-center]`
**Created**: 2025-11-05
**Status**: Draft
**Input**: User description: "WhatsApp Command Center"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Receive actionable summaries (Priority: P1)

As a founder on the move, I get a daily WhatsApp digest summarizing KPIs, critical anomalies, and top recommendations with quick action buttons.

**Why this priority**: Push summaries deliver immediate value and anchor the command center experience.

**Independent Test**: Trigger the digest generator with sample data and inspect the WhatsApp payload using the Twilio sandbox without hitting production services.

**Acceptance Scenarios**:

1. **Given** the digest job runs each morning, **When** it composes the message, **Then** it includes KPIs (spend, revenue, ROAS), key alerts, and actionable buttons ("Approve budget shift", "View dashboard").
2. **Given** no new anomalies or recommendations exist, **When** the digest runs, **Then** the message communicates "All clear" with latest KPIs only.

---

### User Story 2 - Execute quick actions (Priority: P1)

As a decision maker, I can tap WhatsApp buttons to approve a budget adjustment, acknowledge an alert, or assign a recommendation without opening the web app.

**Why this priority**: Actionability is essential to justify the channel and must ship alongside the digest.

**Independent Test**: Simulate button callbacks to the backend, assert that related entities update (e.g., recommendation owner assigned) and confirm WhatsApp replies render correctly.

**Acceptance Scenarios**:

1. **Given** I tap "Approve budget shift" from the message, **When** the webhook is received, **Then** the referenced BudgetAdjustment transitions to "Approved via WhatsApp" with audit log.
2. **Given** I acknowledge an alert, **When** the callback executes, **Then** the alert state becomes "Acknowledged" and a confirmation reply is sent.
3. **Given** I assign a recommendation via quick reply, **When** I select a teammate, **Then** the system updates the recommendation owner and notifies them by email/in-app.

---

### User Story 3 - Two-way insight queries (Priority: P2)

As a marketer, I can ask free-form questions ("Which campaigns overspent yesterday?") and receive AI-generated answers with deep links to the dashboard.

**Why this priority**: Conversational queries elevate the command center beyond push notifications; it can follow core actions.

**Independent Test**: Send a mock query to the NLP endpoint with sample data, ensure the AI response includes metrics and CTA links without calling real APIs.

**Acceptance Scenarios**:

1. **Given** I ask for overspending campaigns, **When** the AI service responds, **Then** I receive a structured list with spend deltas and recommended actions.
2. **Given** I ask for "top creative this week", **When** the system processes the request, **Then** it returns the best-performing creative with thumbnail link and copy summary.

---

### Edge Cases

- How to handle rate limiting or delivery failures from WhatsApp API? Retry with exponential backoff, log failure, and fall back to email digest.
- What if a user is not enrolled in WhatsApp notifications? Provide enrollment link and store opt-in status to avoid sending unauthorized messages.
- How to secure action callbacks? Require signed payloads, validate user identity, and handle expired action tokens gracefully.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST generate a structured daily digest containing KPIs, anomalies, and recommendations tailored to each workspace.
- **FR-002**: System MUST send WhatsApp messages via Twilio mock client including interactive buttons and quick reply options.
- **FR-003**: Users MUST be able to execute quick actions (approve adjustment, acknowledge alert, assign recommendation) through WhatsApp callbacks with full audit logging.
- **FR-004**: System MUST confirm each action with a WhatsApp response and update in-app state in real time.
- **FR-005**: System MUST support conversational queries by routing WhatsApp free-text messages to the AI core client and returning summarized answers with deep links.
- **FR-006**: System MUST manage opt-in/out status, access control, and tokenized links for secure action execution.
- **FR-007**: System MUST provide an admin UI to monitor message delivery status, failure reasons, and resend options.

### Key Entities *(include if feature involves data)*

- **WhatsAppSubscription**: Tracks user opt-in status, phone number, preferred language, and notification windows.
- **WhatsAppDigest**: Stores digest payloads, send status, and metrics included for auditing and replays.
- **WhatsAppActionToken**: Short-lived token that maps interactive buttons to backend actions (entity type, entity id, expiry, permissions).
- **WhatsAppConversationLog**: Persists inbound/outbound messages, detected intents, and AI responses.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Daily digest delivery success rate ≥ 98% with retries counted as success when eventual delivery occurs.
- **SC-002**: At least 40% of budget approvals during pilot are executed directly from WhatsApp actions.
- **SC-003**: Conversational query satisfaction score ≥ 4/5 based on user feedback after 2 weeks of usage.
- **SC-004**: Zero unauthorized actions executed via WhatsApp, verified through quarterly security audits.
