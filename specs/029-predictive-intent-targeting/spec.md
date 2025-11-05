# Feature Specification: Predictive Intent Targeting

**Feature Branch**: `[029-predictive-intent-targeting]`
**Created**: 2025-11-05
**Status**: Implemented
**Implementation Date**: 2025-11-05
**Input**: User description: "AI-powered targeting based on predicted user intent rather than demographics"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Target users by predicted purchase intent (Priority: P1)

As a performance marketer, I can create audiences based on predicted purchase intent (ready to buy, researching, awareness) rather than demographics, so that I reach users when they're most likely to convert.

**Why this priority**: Intent-based targeting is proven to outperform demographic targeting by 30-50% in 2025, making it a core competitive advantage.

**Independent Test**: Create "High Intent" audience segment, launch campaign targeting this segment, verify 25%+ higher conversion rate vs demographic-matched control group.

**Acceptance Scenarios**:

1. **Given** I'm creating a new campaign, **When** I select audience targeting, **Then** I see AI-generated intent segments: High Intent (ready to buy), Medium Intent (comparing options), Low Intent (awareness stage), plus custom intent scores.
2. **Given** I select "High Intent" segment for my product category, **When** I launch campaign, **Then** ads are shown to users predicted to have purchase intent in next 7 days based on behavioral signals.
3. **Given** campaign has run for 14 days, **When** I review intent targeting performance, **Then** I see intent prediction accuracy (% who actually converted), cost efficiency vs demographic targeting, and segment size trends.

---

### User Story 2 - Analyze intent signals and drivers (Priority: P1)

As a marketing analyst, I can view what behavioral signals drive intent predictions (search patterns, browsing history, engagement velocity, seasonal factors), so that I understand why users are classified in each intent segment.

**Why this priority**: Understanding intent drivers enables marketers to create better content and offers aligned with user mindset.

**Independent Test**: View intent breakdown for "High Intent" segment, verify it shows key signals (e.g., 3+ product page views, cart abandonment, competitor research).

**Acceptance Scenarios**:

1. **Given** I'm reviewing an intent segment, **When** I view Intent Drivers, **Then** I see ranked list of behavioral signals that contribute to intent score: page views, time on site, content engagement, search queries, cart actions, email interactions.
2. **Given** I want to optimize content, **When** I analyze intent signals, **Then** I can see what content/actions move users from Low to Medium to High intent, informing content strategy.
3. **Given** I need to explain targeting to stakeholders, **When** I export intent analysis, **Then** I receive report showing sample user journeys from each intent segment with signal explanations.

---

### User Story 3 - Create custom intent models (Priority: P2)

As a growth manager, I can train custom intent models specific to my product category, audience, and conversion patterns, so that intent predictions align with my business reality beyond generic models.

**Why this priority**: Custom models improve accuracy but require generic models to work first.

**Independent Test**: Train custom intent model on 90 days of conversion data, verify it outperforms generic model by 10%+ on holdout test set.

**Acceptance Scenarios**:

1. **Given** I have 90+ days of campaign data, **When** I create custom intent model, **Then** the system trains on my historical conversions, identifies my top predictive signals, and validates accuracy before deployment.
2. **Given** my business has unique conversion patterns (long sales cycle, B2B), **When** I configure custom model, **Then** I can adjust intent timeframe (predict 30-day vs 7-day intent), weight signals differently, and add custom signals from my CRM.
3. **Given** custom model is deployed, **When** I monitor performance, **Then** I see side-by-side comparison of custom vs generic model showing prediction accuracy, conversion lift, and recommended optimizations.

---

### User Story 4 - Integrate intent data into other marketing tools (Priority: P3)

As a marketing ops manager, I can export intent scores and segments to email platforms, CRM systems, and analytics tools, so that intent data enhances all marketing channels beyond just paid ads.

**Why this priority**: Cross-channel intent integration maximizes value but requires stable core intent system first.

**Independent Test**: Export High Intent segment to email platform, send targeted campaign, verify segment syncs correctly and shows expected higher engagement.

**Acceptance Scenarios**:

1. **Given** I have intent segments defined, **When** I export to email platform (HubSpot, Mailchimp), **Then** segments sync as custom audiences with daily refresh maintaining privacy compliance.
2. **Given** intent scores are available, **When** I integrate with CRM (Salesforce), **Then** each contact/lead shows current intent score and trend, enabling sales prioritization.
3. **Given** I use analytics platforms, **When** I connect intent data, **Then** I can analyze correlation between intent segments and LTV, retention, product affinity for deeper insights.

---

### Edge Cases

- What if there's insufficient data to predict intent accurately? Show intent confidence scores, warn when sample size is too small, fall back to demographic targeting with disclaimer.
- How to handle privacy regulations (GDPR, CCPA) with behavioral targeting? All intent predictions use aggregated, anonymized signals; users can opt out; no PII used in model training.
- What if intent predictions are biased against certain demographics? Implement fairness constraints in model training, audit predictions for demographic bias, provide bias reports to users.
- How to handle intent changes rapidly (user intent shifts daily)? Update intent scores daily based on latest signals, flag rapid intent changes for marketers to adjust messaging.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide at least 3 pre-built intent segments for each product category: High Intent (ready to buy within 7 days), Medium Intent (researching 7-30 days), Low Intent (awareness 30+ days).
- **FR-002**: Intent predictions MUST be based on behavioral signals including: page views, time on site, content engagement, search queries, cart actions, email interactions, social engagement, purchase history, and seasonal factors.
- **FR-003**: System MUST calculate daily intent scores (0-100) for all users in workspace based on recent behavioral signals with confidence levels.
- **FR-004**: Users MUST be able to create custom intent models by training on their historical conversion data (minimum 90 days, 100 conversions recommended).
- **FR-005**: System MUST provide Intent Drivers dashboard showing which signals contribute most to intent predictions with feature importance scores.
- **FR-006**: Intent segments MUST automatically sync to ad platforms (Meta, Google, TikTok) as custom audiences with daily refresh.
- **FR-007**: System MUST track intent prediction accuracy by comparing predicted intent vs actual conversions within predicted timeframe.
- **FR-008**: Users MUST be able to export intent segments and scores to external platforms (email, CRM, analytics) via API and integrations.
- **FR-009**: System MUST implement privacy controls: anonymized signal collection, opt-out mechanisms, no PII in predictions, GDPR/CCPA compliance.
- **FR-010**: System MUST monitor intent model fairness by detecting demographic bias and providing bias audit reports.

### Non-Functional Requirements

- **NFR-001**: Intent scores MUST be updated daily with computation completing before 6 AM local time for morning campaign optimizations.
- **NFR-002**: Intent segment creation MUST complete within 5 minutes for standard segments and 30 minutes for custom models.
- **NFR-003**: Intent predictions MUST achieve minimum 25% higher conversion rate vs demographic-only targeting (validated via A/B tests).
- **NFR-004**: System MUST handle intent calculation for 1M+ users per workspace without performance degradation.

### Key Entities *(include if feature involves data)*

- **IntentModel**: Intent prediction models
  - id, name, workspaceId, modelType (GENERIC | CUSTOM)
  - productCategory (e-commerce, B2B-SaaS, etc.)
  - signals (JSON array of behavioral signals used)
  - timeframe (predict intent in next 7/14/30 days)
  - accuracy (validation metric), confidence, status (TRAINING | ACTIVE | DEPRECATED)
  - trainedOn (date), trainingDataSize (conversion count)
  - createdAt, updatedAt

- **IntentScore**: User intent predictions
  - id, userId (or anonymousId), workspaceId, modelId
  - intentScore (0-100), intentSegment (HIGH | MEDIUM | LOW | CUSTOM)
  - confidence (0-1), lastUpdated
  - signals (JSON: which signals contributed to score)
  - predictedConversionDate (when model predicts conversion)
  - actualConverted (boolean), actualConversionDate
  - createdAt

- **IntentSignal**: Behavioral signal definitions
  - id, name, description, category (ENGAGEMENT | NAVIGATION | TRANSACTION | EXTERNAL)
  - weight (importance in generic model), customizable (boolean)
  - dataSource (WEBSITE | EMAIL | CRM | ADS)
  - createdAt

