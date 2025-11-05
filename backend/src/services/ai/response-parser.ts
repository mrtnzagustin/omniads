import { z } from 'zod';
import { AIRecommendation, RecommendationType } from '../ai-core.client';

/**
 * Zod schema for AI recommendation validation
 */
const AIRecommendationSchema = z.object({
  type: z.enum([
    RecommendationType.PAUSE_CAMPAIGN,
    RecommendationType.SCALE_CAMPAIGN,
    RecommendationType.BUDGET_SHIFT,
    RecommendationType.COMPETITOR_PRICE,
    RecommendationType.PROMOTE_ORGANIC,
    RecommendationType.CREATE_BUNDLE,
  ]),
  title: z.string().min(10).max(200),
  description: z.string().min(20).max(1000),
  data: z.record(z.any()),
  priority: z.number().min(1).max(10),
});

/**
 * Zod schema for array of recommendations
 */
const AIRecommendationsResponseSchema = z.array(AIRecommendationSchema);

/**
 * Service for parsing and validating LLM responses
 */
export class ResponseParser {
  /**
   * Parse and validate AI recommendations from LLM response
   * @param responseText Raw text response from LLM
   * @returns Validated array of AIRecommendation objects
   * @throws Error if validation fails
   */
  static parseRecommendations(responseText: string): AIRecommendation[] {
    try {
      // Extract JSON from response (handle code blocks)
      let jsonText = responseText.trim();

      // Remove markdown code blocks if present
      if (jsonText.startsWith('```')) {
        const lines = jsonText.split('\n');
        // Remove first and last lines (``` markers)
        jsonText = lines.slice(1, -1).join('\n');
        // Remove language identifier if present (e.g., ```json)
        if (jsonText.startsWith('json')) {
          jsonText = jsonText.substring(4).trim();
        }
      }

      // Parse JSON
      const parsed = JSON.parse(jsonText);

      // Validate with Zod
      const validated = AIRecommendationsResponseSchema.parse(parsed) as AIRecommendation[];

      console.log(`[ResponseParser] Successfully validated ${validated.length} recommendations`);
      return validated;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('[ResponseParser] Validation error:', error.errors);
        throw new Error(
          `AI response validation failed: ${error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
        );
      }

      if (error instanceof SyntaxError) {
        console.error('[ResponseParser] JSON parse error:', error.message);
        console.error('[ResponseParser] Response text:', responseText.substring(0, 500));
        throw new Error(`Failed to parse AI response as JSON: ${error.message}`);
      }

      throw error;
    }
  }

  /**
   * Parse summary text (no validation needed, just cleanup)
   */
  static parseSummary(responseText: string): string {
    return responseText.trim();
  }

  /**
   * Parse insight text (no validation needed, just cleanup)
   */
  static parseInsight(responseText: string): string {
    return responseText.trim();
  }

  /**
   * Attempt to extract partial results from malformed response
   * Used as fallback when primary parsing fails
   */
  static extractPartialRecommendations(responseText: string): AIRecommendation[] {
    try {
      const jsonText = responseText.trim();
      const parsed = JSON.parse(jsonText);

      if (!Array.isArray(parsed)) {
        return [];
      }

      // Validate each item individually, keep only valid ones
      const valid: AIRecommendation[] = [];
      for (const item of parsed) {
        try {
          const validated = AIRecommendationSchema.parse(item) as AIRecommendation;
          valid.push(validated);
        } catch (error) {
          console.warn('[ResponseParser] Skipping invalid recommendation:', error);
        }
      }

      console.log(
        `[ResponseParser] Extracted ${valid.length} valid recommendations from ${parsed.length} total`,
      );
      return valid;
    } catch (error) {
      console.error('[ResponseParser] Failed to extract partial results:', error);
      return [];
    }
  }
}
