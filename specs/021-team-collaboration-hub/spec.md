# Feature Specification: Team Collaboration Hub

**Feature Branch**: `[021-team-collaboration-hub]`
**Created**: 2025-11-05
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comment and discuss on campaigns and recommendations (Priority: P1)

As a team member, I can leave comments on campaigns, recommendations, and creatives with @mentions to notify colleagues, so that we collaborate asynchronously within the platform.

**Acceptance Scenarios**:
1. **Given** I'm reviewing a campaign, **When** I click "Add Comment", **Then** I can write a comment, @mention teammates, and attach screenshots.
2. **Given** someone @mentions me, **When** they post the comment, **Then** I receive an in-app notification and email.
3. **Given** there are 20+ comments on a recommendation, **When** I view the thread, **Then** comments are threaded with replies, timestamps, and user avatars.

### User Story 2 - Assign tasks and track team workload (Priority: P1)

As a manager, I can assign recommendations and tasks to team members with due dates and priorities, and view team workload dashboards.

**Acceptance Scenarios**:
1. **Given** I have a recommendation, **When** I assign it to @teammate with due date "Nov 10", **Then** it appears in their task list with priority indicator.
2. **Given** I'm a manager, **When** I view team workload, **Then** I see each member's task count, overdue items, and capacity status (overloaded/balanced/available).

### User Story 3 - Activity feed and notification center (Priority: P2)

As a user, I have a unified activity feed showing all relevant updates (new recommendations, comments, assignments, completed tasks).

**Acceptance Scenarios**:
1. **Given** team activity happens, **When** I open the notifications panel, **Then** I see chronological updates with "New comment on Campaign X", "Task assigned: Optimize Meta ads".

### Edge Cases
- What if @mentions target non-existent users? Show error "User not found" and suggest similar usernames.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST support threaded comments on campaigns, recommendations, creative assets, and dashboards.
- **FR-002**: System MUST support @mentions in comments that trigger email and in-app notifications.
- **FR-003**: System MUST allow task assignment with due dates, priorities, and status tracking.
- **FR-004**: System MUST provide team workload dashboard showing task distribution and capacity.
- **FR-005**: System MUST provide unified activity feed and notification center.

### Key Entities
- **Comment**: Discussion threads (entityType, entityId, userId, text, mentions[], parentCommentId, createdAt)
- **Notification**: User notifications (userId, type, message, read, relatedEntityId, createdAt)
- **TaskAssignment**: Assigned tasks (taskId, assignedTo, assignedBy, dueDate, status, priority)

## Success Criteria *(mandatory)*
- **SC-001**: Comments are posted and notifications sent within 5 seconds.
- **SC-002**: @mentions trigger email notifications within 2 minutes.
- **SC-003**: Team workload dashboard loads in under 2 seconds for teams with 50+ members.
