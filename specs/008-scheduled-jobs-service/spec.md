# Feature Specification: Scheduled Jobs & Automation Service

**Feature Branch**: `[008-scheduled-jobs-service]`
**Created**: 2025-11-05
**Status**: Draft
**Input**: User description: "Cron job service for automated tasks like daily syncs, reports, and AI analyses"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure automated daily syncs (Priority: P1)

As a marketing manager, I can configure automated daily syncs of campaign data from all platforms at a specific time, so that my dashboard always shows fresh data without manual intervention.

**Why this priority**: Manual syncs are error-prone and time-consuming. Automated syncs are the foundation for all other automation features.

**Independent Test**: Configure a daily sync for 6 AM, verify it runs automatically and updates campaign data without user action.

**Acceptance Scenarios**:

1. **Given** I configure a daily sync job for 6:00 AM UTC, **When** the scheduled time arrives, **Then** the system automatically triggers data sync from all connected platforms (Meta, Google, TikTok, Tienda Nube).
2. **Given** a sync job completes successfully, **When** I check the job history, **Then** I see the execution timestamp, duration, records synced, and status (SUCCESS).
3. **Given** a sync job fails due to API errors, **When** I view the job details, **Then** I see the error message, retry attempts, and receive an email notification about the failure.

---

### User Story 2 - Schedule automated reports (Priority: P1)

As a growth manager, I can schedule weekly performance reports to be generated and sent via email or WhatsApp, so that stakeholders receive updates without me having to manually create them.

**Why this priority**: Automated reporting saves hours of manual work and ensures stakeholders stay informed consistently.

**Independent Test**: Schedule a weekly report for Monday 9 AM, verify it generates a PDF with KPIs and sends it via email.

**Acceptance Scenarios**:

1. **Given** I schedule a weekly report for Mondays at 9:00 AM, **When** Monday arrives, **Then** the system generates a PDF report with ROAS trends, top campaigns, and AI recommendations from the past 7 days.
2. **Given** a report is generated, **When** the job completes, **Then** the report is sent to configured recipients via email with PDF attachment and optional WhatsApp summary.
3. **Given** I want custom report content, **When** I configure the scheduled job, **Then** I can select which sections to include (KPIs, campaigns, recommendations, creative performance).

---

### User Story 3 - Automate AI analysis generation (Priority: P2)

As a data analyst, I can schedule AI recommendation generation to run daily after data syncs complete, so that fresh recommendations are always available when I start my workday.

**Why this priority**: Chaining jobs (sync → AI analysis) automates the full intelligence pipeline, but requires stable sync jobs first.

**Independent Test**: Configure AI generation to run 30 minutes after daily sync, verify recommendations are generated automatically.

**Acceptance Scenarios**:

1. **Given** I configure AI generation to run daily at 7:00 AM (after 6:30 AM sync), **When** the sync completes successfully, **Then** AI recommendation generation is automatically triggered.
2. **Given** AI generation runs on schedule, **When** it completes, **Then** new recommendations appear in the dashboard and WhatsApp notifications are sent to subscribed users.
3. **Given** the sync job failed, **When** the AI generation time arrives, **Then** the system skips AI generation and logs a warning that no fresh data is available.

---

### User Story 4 - Manage and monitor scheduled jobs (Priority: P2)

As a system administrator, I can view all scheduled jobs, their execution history, and pause/resume/delete jobs, so that I maintain control over automated processes.

**Why this priority**: Job management is essential for production operations but can be delivered after core scheduling works.

**Independent Test**: Create 10 scheduled jobs, view their status, pause one, and verify it doesn't execute at scheduled time.

**Acceptance Scenarios**:

1. **Given** there are active scheduled jobs, **When** I open the Jobs Dashboard, **Then** I see all jobs with their schedules, last execution time, next execution time, and status (ACTIVE | PAUSED | FAILED).
2. **Given** I want to temporarily disable a job, **When** I click "Pause", **Then** the job stops executing until I manually resume it, and I receive a confirmation notification.
3. **Given** a job has failed 3 times in a row, **When** I view the job details, **Then** I see all failure logs, can edit the job configuration, and manually trigger a test execution.

---

### Edge Cases

