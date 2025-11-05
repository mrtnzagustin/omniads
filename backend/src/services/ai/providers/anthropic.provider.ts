import Anthropic from '@anthropic-ai/sdk';
import { BaseLLMProvider } from './base.provider';
import { AIRecommendation, AIAnalysisRequest } from '../../ai-core.client';
import { PromptBuilder } from '../prompt-builder';
import { ResponseParser } from '../response-parser';

/**
 * Anthropic Claude provider implementation
 */
export class AnthropicProvider extends BaseLLMProvider {
  private client: Anthropic;
  private model: string;

  constructor() {
    super();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }

    this.client = new Anthropic({ apiKey });
    this.model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

    console.log(`[AnthropicProvider] Initialized with model: ${this.model}`);
  }

  getProviderName(): string {
    return 'anthropic';
  }

  getModelName(): string {
    return this.model;
  }

  async generateRecommendations(request: AIAnalysisRequest): Promise<{
    recommendations: AIRecommendation[];
    usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  }> {
    const prompt = PromptBuilder.buildRecommendationsPrompt(request);

    const executeRequest = async () => {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        temperature: 0.3, // Lower temperature for more consistent structured output
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Extract text from response
      const textContent = response.content.find((c) => c.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text content in Claude response');
      }

      const responseText = textContent.text;

      // Parse and validate recommendations
      let recommendations: AIRecommendation[];
      try {
        recommendations = ResponseParser.parseRecommendations(responseText);
      } catch (error) {
        console.warn('[AnthropicProvider] Primary parsing failed, attempting partial extraction');
        recommendations = ResponseParser.extractPartialRecommendations(responseText);

        if (recommendations.length === 0) {
          throw new Error(`Failed to parse recommendations: ${error.message}`);
        }
      }

      // Extract usage stats
      const usage = {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      };

      console.log(
        `[AnthropicProvider] Generated ${recommendations.length} recommendations using ${usage.totalTokens} tokens`,
      );

      return { recommendations, usage };
    };

    return this.withTimeout(() => this.withRetry(executeRequest));
  }

  async generateDailySummary(recommendations: AIRecommendation[]): Promise<{
    summary: string;
    usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  }> {
    const prompt = PromptBuilder.buildSummaryPrompt(recommendations);

    const executeRequest = async () => {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        temperature: 0.5,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const textContent = response.content.find((c) => c.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text content in Claude response');
      }

      const summary = ResponseParser.parseSummary(textContent.text);

      const usage = {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      };

      console.log(`[AnthropicProvider] Generated summary using ${usage.totalTokens} tokens`);

      return { summary, usage };
    };

    return this.withTimeout(() => this.withRetry(executeRequest));
  }

  async getGlobalInsight(campaigns: any[]): Promise<{
    insight: string;
    usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  }> {
    const prompt = PromptBuilder.buildInsightPrompt(campaigns);

    const executeRequest = async () => {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 512,
        temperature: 0.4,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const textContent = response.content.find((c) => c.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text content in Claude response');
      }

      const insight = ResponseParser.parseInsight(textContent.text);

      const usage = {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      };

      console.log(`[AnthropicProvider] Generated insight using ${usage.totalTokens} tokens`);

      return { insight, usage };
    };

    return this.withTimeout(() => this.withRetry(executeRequest));
  }
}
