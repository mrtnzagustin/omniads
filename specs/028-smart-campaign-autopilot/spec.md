# Feature Specification: Smart Campaign Autopilot

**Feature Branch**: `[028-smart-campaign-autopilot]`
**Created**: 2025-11-05
**Status**: Draft
**Input**: User description: "End-to-end AI-powered campaign management from creation to optimization"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Launch campaigns with AI autopilot (Priority: P1)

As a marketing manager, I can enable autopilot mode on campaigns where AI automatically handles budget optimization, bid adjustments, audience expansion, creative rotation, and performance monitoring, so that campaigns self-optimize without manual intervention.

**Why this priority**: Autopilot mode democratizes expert-level campaign management, enabling teams to scale efficiently without constant monitoring.

**Independent Test**: Enable autopilot on a test campaign with $500 daily budget, verify AI makes appropriate adjustments (bids, budgets, audiences) over 7 days while staying within defined guardrails.

**Acceptance Scenarios**:

1. **Given** I have a campaign ready to launch, **When** I enable Smart Autopilot, **Then** the system asks me to define success metrics (target ROAS, max CPA, min conversions), budget guardrails, and automation scope.
2. **Given** autopilot is enabled, **When** the AI detects optimization opportunities, **Then** it automatically adjusts bids, budgets, and targeting within approved limits and logs all changes.
3. **Given** autopilot has been running for 7 days, **When** I review performance, **Then** I see a timeline of all AI-driven adjustments with before/after metrics showing impact.

---

### User Story 2 - Configure autopilot guardrails (Priority: P1)

As a growth manager, I can configure autopilot guardrails including max daily budget, min/max bids, allowed audience expansion percentage, creative rotation rules, and pause conditions, so that AI operates within business constraints.

**Why this priority**: Guardrails are essential for trust and safety before enabling automation.

**Independent Test**: Set guardrail "max budget increase 20% per day", verify AI never exceeds this limit even when performance is strong.

**Acceptance Scenarios**:

1. **Given** I'm configuring autopilot, **When** I set guardrails, **Then** I can define budget limits (daily/lifetime max), bid ranges, audience expansion limits (% increase), and auto-pause conditions (ROAS below X, budget depleted).
2. **Given** autopilot detects a high-performing campaign, **When** AI wants to scale, **Then** it respects configured guardrails and requests approval for changes exceeding limits.
3. **Given** performance drops below thresholds, **When** pause conditions are met, **Then** autopilot automatically pauses campaign and sends alert with reasoning.

---

### User Story 3 - Monitor autopilot decisions in real-time (Priority: P2)

As a campaign manager, I can view a live feed of autopilot decisions including what changed, why, expected impact, and actual results, so that I understand AI reasoning and can intervene if needed.

**Why this priority**: Transparency builds trust but can be delivered after core automation works.

**Independent Test**: Let autopilot run for 48 hours, verify decision feed shows all adjustments with timestamps, reasoning, and outcome tracking.

**Acceptance Scenarios**:

1. **Given** autopilot is active, **When** I open the Autopilot Dashboard, **Then** I see a real-time feed of decisions made in the last 24 hours with categories (budget, bid, audience, creative), change details, and AI reasoning.
2. **Given** I want to understand a specific decision, **When** I click on a decision, **Then** I see the full context: data analyzed, alternative options considered, expected impact, confidence score, and actual outcome (if measurable).
3. **Given** I disagree with an AI decision, **When** I override or revert it, **Then** autopilot learns from this feedback and adjusts future decision-making accordingly.

---

### User Story 4 - Measure autopilot ROI vs manual management (Priority: P3)

As a data analyst, I can compare autopilot-managed campaigns vs manually-managed campaigns on key metrics (ROAS, CPA, time saved, outcome consistency), so that I can quantify autopilot value.

**Why this priority**: ROI measurement validates feature value but requires sufficient historical data.

**Independent Test**: Run A/B test with 50% campaigns on autopilot and 50% manual for 30 days, verify dashboard shows comparative metrics.

