# Implementation Tasks: Unmock AI Integration

**Feature**: 006-unmock-ai-integration
**Generated**: 2025-11-05
**User Stories**: 4 (P1: 2, P2: 1, P3: 1)

---

## Phase 1: Setup & Infrastructure

**Goal**: Install dependencies and create foundational structure for AI integration.

**Independent Test**: Verify that all dependencies install successfully and TypeScript compiles without errors.

### Tasks

- [ ] T001 Install Anthropic SDK in backend/package.json: `npm install @anthropic-ai/sdk@^0.30.0`
- [ ] T002 [P] Install OpenAI SDK in backend/package.json: `npm install openai@^4.68.0`
- [ ] T003 [P] Install Zod for schema validation in backend/package.json: `npm install zod@^3.22.0`
- [ ] T004 Create AI services directory structure at backend/src/services/ai/
- [ ] T005 [P] Create AI providers subdirectory at backend/src/services/ai/providers/
- [ ] T006 Update backend/.env.example with AI configuration variables (AI_PROVIDER, ANTHROPIC_API_KEY, OPENAI_API_KEY, AI_MAX_REQUESTS_PER_HOUR, AI_CACHE_TTL_SECONDS, AI_REQUEST_TIMEOUT_MS, AI_MAX_RETRIES, ANTHROPIC_MODEL, OPENAI_MODEL)

---

## Phase 2: Database Entities

**Goal**: Create database entities for AI request logging and recommendation caching.

**Independent Test**: Run database migrations and verify tables are created correctly.

### Tasks

- [ ] T007 Create AIRequestLog entity in backend/src/database/entities/ai-request-log.entity.ts (fields: id, workspaceId, provider, model, promptTokens, completionTokens, totalTokens, latencyMs, success, errorMessage, createdAt)
- [ ] T008 [P] Create RecommendationCache entity in backend/src/database/entities/recommendation-cache.entity.ts (fields: id, workspaceId, cacheKey, recommendations, expiresAt, createdAt)
- [ ] T009 Update database module to include new entities in backend/src/database/database.module.ts

---

## Phase 3: User Story 1 - Real AI Recommendation Generation (P1)

**Goal**: Implement real LLM integration for generating campaign recommendations.

**Independent Test**: Sync campaign data and verify that AI generates contextually relevant recommendations using real LLM APIs.

### Tasks

- [ ] T010 [US1] Create BaseLLMProvider abstract class in backend/src/services/ai/providers/base.provider.ts (methods: generateRecommendations, generateSummary, generateInsight)
- [ ] T011 [US1] Implement PromptBuilder service in backend/src/services/ai/prompt-builder.ts (methods: buildRecommendationsPrompt, buildSummaryPrompt, buildInsightPrompt)
- [ ] T012 [US1] Create Zod schemas for AI responses in backend/src/services/ai/response-parser.ts (AIRecommendationSchema, AIRecommendationsResponseSchema)
- [ ] T013 [US1] Implement ResponseParser service in backend/src/services/ai/response-parser.ts (method: parseRecommendations with Zod validation)
- [ ] T014 [US1] Implement AnthropicProvider in backend/src/services/ai/providers/anthropic.provider.ts (integrate @anthropic-ai/sdk, implement all abstract methods)
- [ ] T015 [P] [US1] Implement OpenAIProvider in backend/src/services/ai/providers/openai.provider.ts (integrate openai SDK, implement all abstract methods)
- [ ] T016 [US1] Refactor AICoreClient in backend/src/services/ai-core.client.ts to use provider abstraction (add provider selection based on AI_PROVIDER env var)
- [ ] T017 [US1] Implement retry logic with exponential backoff in AICoreClient (max 3 retries, delays: 1s, 2s, 4s)
- [ ] T018 [US1] Add AIRequestLog tracking to AICoreClient for all LLM API calls
- [ ] T019 [US1] Add 30-second timeout to all LLM API requests in providers

---

## Phase 4: User Story 2 - AI-Powered Daily Summaries (P1)

**Goal**: Generate intelligent WhatsApp summaries using real AI analysis.

**Independent Test**: Trigger daily summary generation and verify WhatsApp message contains AI-analyzed insights.

### Tasks

