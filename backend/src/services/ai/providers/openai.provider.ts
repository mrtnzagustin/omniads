import OpenAI from 'openai';
import { BaseLLMProvider } from './base.provider';
import { AIRecommendation, AIAnalysisRequest } from '../../ai-core.client';
import { PromptBuilder } from '../prompt-builder';
import { ResponseParser } from '../response-parser';

/**
 * OpenAI provider implementation
 */
export class OpenAIProvider extends BaseLLMProvider {
  private client: OpenAI;
  private model: string;

  constructor() {
    super();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.client = new OpenAI({ apiKey });
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    console.log(`[OpenAIProvider] Initialized with model: ${this.model}`);
  }

  getProviderName(): string {
    return 'openai';
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
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert marketing AI analyst. Always respond with valid JSON only, no additional text.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      });

      const responseText = response.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('No content in OpenAI response');
      }

      // For JSON mode, OpenAI might wrap the array in an object
      let parsedResponse = JSON.parse(responseText);

      // If response is wrapped in an object, try to extract the array
      if (!Array.isArray(parsedResponse)) {
        // Look for common wrapper keys
        const arrayKey = Object.keys(parsedResponse).find(key =>
          Array.isArray(parsedResponse[key])
        );

        if (arrayKey) {
          parsedResponse = parsedResponse[arrayKey];
        } else {
          throw new Error('OpenAI response is not an array and cannot extract array from object');
        }
      }

      // Convert back to string for ResponseParser
      const arrayText = JSON.stringify(parsedResponse);

      // Parse and validate recommendations
      let recommendations: AIRecommendation[];
      try {
        recommendations = ResponseParser.parseRecommendations(arrayText);
      } catch (error) {
        console.warn('[OpenAIProvider] Primary parsing failed, attempting partial extraction');
        recommendations = ResponseParser.extractPartialRecommendations(arrayText);

        if (recommendations.length === 0) {
          throw new Error(`Failed to parse recommendations: ${error.message}`);
        }
      }

      // Extract usage stats
      const usage = {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      };

      console.log(
        `[OpenAIProvider] Generated ${recommendations.length} recommendations using ${usage.totalTokens} tokens`,
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
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a marketing analyst creating concise WhatsApp summaries.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 1024,
      });

      const responseText = response.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('No content in OpenAI response');
      }

      const summary = ResponseParser.parseSummary(responseText);

      const usage = {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      };

      console.log(`[OpenAIProvider] Generated summary using ${usage.totalTokens} tokens`);

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
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a marketing strategist providing concise strategic insights.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 512,
      });

      const responseText = response.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('No content in OpenAI response');
      }

      const insight = ResponseParser.parseInsight(responseText);

      const usage = {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      };

      console.log(`[OpenAIProvider] Generated insight using ${usage.totalTokens} tokens`);

      return { insight, usage };
    };

    return this.withTimeout(() => this.withRetry(executeRequest));
  }
}