**Acceptance Scenarios**:

1. **Given** some campaigns use autopilot and others are manual, **When** I view the Autopilot ROI Dashboard, **Then** I see side-by-side comparison of ROAS, CPA, conversion rate, and time-to-optimization.
2. **Given** I want to measure time savings, **When** I review autopilot impact, **Then** I see estimated hours saved based on typical manual optimization time vs automated adjustments.
3. **Given** I need to report to leadership, **When** I export autopilot metrics, **Then** I receive a comprehensive report showing performance lift, cost efficiency gains, and scaling capacity enabled.

---

### Edge Cases

- What if autopilot makes a decision that violates platform policies? Implement policy validator before executing changes, if violation detected, flag for manual review.
- How to handle extreme market events (Black Friday, sudden competitor moves)? Autopilot should detect anomalies, temporarily pause automated changes, and alert users during unusual conditions.
- What if multiple campaigns on autopilot compete for the same audience? Implement portfolio-level optimization that coordinates across campaigns to maximize total ROAS rather than individual campaign metrics.
- How to ensure autopilot doesn't overspend if performance data is delayed? Use conservative spend pacing with real-time budget tracking, never exceed daily limits even if conversions aren't fully reported yet.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support autopilot mode on campaigns with configurable automation scope: Budget Optimization, Bid Management, Audience Expansion, Creative Rotation, Dayparting, Placement Optimization.
- **FR-002**: Users MUST be able to define autopilot guardrails: max/min budget (daily/lifetime), bid ranges, audience expansion limits (%), creative change frequency, and auto-pause conditions.
- **FR-003**: System MUST continuously monitor campaign performance (every 1 hour minimum) and automatically apply optimizations when opportunities are detected within guardrails.
- **FR-004**: Autopilot MUST log every decision with timestamp, change details, reasoning, expected impact, confidence score, and actual outcome (tracked post-change).
- **FR-005**: System MUST provide real-time Autopilot Dashboard showing active campaigns, recent decisions, performance trends, and alerts for campaigns needing attention.
- **FR-006**: Autopilot MUST request manual approval for changes exceeding configured guardrails (e.g., budget increase >20%, bid change >50%, new audience segment).
- **FR-007**: System MUST support manual overrides where users can revert autopilot decisions and provide feedback that influences future AI behavior.
- **FR-008**: Autopilot MUST implement portfolio-level optimization that coordinates decisions across multiple campaigns to maximize overall workspace ROAS.
- **FR-009**: System MUST track autopilot ROI by comparing autopilot-managed vs manually-managed campaign performance on ROAS, CPA, time-to-optimization, and consistency metrics.
- **FR-010**: Autopilot MUST detect anomalous conditions (sudden traffic spikes, conversion tracking issues, platform API errors) and pause automation temporarily with alerts.

### Non-Functional Requirements

- **NFR-001**: Autopilot monitoring cycle MUST run every hour with decision latency under 5 minutes from data collection to execution.
- **NFR-002**: System MUST handle 500+ campaigns on autopilot simultaneously without performance degradation.
- **NFR-003**: All autopilot budget changes MUST sync to ad platforms within 10 minutes of decision with confirmation tracking.
- **NFR-004**: Autopilot decision feed MUST load in under 2 seconds with 7 days of decision history.

### Key Entities *(include if feature involves data)*

- **AutopilotConfig**: Campaign autopilot settings
  - id, campaignId, workspaceId, status (ACTIVE | PAUSED | DISABLED)
  - automationScope (JSON array: ['BUDGET', 'BIDS', 'AUDIENCE', 'CREATIVE'])
  - guardrails (JSON: {maxDailyBudget: 1000, maxBidIncrease: 0.5, maxAudienceExpansion: 0.3})
  - successMetrics (JSON: {targetROAS: 3.5, maxCPA: 50})
  - pauseConditions (JSON array: [{metric: 'ROAS', operator: 'BELOW', threshold: 2.0}])
  - createdAt, updatedAt

