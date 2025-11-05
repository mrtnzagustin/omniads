# Feature Specification: AI Analysis History & Knowledge Base

**Feature Branch**: `[007-ai-analysis-history]`
**Created**: 2025-11-05
**Status**: Draft
**Input**: User description: "Persistent storage of AI analyses with search and knowledge base capabilities"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View historical AI analyses (Priority: P1)

As a marketing manager, I can view all past AI-generated recommendations, summaries, and insights with timestamps and context, so that I can track how AI suggestions have evolved over time and refer back to previous strategic guidance.

**Why this priority**: Historical context is essential for understanding recommendation patterns, validating AI accuracy, and building trust in the system. Without this, users lose valuable strategic insights.

**Independent Test**: Generate multiple AI recommendations over several days, then verify that all historical analyses are retrievable with full context (campaign data, timestamps, and outcomes).

**Acceptance Scenarios**:

1. **Given** AI has generated recommendations over the past 30 days, **When** I open the Analysis History view, **Then** I see a chronological list of all AI analyses with dates, types (recommendation, summary, insight), and preview text.
2. **Given** I select a specific historical analysis, **When** I view the details, **Then** I see the full AI output, the campaign/product data that was analyzed, and any actions taken based on that analysis.
3. **Given** I want to understand AI reasoning, **When** I view an analysis, **Then** I see the input data (campaigns, metrics, products) that was sent to the AI and how it led to specific recommendations.

---

### User Story 2 - Search and filter AI analyses (Priority: P1)

As a data analyst, I can search through AI analysis history by keyword, date range, recommendation type, or campaign, so that I can quickly find relevant past insights when making current decisions.

**Why this priority**: Without search capabilities, the knowledge base becomes unusable as volume grows. Search is fundamental to making historical data actionable.

**Independent Test**: Create 50+ diverse AI analyses, then verify that search by keyword ("pause campaign"), filter by type (BUDGET_SHIFT), and date range all return accurate results.

**Acceptance Scenarios**:

1. **Given** there are 100+ historical analyses, **When** I search for "ROAS decline", **Then** I see all analyses that mentioned ROAS performance issues with relevant snippets highlighted.
2. **Given** I filter by recommendation type "SCALE_CAMPAIGN", **When** I apply the filter, **Then** I see only analyses that recommended scaling campaigns, sorted by date.
3. **Given** I want to review Q4 performance, **When** I set a date range filter for October-December, **Then** I see all AI analyses generated during that period with aggregated statistics.

---

### User Story 3 - Compare AI predictions vs actual outcomes (Priority: P2)

As a growth manager, I can see how AI predictions performed against actual results, so that I can measure AI accuracy and build confidence in following recommendations.

**Why this priority**: Outcome tracking validates AI effectiveness and helps refine prompts, but can be delivered after basic storage and retrieval work.

**Independent Test**: Accept an AI recommendation to scale a campaign, wait 7 days, then verify the system shows actual ROAS change vs predicted impact.

**Acceptance Scenarios**:

1. **Given** an AI recommendation was accepted 7+ days ago, **When** I view that historical analysis, **Then** I see a comparison of predicted outcomes vs actual performance metrics.
2. **Given** multiple recommendations have outcome data, **When** I view the AI accuracy dashboard, **Then** I see aggregate statistics like "78% of AI scale recommendations improved ROAS by predicted amount ±10%".
3. **Given** an AI prediction was incorrect, **When** I view the analysis details, **Then** I can mark it as "inaccurate" with notes to help improve future prompts.

---

### User Story 4 - AI learning from past analyses (Priority: P3)

As a product owner, I want the AI to reference its own past analyses and outcomes when generating new recommendations, so that it provides more context-aware and personalized suggestions over time.

**Why this priority**: AI memory enhances quality but requires stable storage and outcome tracking first.

**Independent Test**: Generate a recommendation, mark it as "rejected with reason", then verify that future AI analyses for similar scenarios reference this past decision.