- What happens when a job execution takes longer than the interval between runs? Implement a locking mechanism to prevent overlapping executions. If a job is still running when the next schedule arrives, skip that execution and log a warning.
- How to handle jobs that need to run in a specific order (sync before AI)? Support job dependencies where one job can be configured to run "after successful completion of Job X".
- What if the server restarts during job execution? Mark in-progress jobs as "INTERRUPTED" on startup, allow manual re-trigger or automatic retry based on configuration.
- How to prevent jobs from running during maintenance windows? Allow administrators to configure blackout periods (e.g., "no jobs between 2-3 AM Sundays for database backups").

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a scheduling engine that supports cron-like scheduling (daily, weekly, hourly, custom cron expressions) for recurring jobs.
- **FR-002**: System MUST support the following job types: DATA_SYNC, AI_GENERATION, REPORT_GENERATION, ALERT_CHECK, OUTCOME_CALCULATION, CUSTOM.
- **FR-003**: Users MUST be able to configure job schedules via UI with timezone selection, execution frequency, and notification preferences.
- **FR-004**: System MUST prevent overlapping job executions by implementing distributed locking (database-level advisory locks or Redis locks).
- **FR-005**: System MUST support job dependencies where Job B can be configured to run "after successful completion of Job A" with configurable delay.
- **FR-006**: System MUST log all job executions with timestamps, duration, status (SUCCESS | FAILED | TIMEOUT | SKIPPED), input parameters, and output summary.
- **FR-007**: System MUST retry failed jobs with exponential backoff (configurable: max 3 retries, delays of 5m, 15m, 30m).
- **FR-008**: System MUST send notifications (email, WhatsApp, Slack) when jobs fail after all retries are exhausted.
- **FR-009**: Administrators MUST be able to pause, resume, delete, and manually trigger jobs via UI and API.
- **FR-010**: System MUST provide a Jobs Dashboard showing job status, execution history, next run times, and performance metrics (avg duration, failure rate).

### Non-Functional Requirements

- **NFR-001**: Job execution timing MUST be accurate within ±2 minutes of scheduled time under normal load conditions.
- **NFR-002**: The scheduling system MUST scale to support at least 1,000 concurrent workspaces each with 10+ scheduled jobs without performance degradation.
- **NFR-003**: Job execution MUST be fault-tolerant - if the primary server crashes, jobs should automatically resume on a standby server (if multi-server deployment).
- **NFR-004**: Historical job execution logs MUST be retained for at least 90 days and queryable for audit purposes.

### Key Entities *(include if feature involves data)*

- **ScheduledJob**: Configuration for recurring jobs
  - id, workspaceId, name, jobType (DATA_SYNC | AI_GENERATION | REPORT_GENERATION | etc.)
  - schedule (cron expression), timezone
  - enabled (boolean), configuration (JSONB with job-specific parameters)
  - notifyOnFailure (email/whatsapp/slack), notifyRecipients
  - dependsOnJobId (optional - for job dependencies)
  - createdBy, createdAt, updatedAt

- **JobExecution**: Historical record of job runs
  - id, scheduledJobId, executionNumber (incremental counter)
  - status (PENDING | RUNNING | SUCCESS | FAILED | TIMEOUT | SKIPPED)
  - startedAt, completedAt, durationMs
  - inputParameters (JSONB), outputSummary (JSONB - e.g., "Synced 120 campaigns")
  - errorMessage (if failed), retryAttempt (1-3)
  - triggeredBy (SCHEDULED | MANUAL | DEPENDENCY), triggeredByUserId

- **JobLock**: Distributed locking for preventing overlaps
  - jobId, lockAcquiredAt, lockExpiresAt, lockHolder (server/process ID)

### Technical Architecture

**Scheduling Engine**:
```
NestJS + node-cron or Bull Queue
├── SchedulerService (manages cron registrations)
├── JobExecutor (executes job logic)
├── JobRegistry (maps job types to implementations)
├── LockManager (distributed locking)
└── NotificationService (job failure alerts)
```

**Job Types Implementation**:
```typescript
interface JobHandler {
  execute(params: any): Promise<JobResult>;
}

// Registry
const jobHandlers = {
  DATA_SYNC: DataSyncJobHandler,
  AI_GENERATION: AIGenerationJobHandler,
  REPORT_GENERATION: ReportGenerationJobHandler,
  ALERT_CHECK: AlertCheckJobHandler,
  OUTCOME_CALCULATION: OutcomeCalculationJobHandler
};
```

**Distributed Locking**:
```sql
-- PostgreSQL advisory locks
SELECT pg_try_advisory_lock(job_id) AS acquired;
-- Hold lock during execution
SELECT pg_advisory_unlock(job_id);
```

