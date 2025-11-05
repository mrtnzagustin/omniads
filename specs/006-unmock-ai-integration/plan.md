# Implementation Plan: Unmock AI Integration

**Feature**: 006-unmock-ai-integration
**Tech Stack**: NestJS, TypeScript, Anthropic Claude SDK, OpenAI SDK, Zod, Redis
**Created**: 2025-11-05

## Overview

Replace the current mocked AI Core Client with real LLM integrations (Anthropic Claude and OpenAI) while maintaining all existing mock implementations for ads platforms (Google Ads, Meta Ads, TikTok Ads, Twilio, Tienda Nube).

## Architecture

### AI Provider Layer

```
src/services/ai/
├── providers/
│   ├── base.provider.ts         # Abstract base class for LLM providers
│   ├── anthropic.provider.ts    # Anthropic Claude implementation
│   └── openai.provider.ts       # OpenAI implementation
├── prompt-builder.ts            # Constructs structured prompts
├── response-parser.ts           # Validates and parses LLM responses
└── ai-cache.service.ts          # Caching layer for recommendations
```

### Modified Files

- `src/services/ai-core.client.ts` - Refactor to use provider abstraction
- `backend/.env.example` - Add AI configuration variables
- `backend/package.json` - Add new dependencies

### New Database Entities

- `src/database/entities/ai-request-log.entity.ts` - Track API usage
- `src/database/entities/recommendation-cache.entity.ts` - Cache recommendations

## Tech Stack Details

### Dependencies

```json
{
  "@anthropic-ai/sdk": "^0.30.0",
  "openai": "^4.68.0",
  "zod": "^3.22.0"
}
```

### Environment Variables

```env
# AI Provider Selection
AI_PROVIDER=anthropic  # or 'openai'

# API Keys
ANTHROPIC_API_KEY=sk-ant-xxx
OPENAI_API_KEY=sk-xxx

# Configuration
AI_MAX_REQUESTS_PER_HOUR=10
AI_CACHE_TTL_SECONDS=3600
AI_REQUEST_TIMEOUT_MS=30000
AI_MAX_RETRIES=3
AI_RETRY_DELAY_MS=1000

# Model Selection
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
OPENAI_MODEL=gpt-4o-mini
```

## Project Structure

```
backend/
├── src/
│   ├── services/
│   │   ├── ai/                           # NEW: AI provider abstraction
│   │   │   ├── providers/
│   │   │   │   ├── base.provider.ts
│   │   │   │   ├── anthropic.provider.ts
│   │   │   │   └── openai.provider.ts
│   │   │   ├── prompt-builder.ts
│   │   │   ├── response-parser.ts
│   │   │   └── ai-cache.service.ts
│   │   ├── ai-core.client.ts            # MODIFIED: Use real providers
│   │   ├── data-sync.service.ts         # UNCHANGED: Already calls AICoreClient
│   │   └── mocks/                        # UNCHANGED: Keep all mocks
│   │       ├── googleApi.ts
│   │       ├── metaApi.ts
│   │       ├── tiktokApi.ts
│   │       ├── twilioApi.ts
│   │       └── tiendanubeApi.ts
│   └── database/
│       └── entities/
│           ├── ai-request-log.entity.ts  # NEW
│           └── recommendation-cache.entity.ts  # NEW
└── .env.example                          # MODIFIED: Add AI config
```

## Implementation Strategy

### Phase 1: Setup & Infrastructure (P1)

1. Install dependencies (`@anthropic-ai/sdk`, `openai`, `zod`)
2. Create base provider interface
3. Set up database entities for logging and caching
4. Configure environment variables

### Phase 2: Provider Implementations (P1)

1. Implement `BaseLLMProvider` abstract class
2. Implement `AnthropicProvider` with Claude API integration
3. Implement `OpenAIProvider` with OpenAI API integration
4. Implement `PromptBuilder` for structured prompt construction
5. Implement `ResponseParser` with Zod validation

### Phase 3: Caching & Rate Limiting (P1)

1. Implement `AICacheService` with Redis/in-memory fallback
2. Add rate limiting using sliding window algorithm
3. Implement cache invalidation logic

### Phase 4: Core Client Refactor (P1)

1. Refactor `AICoreClient` to use provider abstraction
2. Implement error handling and retry logic
3. Add request logging for cost tracking
4. Maintain backward-compatible interface

### Phase 5: Testing & Validation (P2)

