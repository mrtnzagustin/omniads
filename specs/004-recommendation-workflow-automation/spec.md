# Feature Specification: Recommendation Workflow Automation

**Feature Branch**: `[004-recommendation-workflow-automation]`
**Created**: 2025-11-05
**Status**: Implemented
**Implementation Date**: 2025-11-05
**Input**: User description: "Recommendation Workflow Automation"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage recommendation lifecycle (Priority: P1)

As a marketing lead, I can move AI recommendations through statuses (New → In Progress → Done → Archived) with owners and due dates so my team can execute actions end-to-end.

**Why this priority**: Structured workflow converts insights into action and is the minimal valuable slice.

**Independent Test**: Seed recommendations, change statuses via UI/API, and confirm transitions obey rules and audit trail without external integrations.

**Acceptance Scenarios**:

1. **Given** a new recommendation arrives, **When** I assign an owner and due date, **Then** the item moves to "In Progress" with assignment notifications sent.
2. **Given** work is completed, **When** the owner marks it "Done", **Then** the system records completion timestamp and outcome notes.
3. **Given** a recommendation is no longer relevant, **When** I archive it, **Then** it is removed from active queues but remains searchable with history.

---

### User Story 2 - Automate follow-ups (Priority: P2)

As an operations manager, I can configure playbooks that auto-create follow-up tasks (e.g., QA checks) when certain recommendation types reach "Done".

**Why this priority**: Automation reduces manual coordination once the baseline workflow exists.

**Independent Test**: Configure a playbook for "Launch new creative" recommendations, mark one as done, and verify the QA task is generated automatically.

**Acceptance Scenarios**:

1. **Given** a playbook triggers on "Budget reallocation" completions, **When** the recommendation transitions to "Done", **Then** the system creates a verification task assigned to finance.
2. **Given** auto-generated tasks are created, **When** the triggering recommendation reopens, **Then** downstream tasks are reopened or cancelled per rule configuration.

---

### User Story 3 - Track execution analytics (Priority: P3)

As an executive sponsor, I view dashboards showing completion rate, SLA adherence, and business impact of recommendations.

**Why this priority**: Reporting proves value but can follow after workflow automation is stable.

**Independent Test**: Populate historical recommendation activity and ensure analytics cards compute completion rate, SLA breach %, and impact metrics offline.

**Acceptance Scenarios**:

1. **Given** recommendation activity data exists, **When** I open the workflow analytics tab, **Then** I see charts for throughput, SLA, and ROI grouped by recommendation type.
2. **Given** I export the analytics data, **When** the export completes, **Then** a CSV with aggregated metrics and underlying actions is provided.

---

### Edge Cases

- How to handle recommendations without available owners? Allow assignment to a backlog queue and notify workspace admins.
- What if a recommendation toggles between statuses rapidly? Enforce state transition validation and store full audit log for compliance.
- How to treat duplicate recommendations for the same issue? Detect duplicates via fingerprinting and prompt merge before assignment.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST extend the Recommendation entity with workflow fields (status enum, ownerId, dueDate, priority, outcomeSummary).
- **FR-002**: System MUST provide REST endpoints and frontend components for listing, filtering, and updating recommendation workflow states.
- **FR-003**: Users MUST be able to assign owners, set priorities, add comments, and upload supporting evidence.
- **FR-004**: System MUST enforce valid status transitions and maintain a RecommendationActivity log capturing actor, old/new status, timestamp, and notes.
- **FR-005**: System MUST allow administrators to configure automation playbooks that create follow-up tasks based on triggers (status change, type, priority).
- **FR-006**: System MUST create Task entities linked to recommendations, with their own statuses, owners, and SLA tracking.
- **FR-007**: System MUST expose analytics summarizing recommendation throughput, SLA performance, and resulting KPI changes (ROAS, revenue) where data is available.

### Key Entities *(include if feature involves data)*

- **Recommendation** (extended): Adds workflow metadata (ownerId, dueDate, priority, outcomeSummary, linkedTaskIds).
- **RecommendationActivity**: Audit log of state changes (recommendationId, actorId, fromStatus, toStatus, notes, createdAt).
- **AutomationPlaybook**: Defines triggers, conditions, and actions (create task, send notification, reopen item).
- **Task**: Represents follow-up work items (type, status, ownerId, dueDate, slaMinutes, relatedRecommendationId).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of recommendations have an assigned owner within 8 business hours of creation during pilot rollout.
- **SC-002**: At least 85% of recommendations reach "Done" within defined SLA by the end of the first month.
- **SC-003**: Automation playbooks reduce manual follow-up task creation by 60% compared to baseline operations.
- **SC-004**: Workflow analytics adoption: 80% of weekly leadership meetings reference the dashboard or exported report.