**Acceptance Scenarios**:

1. **Given** AI previously recommended pausing a campaign and it was rejected, **When** a similar situation occurs, **Then** the AI's new recommendation acknowledges the past decision and adjusts its suggestion accordingly.
2. **Given** a workspace has 90 days of AI history, **When** generating new recommendations, **Then** the AI includes relevant context like "Similar to analysis from 2024-10-15 which resulted in 15% ROAS improvement".
3. **Given** AI makes repeated suggestions that are always rejected, **When** the system detects this pattern, **Then** it auto-tunes prompts or thresholds to reduce irrelevant suggestions.

---

### Edge Cases

- What happens when AI analysis storage grows to 10,000+ records? Implement pagination (50 per page), database indexing on frequently queried fields (type, date, workspace), and archive old analyses after 2 years.
- How to handle cases where input campaign data is deleted but AI analysis remains? Store a denormalized snapshot of key campaign metrics within the analysis record to preserve context even if source data is removed.
- What if the AI provider changes (Anthropic to OpenAI) and output format differs? Version all analyses with provider and model info, maintain backward-compatible parsing for historical records.
- How to prevent sensitive campaign data from being logged indefinitely? Implement data retention policies (configurable per workspace) and PII scrubbing for analysis logs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST persist all AI-generated outputs (recommendations, summaries, global insights) to a dedicated AIAnalysis entity with full input context, output, timestamps, and metadata.
- **FR-002**: System MUST store denormalized snapshots of the campaign/product data sent to the AI so analyses remain understandable even if source data is modified or deleted.
- **FR-003**: System MUST provide a search interface supporting keyword search (full-text), filters by type (recommendation/summary/insight), date ranges, campaign/product references, and recommendation types.
- **FR-004**: Users MUST be able to view detailed analysis history including the AI prompt sent, the response received, processing time, token usage, and any errors encountered.
- **FR-005**: System MUST track outcomes for AI recommendations by linking analyses to accepted recommendations and calculating actual vs predicted performance after 7, 14, and 30 days.
- **FR-006**: System MUST provide an AI accuracy dashboard showing aggregate statistics: acceptance rate, outcome accuracy (ROAS predictions ±10%), and most valuable recommendation types.
- **FR-007**: System MUST allow users to provide feedback on AI analyses (helpful/not helpful, accuracy rating) to inform future prompt engineering.
- **FR-008**: System MUST make recent AI analyses (last 30 days) available as context when generating new recommendations, enabling AI to reference past decisions.
- **FR-009**: System MUST implement data retention policies allowing workspaces to configure how long AI analyses are stored (default: 2 years, then archived).
- **FR-010**: System MUST provide export functionality for AI analysis history (CSV, JSON) for external analysis or compliance purposes.

### Non-Functional Requirements

- **NFR-001**: Full-text search on 10,000+ AI analyses MUST return results in under 2 seconds using database indexing (PostgreSQL full-text search or Elasticsearch).
- **NFR-002**: Historical AI analysis storage MUST NOT impact the performance of live recommendation generation (separate read replicas if needed).
- **NFR-003**: Sensitive campaign data in analysis logs MUST be encrypted at rest and access-controlled by workspace permissions.

### Key Entities *(include if feature involves data)*

- **AIAnalysis**: Core entity storing all AI interactions
  - id, workspaceId, analysisType (RECOMMENDATION | SUMMARY | INSIGHT)
  - provider (ANTHROPIC | OPENAI), model (claude-3-5-sonnet, gpt-4o-mini)
  - prompt (text sent to AI), response (full AI output)
  - inputSnapshot (JSON with campaign/product data context)
  - tokensUsed, latencyMs, status (SUCCESS | PARTIAL | FAILED)
  - createdAt, expiresAt (for retention policies)

- **AIAnalysisOutcome**: Tracks predictions vs actual results
  - id, analysisId, recommendationId (if accepted)
  - predictedMetric (e.g., "15% ROAS increase"), actualMetric
  - measurementDate (7/14/30 days after acceptance)
  - accuracyScore (calculated difference between predicted and actual)