1. Unit tests for each provider
2. Integration tests with test API keys
3. Manual validation of AI-generated recommendations
4. Verify ads platform mocks remain unchanged

### Phase 6: Configuration & Polish (P3)

1. Add provider switching capability
2. Implement fallback mechanisms
3. Add monitoring and alerting
4. Documentation updates

## Prompt Design

### Recommendation Generation Prompt

```typescript
interface PromptContext {
  campaigns: Campaign[];
  products: Product[];
  sales: Sale[];
  merchantData?: MerchantPricing[];
}

// Structured prompt:
// 1. System context: Role as marketing AI analyst
// 2. Input data: JSON-formatted campaign/product/sales metrics
// 3. Task: Generate 6 recommendation types with priorities
// 4. Output format: Structured JSON array matching AIRecommendation schema
// 5. Few-shot examples: 2-3 example recommendations
```

### Daily Summary Prompt

```typescript
// Concise summary prompt:
// - Input: Array of AIRecommendation objects
// - Output: WhatsApp-friendly text (max 500 chars)
// - Format: Top 3 priorities with action items
```

### Global Insight Prompt

```typescript
// Strategic analysis prompt:
// - Input: Multi-platform performance data
// - Output: Single-sentence strategic recommendation
// - Focus: Cross-platform optimization opportunities
```

## Response Schema (Zod)

```typescript
const AIRecommendationSchema = z.object({
  type: z.enum([
    'PAUSE_CAMPAIGN',
    'SCALE_CAMPAIGN',
    'BUDGET_SHIFT',
    'COMPETITOR_PRICE',
    'PROMOTE_ORGANIC',
    'CREATE_BUNDLE',
  ]),
  title: z.string().min(10).max(200),
  description: z.string().min(20).max(1000),
  data: z.record(z.any()),
  priority: z.number().min(1).max(10),
});

const AIRecommendationsResponseSchema = z.array(AIRecommendationSchema);
```

## Error Handling

### LLM API Failures

- **Timeout**: 30s timeout on all API requests
- **Retry**: Exponential backoff (1s, 2s, 4s delays)
- **Fallback**: Return cached recommendations with warning
- **Logging**: Log all errors to AIRequestLog with failure reason

### Validation Failures

- **Schema mismatch**: Retry once, then log error
- **Partial success**: Accept valid recommendations, discard invalid
- **Total failure**: Fall back to cached data or empty array with warning

### Rate Limiting

- **Limit exceeded**: Return HTTP 429 with Retry-After header
- **User notification**: Display rate limit warning in UI
- **Graceful degradation**: Show cached recommendations

## Cost Control

### Request Optimization

- **Caching**: 1-hour TTL per workspace reduces redundant calls
- **Rate limiting**: Max 10 calls/hour per workspace
- **Token optimization**: Keep prompts under 4K input tokens
- **Model selection**: Use cost-effective models (Claude Haiku, GPT-4o-mini)

### Monitoring

- Track token usage via `AIRequestLog`
- Alert when workspace exceeds $5/month
- Monthly cost reports per workspace

## Migration Strategy

### Backward Compatibility

- Maintain existing `AICoreClient` interface
- No changes to `data-sync.service.ts` or consuming services
- Zero downtime deployment

### Feature Flag (Optional)

```env
AI_MOCK_MODE=false  # Set to true to use old mock behavior
```

## Testing Checklist

- [ ] Unit tests for AnthropicProvider
- [ ] Unit tests for OpenAIProvider
- [ ] Unit tests for PromptBuilder
- [ ] Unit tests for ResponseParser with Zod schemas
- [ ] Integration test: Full AI generation flow with test API keys
- [ ] Manual test: Verify ads platform mocks still work (no real API calls)
- [ ] Manual test: Compare AI recommendations quality
- [ ] Load test: 100 concurrent requests to verify rate limiting
- [ ] Error test: Simulate API failures and verify fallbacks

## Security Considerations

- **API Keys**: Store in environment variables, never commit
- **Data sanitization**: Remove PII before logging AI requests/responses
- **Access control**: Restrict AI endpoint access by workspace permissions
- **Audit trail**: Log all AI operations in AIRequestLog

## Success Metrics

1. **Functionality**: 100% of recommendations use real LLM APIs
2. **Performance**: 95th percentile latency < 10s
3. **Reliability**: 99% success rate for AI generation
4. **Cost**: Average cost per workspace < $5/month
5. **Quality**: Manual validation confirms contextually relevant recommendations