- **IntentSegment**: Saved intent audience segments
  - id, name, workspaceId, modelId
  - criteria (JSON: intentScore >= 70, confidence >= 0.8)
  - platformAudienceIds (JSON: {meta: 'audience_123', google: 'audience_456'})
  - size (user count), lastSyncedAt
  - refreshFrequency (DAILY | WEEKLY), status (ACTIVE | PAUSED)
  - createdAt, updatedAt

- **IntentAccuracyLog**: Model performance tracking
  - id, modelId, workspaceId, date
  - predictionsCount, conversionsCount
  - truePositives, falsePositives, trueNegatives, falseNegatives
  - accuracy, precision, recall, f1Score
  - conversionLiftVsControl (percentage)
  - createdAt

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Intent-targeted campaigns achieve 25%+ higher conversion rate vs demographic-only targeting (A/B tested with 50 campaigns each).
- **SC-002**: Intent predictions achieve 70%+ precision (of users predicted High Intent, 70% convert within timeframe) over 90-day period.
- **SC-003**: Intent scores update daily for 95%+ of active users before 6 AM local time.
- **SC-004**: Custom intent models achieve 10%+ better accuracy than generic models when trained on 90+ days of data.
- **SC-005**: Intent segments sync to ad platforms successfully 98%+ of the time with daily refresh.
- **SC-006**: Intent Drivers dashboard loads in under 2 seconds showing signal importance for selected segment.
- **SC-007**: Zero demographic bias detected in intent predictions (audited monthly via fairness metrics).
- **SC-008**: 100% of intent data collection and processing complies with GDPR/CCPA (verified via compliance audit).
- **SC-009**: Users report 30%+ improvement in cost per acquisition when using intent targeting vs demographics (measured via survey after 60 days).

## Implementation Notes

### Database Schema

```sql
-- Intent prediction models
CREATE TABLE intent_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  workspace_id VARCHAR(255) NOT NULL,
  model_type VARCHAR(50) NOT NULL, -- 'GENERIC' | 'CUSTOM'
  product_category VARCHAR(100),
  signals JSONB NOT NULL,
  timeframe INTEGER NOT NULL, -- Days to predict (7, 14, 30)
  accuracy DECIMAL(5,4),
  confidence DECIMAL(3,2),
  status VARCHAR(50) NOT NULL DEFAULT 'TRAINING',
  trained_on DATE,
  training_data_size INTEGER,
  model_artifact_url VARCHAR(500), -- S3/GCS URL to model file
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_intent_models_workspace ON intent_models(workspace_id);
CREATE INDEX idx_intent_models_status ON intent_models(status);

-- User intent scores
CREATE TABLE intent_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255), -- Can be user ID or anonymous ID
  workspace_id VARCHAR(255) NOT NULL,
  model_id UUID NOT NULL REFERENCES intent_models(id) ON DELETE CASCADE,
  intent_score INTEGER NOT NULL CHECK (intent_score >= 0 AND intent_score <= 100),
  intent_segment VARCHAR(50) NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  last_updated TIMESTAMP NOT NULL,
  signals JSONB NOT NULL, -- Signal contributions
  predicted_conversion_date DATE,
  actual_converted BOOLEAN,
  actual_conversion_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_intent_scores_user ON intent_scores(user_id);
CREATE INDEX idx_intent_scores_workspace ON intent_scores(workspace_id);
CREATE INDEX idx_intent_scores_model ON intent_scores(model_id);
CREATE INDEX idx_intent_scores_segment ON intent_scores(intent_segment);
CREATE INDEX idx_intent_scores_score ON intent_scores(intent_score DESC);

-- Behavioral signals
CREATE TABLE intent_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  weight DECIMAL(3,2) NOT NULL, -- Default weight in generic model
  customizable BOOLEAN DEFAULT TRUE,
  data_source VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Intent segments
CREATE TABLE intent_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  workspace_id VARCHAR(255) NOT NULL,
  model_id UUID NOT NULL REFERENCES intent_models(id) ON DELETE CASCADE,
  criteria JSONB NOT NULL,
  platform_audience_ids JSONB, -- {meta: 'aud_123', google: 'aud_456'}
  size INTEGER,
  last_synced_at TIMESTAMP,
  refresh_frequency VARCHAR(50) NOT NULL DEFAULT 'DAILY',
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_intent_segments_workspace ON intent_segments(workspace_id);
CREATE INDEX idx_intent_segments_model ON intent_segments(model_id);

-- Model accuracy tracking
CREATE TABLE intent_accuracy_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES intent_models(id) ON DELETE CASCADE,
  workspace_id VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  predictions_count INTEGER NOT NULL,
  conversions_count INTEGER NOT NULL,
  true_positives INTEGER NOT NULL,
  false_positives INTEGER NOT NULL,
  true_negatives INTEGER NOT NULL,
  false_negatives INTEGER NOT NULL,
  accuracy DECIMAL(5,4),
  precision DECIMAL(5,4),
  recall DECIMAL(5,4),
  f1_score DECIMAL(5,4),
  conversion_lift_vs_control DECIMAL(5,2), -- Percentage lift
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(model_id, date)
);

CREATE INDEX idx_intent_accuracy_model ON intent_accuracy_logs(model_id);
CREATE INDEX idx_intent_accuracy_date ON intent_accuracy_logs(date DESC);
```

