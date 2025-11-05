import { AIAnalysisRequest, AIRecommendation } from '../ai-core.client';

/**
 * Service for constructing structured prompts for LLM APIs
 */
export class PromptBuilder {
  /**
   * Build a prompt for generating AI recommendations
   */
  static buildRecommendationsPrompt(request: AIAnalysisRequest): string {
    const { campaigns, products, sales, merchantData } = request;

    return `You are an expert marketing AI analyst specializing in e-commerce advertising optimization. Your task is to analyze campaign performance data and generate actionable recommendations.

## Data Summary

### Campaigns (${campaigns.length} total)
${campaigns.map((c) => `- ${c.name} (${c.platform}): Spend: $${c.spend}, Revenue: $${c.revenue}, ROAS: ${c.roas}x, Status: ${c.status}`).join('\n')}

### Products (${products.length} total)
${products.slice(0, 10).map((p) => `- ${p.name}: Price: $${p.price}, Stock: ${p.stock}, Organic Sales: ${p.organicSales || 0}`).join('\n')}

### Recent Sales (${sales.length} total)
Total Revenue: $${sales.reduce((sum, s) => sum + s.total, 0).toFixed(2)}

${merchantData ? `### Merchant Pricing Data\n${merchantData.map((m) => `- ${m.productId}: Our Price: $${m.price}, Competitor (${m.competitorName}): $${m.competitorPrice}`).join('\n')}` : ''}

## Task

Generate 3-6 actionable recommendations in the following categories:

1. **PAUSE_CAMPAIGN**: Identify underperforming campaigns (ROAS < 1.5x) that should be paused
2. **SCALE_CAMPAIGN**: Identify high-performing campaigns (ROAS > 3x) that should receive more budget
3. **BUDGET_SHIFT**: Suggest cross-platform budget reallocations
4. **COMPETITOR_PRICE**: Alert on competitor pricing changes (if merchant data available)
5. **PROMOTE_ORGANIC**: Suggest promoting organic high-performers with ads
6. **CREATE_BUNDLE**: Identify product bundling opportunities

## Output Format

Return a valid JSON array of recommendations. Each recommendation must follow this exact structure:

\`\`\`json
[
  {
    "type": "PAUSE_CAMPAIGN" | "SCALE_CAMPAIGN" | "BUDGET_SHIFT" | "COMPETITOR_PRICE" | "PROMOTE_ORGANIC" | "CREATE_BUNDLE",
    "title": "Short title (10-200 chars)",
    "description": "Detailed explanation with specific metrics and rationale (20-1000 chars)",
    "data": {
      // Type-specific data object with relevant IDs, metrics, and context
    },
    "priority": 1-10 (10 = highest priority)
  }
]
\`\`\`

## Examples

### PAUSE_CAMPAIGN Example
\`\`\`json
{
  "type": "PAUSE_CAMPAIGN",
  "title": "⚠️ Pause 'Summer Sale - Meta' Campaign",
  "description": "This Meta campaign is underperforming with a ROAS of 0.9x. It has spent $5,000 generating only $4,500 in revenue over the past 7 days with a negative trend.",
  "data": {
    "campaignId": "meta_123",
    "campaignName": "Summer Sale - Meta",
    "platform": "meta",
    "currentRoas": 0.9,
    "investment": 5000,
    "revenue": 4500,
    "trend": "negative"
  },
  "priority": 10
}
\`\`\`

### SCALE_CAMPAIGN Example
\`\`\`json
{
  "type": "SCALE_CAMPAIGN",
  "title": "🚀 Increase Budget for 'Winter Jackets - Google'",
  "description": "This campaign has exceptional performance with ROAS 5.2x and conversion rate 8.5% (vs 3.2% average). Recommend increasing daily budget by 40%.",
  "data": {
    "campaignId": "google_456",
    "campaignName": "Winter Jackets - Google",
    "platform": "google",
    "currentRoas": 5.2,
    "investment": 10000,
    "revenue": 52000,
    "conversionRate": 8.5,
    "avgConversionRate": 3.2,
    "recommendedBudgetIncrease": 40
  },
  "priority": 9
}
\`\`\`

Now analyze the provided data and generate your recommendations. Return ONLY the JSON array, no additional text.`;
  }

  /**
   * Build a prompt for generating daily summary
   */
  static buildSummaryPrompt(recommendations: AIRecommendation[]): string {
    const highPriority = recommendations.filter((r) => r.priority >= 8);

    return `You are a marketing analyst creating a concise WhatsApp daily summary.

## Recommendations (${recommendations.length} total, ${highPriority.length} high priority)

${recommendations.map((r, i) => `${i + 1}. [${r.type}] ${r.title}\n   ${r.description}`).join('\n\n')}

## Task

Create a concise, actionable WhatsApp message (max 500 characters) that:
1. Highlights the top 3 most impactful actions
2. Uses emojis for visual clarity
3. Includes the total recommendation count
4. Is formatted for WhatsApp (short paragraphs, bullet points)

## Example Output

📊 Today's Top Actions:

1. ⚠️ Pause "Summer Sale" (ROAS 0.9x, losing $500)
2. 🚀 Scale "Winter Jackets" (+40% budget, ROAS 5.2x)
3. 💰 Competitor dropped price 25% on "Grey Coat"

🎯 Total: ${recommendations.length} recommendations

Return ONLY the summary text, no additional commentary.`;
  }

  /**
   * Build a prompt for generating global insight
   */
  static buildInsightPrompt(campaigns: any[]): string {
    // Group campaigns by platform
    const byPlatform = campaigns.reduce((acc, c) => {
      if (!acc[c.platform]) {
        acc[c.platform] = { spend: 0, revenue: 0, count: 0 };
      }
      acc[c.platform].spend += c.spend;
      acc[c.platform].revenue += c.revenue;
      acc[c.platform].count += 1;
      return acc;
    }, {});

    const platformSummary = Object.entries(byPlatform)
      .map(([platform, data]: [string, any]) => {
        const roas = data.revenue / data.spend;
        return `${platform}: ${data.count} campaigns, $${data.spend} spend, $${data.revenue} revenue, ROAS ${roas.toFixed(2)}x`;
      })
      .join('\n');

    return `You are a marketing strategist providing a high-level strategic insight.

## Platform Performance Summary

${platformSummary}

## Task

Generate a single-sentence strategic recommendation (max 200 characters) that:
1. Identifies the best and worst performing platforms
2. Suggests a specific cross-platform optimization action
3. Is concise and actionable

## Example

"Google Ads leads with ROAS 4.2x while Meta underperforms at 1.1x—reallocate 30% of Meta budget to Google Shopping campaigns."

Return ONLY the insight sentence, no additional text.`;
  }
}