- [ ] T020 [US2] Implement generateDailySummary method in AnthropicProvider using Claude API
- [ ] T021 [P] [US2] Implement generateDailySummary method in OpenAIProvider using OpenAI API
- [ ] T022 [US2] Update AICoreClient.generateDailySummary to call provider's method instead of returning mock text
- [ ] T023 [US2] Add prompt template for daily summary in PromptBuilder (format: WhatsApp-friendly, max 500 chars, top 3 priorities)

---

## Phase 5: Caching & Rate Limiting (P1)

**Goal**: Implement caching and rate limiting to control costs and improve performance.

**Independent Test**: Verify that repeated requests within 1 hour return cached data and rate limit triggers at 11th request.

### Tasks

- [ ] T024 [US1] Implement AICacheService in backend/src/services/ai/ai-cache.service.ts (methods: get, set, invalidate, TTL: 1 hour)
- [ ] T025 [US1] Add in-memory Map-based cache implementation as fallback in AICacheService
- [ ] T026 [US1] Integrate caching in AICoreClient.generateRecommendations (check cache before LLM call, store after successful generation)
- [ ] T027 [US1] Implement rate limiting in AICoreClient using sliding window (max 10 requests per hour per workspace)
- [ ] T028 [US1] Add rate limit exceeded error handling (throw HTTP 429 with Retry-After header)

---

## Phase 6: User Story 3 - Global Insights (P2)

**Goal**: Generate AI-powered strategic insights for the dashboard.

**Independent Test**: Load dashboard and verify global insight is dynamically generated based on current data.

### Tasks

- [ ] T029 [US3] Implement getGlobalInsight method in AnthropicProvider
- [ ] T030 [P] [US3] Implement getGlobalInsight method in OpenAIProvider
- [ ] T031 [US3] Update AICoreClient.getGlobalInsight to call provider's method with structured campaign data
- [ ] T032 [US3] Add prompt template for global insight in PromptBuilder (format: single-sentence strategic recommendation)
- [ ] T033 [US3] Add data quality check before generating insight (require min 7 days history, min 100 impressions)
- [ ] T034 [US3] Implement fallback message for insufficient data cases

---

## Phase 7: Error Handling & Resilience (P1)

**Goal**: Implement comprehensive error handling and fallback mechanisms.

**Independent Test**: Simulate API failures and verify system falls back gracefully to cached data.

### Tasks

- [ ] T035 [US1] Implement error handling for LLM API timeouts in providers
- [ ] T036 [US1] Implement error handling for LLM API quota exceeded errors in providers
- [ ] T037 [US1] Implement error handling for malformed responses in ResponseParser (retry once on validation failure)
- [ ] T038 [US1] Implement fallback to cached recommendations when LLM API fails after all retries
- [ ] T039 [US1] Add comprehensive error logging to AIRequestLog (sanitize sensitive data)
- [ ] T040 [US1] Add warning messages to UI when using cached/fallback recommendations

---

## Phase 8: User Story 4 - Provider Configuration (P3)

**Goal**: Add provider switching and configuration flexibility.

**Independent Test**: Switch AI_PROVIDER env var and verify system uses correct provider.

### Tasks

- [ ] T041 [US4] Add provider factory pattern to AICoreClient (dynamically instantiate provider based on AI_PROVIDER env var)
- [ ] T042 [US4] Add validation for provider configuration (throw error if API key missing for selected provider)
- [ ] T043 [US4] Add support for model selection via environment variables (ANTHROPIC_MODEL, OPENAI_MODEL)
- [ ] T044 [US4] Implement AI_MOCK_MODE feature flag for backward compatibility with old mock behavior

---

## Phase 9: Testing & Validation

**Goal**: Comprehensive testing of all AI integration components.

**Independent Test**: All tests pass and manual validation confirms AI quality.

### Tasks