### API Endpoints

```
# Intent Models
GET    /api/v1/intent/models                - List available intent models
POST   /api/v1/intent/models                - Create custom intent model
GET    /api/v1/intent/models/:id            - Get model details and performance
DELETE /api/v1/intent/models/:id            - Delete custom model

# Intent Scores & Segments
GET    /api/v1/intent/scores                - Get intent scores for users (paginated)
GET    /api/v1/intent/scores/:userId        - Get specific user's intent score
POST   /api/v1/intent/segments              - Create intent segment
GET    /api/v1/intent/segments              - List intent segments
GET    /api/v1/intent/segments/:id/users    - Get users in segment
POST   /api/v1/intent/segments/:id/sync     - Manually trigger platform sync

# Intent Analysis
GET    /api/v1/intent/drivers               - Get intent signal importance (feature importance)
GET    /api/v1/intent/accuracy              - Get model accuracy dashboard
GET    /api/v1/intent/export                - Export intent data (CSV/JSON)

# Integrations
POST   /api/v1/intent/integrations/crm      - Sync intent scores to CRM
POST   /api/v1/intent/integrations/email    - Sync segments to email platform
```

### Intent Scoring Algorithm

```typescript
async calculateIntentScore(user: User, model: IntentModel): Promise<IntentScore> {
  // Collect behavioral signals for user
  const signals = await this.collectSignals(user.id, model.timeframe);

  // Calculate weighted score
  let score = 0;
  const contributions = {};

  for (const signal of model.signals) {
    const signalValue = signals[signal.name] || 0;
    const normalizedValue = this.normalize(signalValue, signal);
    const contribution = normalizedValue * signal.weight;
    score += contribution;
    contributions[signal.name] = contribution;
  }

  // Normalize to 0-100 scale
  score = Math.min(100, Math.max(0, score * 100));

  // Calculate confidence based on signal completeness
  const confidence = signals.length / model.signals.length;

  // Determine segment
  const segment = this.classifySegment(score, model);

  // Predict conversion date
  const predictedDate = this.predictConversionDate(score, model.timeframe);

  return {
    userId: user.id,
    modelId: model.id,
    intentScore: Math.round(score),
    intentSegment: segment,
    confidence,
    signals: contributions,
    predictedConversionDate: predictedDate,
    lastUpdated: new Date()
  };
}

classifySegment(score: number, model: IntentModel): string {
  if (score >= 70) return 'HIGH'; // Ready to buy
  if (score >= 40) return 'MEDIUM'; // Researching
  return 'LOW'; // Awareness
}
```

### Testing Strategy

1. **Unit Tests**: Intent scoring algorithm, signal collection, segment classification
2. **Integration Tests**: End-to-end model training → scoring → segment creation → platform sync
3. **A/B Tests**: Compare intent-targeted vs demographic-targeted campaigns (50 each, 30 days)
4. **Performance Tests**: Calculate intent scores for 1M users, verify completes in <6 hours
5. **Fairness Tests**: Audit model predictions for demographic bias using fairness metrics
6. **Privacy Tests**: Verify no PII leakage, opt-out functionality, GDPR/CCPA compliance