**Execution Flow**:
1. Cron triggers → Check if job enabled
2. Attempt to acquire lock → If locked, skip execution
3. Create JobExecution record (status: RUNNING)
4. Execute job handler → Capture output/errors
5. Update JobExecution (status: SUCCESS/FAILED)
6. Release lock
7. If failed → Retry or send notification

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of configured scheduled jobs execute within ±2 minutes of their scheduled time when system is operational.
- **SC-002**: Zero overlapping job executions (verified by lock acquisition logs) during 30-day production period.
- **SC-003**: Failed jobs are automatically retried according to configuration, and administrators receive failure notifications within 5 minutes of final retry failure.
- **SC-004**: Users can create, configure, and activate a new scheduled job through the UI in under 3 minutes.
- **SC-005**: Job execution history is queryable for any job over the past 90 days with results returned in under 2 seconds.
- **SC-006**: When a dependency job (Job A) completes successfully, the dependent job (Job B) automatically executes within configured delay (±1 minute).
- **SC-007**: System handles server restarts gracefully - in-progress jobs are marked as INTERRUPTED and can be manually re-triggered without data corruption.

## Implementation Notes

### Database Schema

```sql
CREATE TABLE scheduled_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  job_type VARCHAR(50) NOT NULL,
  schedule VARCHAR(100) NOT NULL, -- Cron expression
  timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
  enabled BOOLEAN NOT NULL DEFAULT true,
  configuration JSONB NOT NULL DEFAULT '{}',
  notify_on_failure JSONB DEFAULT '{"email": true, "whatsapp": false, "slack": false}',
  notify_recipients JSONB DEFAULT '[]',
  depends_on_job_id UUID REFERENCES scheduled_jobs(id) ON DELETE SET NULL,
  dependency_delay_minutes INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE job_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_job_id UUID NOT NULL REFERENCES scheduled_jobs(id) ON DELETE CASCADE,
  execution_number BIGSERIAL,
  status VARCHAR(50) NOT NULL,
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration_ms INTEGER,
  input_parameters JSONB DEFAULT '{}',
  output_summary JSONB DEFAULT '{}',
  error_message TEXT,
  retry_attempt INTEGER DEFAULT 0,
  triggered_by VARCHAR(50) NOT NULL, -- 'SCHEDULED' | 'MANUAL' | 'DEPENDENCY'
  triggered_by_user_id UUID REFERENCES users(id)
);

CREATE INDEX idx_scheduled_jobs_workspace ON scheduled_jobs(workspace_id);
CREATE INDEX idx_scheduled_jobs_enabled ON scheduled_jobs(enabled) WHERE enabled = true;
CREATE INDEX idx_job_executions_job ON job_executions(scheduled_job_id);
CREATE INDEX idx_job_executions_started ON job_executions(started_at DESC);
```

### API Endpoints

```
GET    /api/v1/scheduled-jobs          - List all jobs for workspace
POST   /api/v1/scheduled-jobs          - Create new job
GET    /api/v1/scheduled-jobs/:id      - Get job details
PUT    /api/v1/scheduled-jobs/:id      - Update job configuration
DELETE /api/v1/scheduled-jobs/:id      - Delete job
POST   /api/v1/scheduled-jobs/:id/pause  - Pause job
POST   /api/v1/scheduled-jobs/:id/resume - Resume job
POST   /api/v1/scheduled-jobs/:id/trigger - Manual trigger

GET    /api/v1/job-executions          - List executions with filters
GET    /api/v1/job-executions/:id      - Get execution details
POST   /api/v1/job-executions/:id/retry - Retry failed execution
```

### Environment Variables

```env
# Scheduler Configuration
SCHEDULER_ENABLED=true
SCHEDULER_TIMEZONE=UTC
SCHEDULER_MAX_RETRIES=3
SCHEDULER_RETRY_DELAYS=5,15,30  # Minutes

# Locking
SCHEDULER_LOCK_TTL=3600  # 1 hour max job duration

# Notifications
SCHEDULER_NOTIFY_EMAIL=true
SCHEDULER_NOTIFY_WHATSAPP=false
```

### Dependencies

```json
{
  "dependencies": {
    "node-cron": "^3.0.3",
    "@nestjs/schedule": "^4.0.0",
    "bull": "^4.12.0",  // Optional for advanced queue management
    "ioredis": "^5.3.2"  // Optional for Redis-based locking
  }
}
```

### Testing Strategy

1. **Unit Tests**: Test cron parsing, lock acquisition, job execution logic
2. **Integration Tests**: Verify end-to-end job scheduling, execution, and logging
3. **Load Tests**: Test 1,000 concurrent scheduled jobs
4. **Failure Tests**: Simulate job failures, server crashes, and verify recovery
