/**
 * Mock Meta Ads API Client
 * Simulates responses from Meta (Facebook/Instagram) Ads API
 */

export interface MetaCampaignData {
  id: string;
  name: string;
  status: string;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  date: Date;
}

export class MetaAdsApiMock {
  /**
   * Fetches campaign performance data from Meta Ads
   */
  async getCampaigns(startDate: Date, endDate: Date): Promise<MetaCampaignData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return [
      {
        id: 'meta_001',
        name: 'Vestido Lino - Instagram Stories',
        status: 'ACTIVE',
        spend: 45000,
        revenue: 180000,
        impressions: 125000,
        clicks: 3500,
        date: new Date(),
      },
      {
        id: 'meta_002',
        name: 'Reels Noche - TikTok',
        status: 'ACTIVE',
        spend: 50000,
        revenue: 40000,
        impressions: 200000,
        clicks: 4000,
        date: new Date(),
      },
      {
        id: 'meta_003',
        name: 'Colección Primavera - Facebook Feed',
        status: 'ACTIVE',
        spend: 30000,
        revenue: 95000,
        impressions: 80000,
        clicks: 2100,
        date: new Date(),
      },
      {
        id: 'meta_004',
        name: 'Tapado Paño - Instagram Feed',
        status: 'ACTIVE',
        spend: 25000,
        revenue: 60000,
        impressions: 65000,
        clicks: 1800,
        date: new Date(),
      },
    ];
  }
}