- [ ] T045 Create unit tests for PromptBuilder in backend/src/services/ai/prompt-builder.spec.ts
- [ ] T046 [P] Create unit tests for ResponseParser in backend/src/services/ai/response-parser.spec.ts
- [ ] T047 [P] Create unit tests for AnthropicProvider in backend/src/services/ai/providers/anthropic.provider.spec.ts (mock SDK calls)
- [ ] T048 [P] Create unit tests for OpenAIProvider in backend/src/services/ai/providers/openai.provider.spec.ts (mock SDK calls)
- [ ] T049 [P] Create unit tests for AICacheService in backend/src/services/ai/ai-cache.service.spec.ts
- [ ] T050 Update integration tests for AICoreClient to use test API keys
- [ ] T051 Perform manual testing: Verify AI-generated recommendations differ based on input campaign data
- [ ] T052 [P] Perform manual testing: Verify all ads platform mocks still work (Google, Meta, TikTok, Twilio, Tienda Nube)
- [ ] T053 [P] Perform load testing: Verify rate limiting works with 15 concurrent requests per workspace

---

## Phase 10: Polish & Documentation

**Goal**: Final refinements, monitoring, and documentation.

### Tasks

- [ ] T054 Add cost tracking dashboard for AI usage per workspace (display in admin panel)
- [ ] T055 [P] Add monitoring alerts for workspaces exceeding $5/month AI costs
- [ ] T056 [P] Update README.md with AI provider setup instructions
- [ ] T057 Create migration guide for transitioning from mock to real AI
- [ ] T058 Add JSDoc comments to all new AI service classes and methods

---

## Dependencies & Execution Order

### Critical Path (Must Complete in Order)

1. **Phase 1** (Setup) → BLOCKS all other phases
2. **Phase 2** (Database) → BLOCKS Phase 5 (caching)
3. **Phase 3** (US1: Core AI) → BLOCKS Phase 4, 6, 7
4. **Phase 5** (Caching) → BLOCKS Phase 9 (testing caching)
5. **Phase 7** (Error Handling) → BLOCKS Phase 9 (testing error scenarios)

### Parallelizable Work

- T001, T002, T003 (dependency installation) can run in parallel
- T007, T008 (entity creation) can run in parallel
- T014, T015 (provider implementations) can run in parallel after T010 (base class)
- T020, T021 (summary methods) can run in parallel
- T029, T030 (insight methods) can run in parallel
- All test creation tasks (T045-T049, T052-T053) can run in parallel

### Story Completion Order

1. **US1** (Real AI recommendations) - Core functionality, must complete first
2. **US2** (Daily summaries) - Depends on US1 provider infrastructure
3. **US3** (Global insights) - Independent of US2, can run after US1
4. **US4** (Provider config) - Final polish, runs after all core features

---

## Parallel Execution Examples

### After Phase 1 Complete (Dependencies Installed)

```bash
# Can work on these simultaneously:
- Create database entities (T007, T008)
- Create base provider class (T010)
- Create PromptBuilder (T011)
```

### After Phase 3 Core Complete (Providers Implemented)

```bash
# Can work on these simultaneously:
- Implement daily summary for Anthropic (T020)
- Implement daily summary for OpenAI (T021)
- Implement caching service (T024)
- Implement global insight for Anthropic (T029)
- Implement global insight for OpenAI (T030)
```

---

## Implementation Strategy

**MVP Scope**: User Story 1 only (Real AI Recommendations)
- Tasks: T001-T019 (Core AI integration)
- Estimated effort: 4-6 hours
- Validation: Manual testing with sample campaign data

**Incremental Delivery**:
1. **Sprint 1**: US1 (T001-T019) + Phase 5 (T024-T028) - Core AI with caching
2. **Sprint 2**: US2 (T020-T023) + Phase 7 (T035-T040) - Summaries + error handling
3. **Sprint 3**: US3 (T029-T034) + US4 (T041-T044) - Insights + configuration
4. **Sprint 4**: Phase 9-10 (T045-T058) - Testing + polish

---

## Total Tasks: 58

- **Setup & Infrastructure**: 6 tasks
- **Database**: 3 tasks
- **User Story 1 (P1)**: 10 tasks
- **User Story 2 (P1)**: 4 tasks
- **Caching & Rate Limiting**: 5 tasks
- **User Story 3 (P2)**: 6 tasks
- **Error Handling**: 6 tasks
- **User Story 4 (P3)**: 4 tasks
- **Testing**: 9 tasks
- **Polish**: 5 tasks

**Parallelizable**: 18 tasks marked with [P]
**Story-specific**: 34 tasks marked with [US1-4]