- **AIAnalysisFeedback**: User feedback on AI quality
  - id, analysisId, userId
  - rating (1-5 stars), helpful (boolean), comment
  - feedbackType (ACCURACY | RELEVANCE | CLARITY)
  - createdAt

- **AIPromptVersion**: Tracks prompt engineering iterations
  - id, version, promptTemplate, active (boolean)
  - performanceMetrics (avg accuracy, acceptance rate)
  - createdAt

### Technical Architecture

**Storage Strategy**:
```
PostgreSQL Primary Storage:
├── AIAnalysis (main table with full-text index on prompt+response)
├── AIAnalysisOutcome (foreign key to AIAnalysis)
├── AIAnalysisFeedback (foreign key to AIAnalysis)
└── AIPromptVersion (referenced by AIAnalysis)

Optional Elasticsearch for advanced search:
└── AIAnalysisDocument (synced from PostgreSQL for search)
```

**Search Implementation**:
- PostgreSQL full-text search with `tsvector` index for basic queries
- Optional Elasticsearch integration for advanced features (fuzzy search, semantic search with embeddings)
- Frontend: Debounced search input with instant results

**Outcome Tracking**:
- Background job runs daily to calculate outcomes for analyses that are 7, 14, 30 days old
- Compares campaign metrics before/after recommendation acceptance
- Stores accuracy scores and flags significant deviations

**AI Context Window**:
- When generating new recommendations, include summary of last 10 relevant analyses
- Format: "Past context: On 2024-10-20, recommended scaling Campaign X (ROAS 3.5x), user accepted, resulted in 18% ROAS increase"
- Token budget: Reserve 500 tokens for historical context

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of AI API calls (recommendations, summaries, insights) are persisted to AIAnalysis entity with full context within 5 seconds of generation.
- **SC-002**: Users can successfully search and retrieve any AI analysis from the past 90 days with results returned in under 2 seconds.
- **SC-003**: For 80% of accepted recommendations, the system calculates and displays outcome accuracy (actual vs predicted) within 8 days of acceptance.
- **SC-004**: AI accuracy dashboard shows aggregate statistics updated daily, with at least 30 recommendations tracked for statistical significance.
- **SC-005**: When AI generates new recommendations with historical context enabled, 100% of prompts include relevant past analyses (if available) without exceeding token budgets.
- **SC-006**: Full-text search correctly matches 95%+ of keyword queries against analysis content, tested with 100 sample searches.
- **SC-007**: Users can export their complete AI analysis history (2 years max) in under 30 seconds for workspaces with up to 5,000 analyses.

## Implementation Notes

### Database Schema

```sql
-- Main AI analysis storage
CREATE TABLE ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR(255) NOT NULL,
  analysis_type VARCHAR(50) NOT NULL, -- 'RECOMMENDATION' | 'SUMMARY' | 'INSIGHT'
  provider VARCHAR(50) NOT NULL, -- 'ANTHROPIC' | 'OPENAI'
  model VARCHAR(100) NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  input_snapshot JSONB NOT NULL, -- Campaign/product data context
  tokens_used INTEGER,
  latency_ms INTEGER,
  status VARCHAR(50) NOT NULL, -- 'SUCCESS' | 'PARTIAL' | 'FAILED'
  error_message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP, -- For retention policies
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', prompt || ' ' || response)
  ) STORED
);

CREATE INDEX idx_ai_analyses_workspace ON ai_analyses(workspace_id);
CREATE INDEX idx_ai_analyses_created_at ON ai_analyses(created_at DESC);
CREATE INDEX idx_ai_analyses_type ON ai_analyses(analysis_type);
CREATE INDEX idx_ai_analyses_search ON ai_analyses USING GIN(search_vector);

-- Outcome tracking
CREATE TABLE ai_analysis_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES ai_analyses(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES recommendations(id) ON DELETE SET NULL,
  predicted_metric VARCHAR(255) NOT NULL,
  predicted_value DECIMAL(10, 2),
  actual_metric VARCHAR(255),
  actual_value DECIMAL(10, 2),
  measurement_date TIMESTAMP NOT NULL,
  measurement_period INTEGER NOT NULL, -- 7, 14, or 30 days
  accuracy_score DECIMAL(5, 2), -- Percentage accuracy
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_outcomes_analysis ON ai_analysis_outcomes(analysis_id);
CREATE INDEX idx_outcomes_measurement ON ai_analysis_outcomes(measurement_date);

-- User feedback
CREATE TABLE ai_analysis_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES ai_analyses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  helpful BOOLEAN,
  comment TEXT,
  feedback_type VARCHAR(50), -- 'ACCURACY' | 'RELEVANCE' | 'CLARITY'
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_feedback_analysis ON ai_analysis_feedback(analysis_id);
```

