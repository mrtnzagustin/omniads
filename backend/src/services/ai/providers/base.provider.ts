import { AIRecommendation, AIAnalysisRequest } from '../../ai-core.client';

/**
 * Abstract base class for LLM providers
 * Defines the contract that all AI providers must implement
 */
export abstract class BaseLLMProvider {
  protected readonly timeout: number;
  protected readonly maxRetries: number;
  protected readonly retryDelay: number;

  constructor() {
    this.timeout = parseInt(process.env.AI_REQUEST_TIMEOUT_MS || '30000', 10);
    this.maxRetries = parseInt(process.env.AI_MAX_RETRIES || '3', 10);
    this.retryDelay = parseInt(process.env.AI_RETRY_DELAY_MS || '1000', 10);
  }

  /**
   * Generate AI recommendations based on campaign, product, and sales data
   */
  abstract generateRecommendations(
    request: AIAnalysisRequest,
  ): Promise<{
    recommendations: AIRecommendation[];
    usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  }>;

  /**
   * Generate a daily summary for WhatsApp
   */
  abstract generateDailySummary(
    recommendations: AIRecommendation[],
  ): Promise<{ summary: string; usage: { promptTokens: number; completionTokens: number; totalTokens: number } }>;

  /**
   * Generate a global insight for the dashboard
   */
  abstract getGlobalInsight(
    campaigns: any[],
  ): Promise<{ insight: string; usage: { promptTokens: number; completionTokens: number; totalTokens: number } }>;

  /**
   * Get the provider name
   */
  abstract getProviderName(): string;

  /**
   * Get the model name
   */
  abstract getModelName(): string;

  /**
   * Execute a function with retry logic and exponential backoff
   */
  protected async withRetry<T>(fn: () => Promise<T>, retryCount = 0): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retryCount >= this.maxRetries) {
        throw error;
      }

      const delay = this.retryDelay * Math.pow(2, retryCount);
      console.log(
        `[${this.getProviderName()}] Request failed, retrying in ${delay}ms (attempt ${retryCount + 1}/${this.maxRetries})`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.withRetry(fn, retryCount + 1);
    }
  }

  /**
   * Execute a function with timeout
   */
  protected async withTimeout<T>(fn: () => Promise<T>): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), this.timeout),
      ),
    ]);
  }
}