- **AutopilotDecision**: AI-driven optimization decisions
  - id, configId, campaignId, workspaceId
  - decisionType (BUDGET_CHANGE | BID_ADJUSTMENT | AUDIENCE_EXPANSION | CREATIVE_ROTATION | CAMPAIGN_PAUSE)
  - change (JSON: {field: 'dailyBudget', from: 500, to: 600})
  - reasoning (AI explanation), confidence (0-1)
  - expectedImpact (JSON: {roas: '+0.3x', conversions: '+15'})
  - status (APPROVED_AUTO | APPROVED_MANUAL | REJECTED | EXECUTED | REVERTED)
  - approvedBy (userId for manual approvals), executedAt
  - outcomeTracked (boolean), actualImpact (JSON with measured results)
  - createdAt

- **AutopilotMetrics**: Performance tracking
  - id, configId, campaignId, workspaceId, date
  - decisionsCount, executedCount, revertedCount
  - roasBefore, roasAfter, roasLift
  - cpaBefore, cpaAfter, cpaImprovement
  - totalSpend, totalRevenue
  - manualInterventions (count of user overrides)
  - createdAt

- **AutopilotOverride**: User interventions
  - id, decisionId, userId, workspaceId
  - overrideType (REVERT | REJECT | MODIFY)
  - reason (user explanation), feedbackRating (helpful/not helpful)
  - createdAt

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Autopilot-managed campaigns achieve 15%+ higher ROAS vs manually-managed campaigns over 30 days (A/B tested with 50 campaigns each group).
- **SC-002**: 90%+ of autopilot decisions execute successfully without manual intervention over 30-day period.
- **SC-003**: Autopilot reduces campaign management time by 5+ hours/week per manager (measured via time tracking survey).
- **SC-004**: Zero cases of autopilot exceeding configured guardrails over 90-day period (audited weekly).
- **SC-005**: Autopilot decision feed loads in under 2 seconds with 7 days of history for campaigns with 100+ decisions.
- **SC-006**: 85%+ user satisfaction with autopilot transparency and explainability (measured via quarterly survey).
- **SC-007**: Autopilot correctly detects and pauses during anomalous conditions (API errors, conversion tracking issues) in 95%+ of cases.
- **SC-008**: Manual override rate stays below 10% of autopilot decisions (low override rate indicates good decision quality).

## Implementation Notes

### Database Schema

```sql
-- Autopilot configuration per campaign
CREATE TABLE autopilot_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id VARCHAR(255) NOT NULL UNIQUE,
  workspace_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  automation_scope JSONB NOT NULL, -- ['BUDGET', 'BIDS', 'AUDIENCE', 'CREATIVE']
  guardrails JSONB NOT NULL,
  success_metrics JSONB NOT NULL,
  pause_conditions JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_autopilot_configs_workspace ON autopilot_configs(workspace_id);
CREATE INDEX idx_autopilot_configs_status ON autopilot_configs(status);

-- Autopilot decisions
CREATE TABLE autopilot_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES autopilot_configs(id) ON DELETE CASCADE,
  campaign_id VARCHAR(255) NOT NULL,
  workspace_id VARCHAR(255) NOT NULL,
  decision_type VARCHAR(100) NOT NULL,
  change JSONB NOT NULL,
  reasoning TEXT NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  expected_impact JSONB,
  status VARCHAR(50) NOT NULL DEFAULT 'APPROVED_AUTO',
  approved_by UUID REFERENCES users(id),
  executed_at TIMESTAMP,
  outcome_tracked BOOLEAN DEFAULT FALSE,
  actual_impact JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_autopilot_decisions_config ON autopilot_decisions(config_id);
CREATE INDEX idx_autopilot_decisions_workspace ON autopilot_decisions(workspace_id);
CREATE INDEX idx_autopilot_decisions_created_at ON autopilot_decisions(created_at DESC);

-- Performance metrics
CREATE TABLE autopilot_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES autopilot_configs(id) ON DELETE CASCADE,
  campaign_id VARCHAR(255) NOT NULL,
  workspace_id VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  decisions_count INTEGER DEFAULT 0,
  executed_count INTEGER DEFAULT 0,
  reverted_count INTEGER DEFAULT 0,
  roas_before DECIMAL(10,2),
  roas_after DECIMAL(10,2),
  roas_lift DECIMAL(10,2),
  cpa_before DECIMAL(10,2),
  cpa_after DECIMAL(10,2),
  cpa_improvement DECIMAL(10,2),
  total_spend DECIMAL(10,2),
  total_revenue DECIMAL(10,2),
  manual_interventions INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(config_id, date)
);

CREATE INDEX idx_autopilot_metrics_config ON autopilot_metrics(config_id);
CREATE INDEX idx_autopilot_metrics_date ON autopilot_metrics(date DESC);

-- User overrides
CREATE TABLE autopilot_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID NOT NULL REFERENCES autopilot_decisions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  workspace_id VARCHAR(255) NOT NULL,
  override_type VARCHAR(50) NOT NULL,
  reason TEXT,
  feedback_rating BOOLEAN,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_autopilot_overrides_decision ON autopilot_overrides(decision_id);
CREATE INDEX idx_autopilot_overrides_user ON autopilot_overrides(user_id);
```