### API Endpoints

```
GET    /api/v1/ai-analyses              - List analyses with pagination/filters
GET    /api/v1/ai-analyses/:id          - Get specific analysis details
POST   /api/v1/ai-analyses/search       - Full-text search
GET    /api/v1/ai-analyses/:id/outcome  - Get outcome tracking for analysis
POST   /api/v1/ai-analyses/:id/feedback - Submit user feedback
GET    /api/v1/ai-analyses/accuracy     - Get AI accuracy dashboard stats
GET    /api/v1/ai-analyses/export       - Export analysis history (CSV/JSON)
```

### Integration Points

**Modify AI Core Client**:
```typescript
// After each AI call, persist to database
async generateRecommendations(request) {
  const startTime = Date.now();
  try {
    const response = await this.callLLM(request);
    const analysis = await this.saveAnalysis({
      workspaceId: request.workspaceId,
      analysisType: 'RECOMMENDATION',
      provider: this.provider,
      model: this.model,
      prompt: this.buildPrompt(request),
      response: JSON.stringify(response),
      inputSnapshot: { campaigns: request.campaigns, products: request.products },
      tokensUsed: response.usage?.total_tokens,
      latencyMs: Date.now() - startTime,
      status: 'SUCCESS'
    });
    return response;
  } catch (error) {
    await this.saveAnalysis({ ...metadata, status: 'FAILED', errorMessage: error.message });
    throw error;
  }
}
```

**Outcome Tracking Job**:
```typescript
// Cron job runs daily at 2 AM
@Cron('0 2 * * *')
async calculateOutcomes() {
  const analysesToCheck = await this.findAnalysesNeedingOutcomes([7, 14, 30]);

  for (const analysis of analysesToCheck) {
    if (analysis.recommendationId) {
      const actualMetrics = await this.getCampaignMetrics(
        analysis.recommendationId,
        analysis.measurementPeriod
      );
      const predictedMetrics = this.extractPredictions(analysis.response);
      const accuracyScore = this.calculateAccuracy(predictedMetrics, actualMetrics);

      await this.saveOutcome({
        analysisId: analysis.id,
        recommendationId: analysis.recommendationId,
        ...predictedMetrics,
        ...actualMetrics,
        accuracyScore
      });
    }
  }
}
```

### Environment Variables

```env
# AI Analysis Configuration
AI_ANALYSIS_RETENTION_DAYS=730  # 2 years default
AI_ANALYSIS_INCLUDE_CONTEXT=true  # Include historical context in prompts
AI_ANALYSIS_CONTEXT_LIMIT=10  # Max past analyses to include
ENABLE_ELASTICSEARCH=false  # Optional advanced search
```

### Testing Strategy

1. **Unit Tests**: Test analysis persistence, search queries, outcome calculations
2. **Integration Tests**: Verify full flow from AI call → storage → retrieval → outcome tracking
3. **Performance Tests**: Load test search with 10,000+ records
4. **Manual Tests**: Validate search relevance, accuracy calculations, export functionality
