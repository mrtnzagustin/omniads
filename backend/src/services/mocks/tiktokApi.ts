/**
 * Mock TikTok Ads API Client
 * Simulates responses from TikTok Ads API
 */

export interface TikTokCampaignData {
  id: string;
  name: string;
  status: string;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  date: Date;
}

export class TikTokAdsApiMock {
  /**
   * Fetches campaign performance data from TikTok Ads
   */
  async getCampaigns(startDate: Date, endDate: Date): Promise<TikTokCampaignData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return [
      {
        id: 'tiktok_001',
        name: 'Vestido Verano - TikTok Video',
        status: 'ACTIVE',
        spend: 38000,
        revenue: 95000,
        impressions: 280000,
        clicks: 5600,
        date: new Date(),
      },
      {
        id: 'tiktok_002',
        name: 'Conjunto Deportivo - TikTok Spark Ads',
        status: 'ACTIVE',
        spend: 28000,
        revenue: 56000,
        impressions: 195000,
        clicks: 3900,
        date: new Date(),
      },
      {
        id: 'tiktok_003',
        name: 'Accesorios Tendencia - TikTok In-Feed',
        status: 'ACTIVE',
        spend: 15000,
        revenue: 22500,
        impressions: 150000,
        clicks: 2250,
        date: new Date(),
      },
    ];
  }
}