### API Endpoints

```
POST   /api/v1/campaigns/:id/autopilot              - Enable autopilot on campaign
DELETE /api/v1/campaigns/:id/autopilot              - Disable autopilot
PATCH  /api/v1/campaigns/:id/autopilot              - Update autopilot config/guardrails
GET    /api/v1/campaigns/:id/autopilot/decisions    - Get decision history for campaign
POST   /api/v1/autopilot/decisions/:id/revert       - Revert a specific decision
POST   /api/v1/autopilot/decisions/:id/feedback     - Provide feedback on decision
GET    /api/v1/autopilot/dashboard                  - Autopilot overview for workspace
GET    /api/v1/autopilot/metrics                    - Autopilot ROI metrics
GET    /api/v1/autopilot/feed                       - Real-time decision feed (all campaigns)
```

### Autopilot Decision Algorithm

```typescript
async evaluateCampaign(campaign: Campaign, config: AutopilotConfig) {
  // Collect recent performance data
  const metrics = await this.getMetrics(campaign.id, '7d');

  // Run decision engines in parallel
  const [budgetRec, bidRec, audienceRec, creativeRec] = await Promise.all([
    this.evaluateBudget(campaign, metrics, config),
    this.evaluateBids(campaign, metrics, config),
    this.evaluateAudience(campaign, metrics, config),
    this.evaluateCreative(campaign, metrics, config),
  ]);

  // Filter recommendations by guardrails
  const recommendations = [budgetRec, bidRec, audienceRec, creativeRec]
    .filter(rec => rec !== null)
    .filter(rec => this.meetsGuardrails(rec, config.guardrails));

  // Prioritize by expected impact and confidence
  const sorted = recommendations.sort((a, b) =>
    (b.expectedImpact * b.confidence) - (a.expectedImpact * a.confidence)
  );

  // Execute top recommendation(s)
  for (const rec of sorted.slice(0, 3)) { // Top 3 recommendations
    await this.createDecision(rec, config);
    await this.executeDecision(rec, campaign);
  }
}
```

### Testing Strategy

1. **Unit Tests**: Decision algorithms, guardrail validation, impact calculation
2. **Integration Tests**: End-to-end autopilot enable → monitor → optimize → track outcome
3. **Performance Tests**: 500 campaigns on autopilot, verify monitoring cycle completes in <5 min
4. **A/B Tests**: Compare autopilot vs manual on 100 campaigns over 30 days
5. **Security Tests**: Verify guardrails cannot be bypassed, budget limits enforced
6. **Chaos Tests**: Simulate API failures, delayed data, verify graceful handling
