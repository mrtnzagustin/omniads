/**
 * Mock Google Ads API Client
 * Simulates responses from Google Ads and Google Shopping/Merchant Center APIs
 */

export interface GoogleCampaignData {
  id: string;
  name: string;
  status: string;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  conversionRate: number;
  date: Date;
}

export interface GoogleMerchantData {
  productId: string;
  productName: string;
  price: number;
  competitorPrice: number;
  competitorName: string;
  priceChange: number;
  lastUpdated: Date;
}

export class GoogleAdsApiMock {
  /**
   * Fetches campaign performance data from Google Ads
   */
  async getCampaigns(startDate: Date, endDate: Date): Promise<GoogleCampaignData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return [
      {
        id: 'google_001',
        name: 'Saco Lino - Google Shopping',
        status: 'ENABLED',
        spend: 60000,
        revenue: 270000,
        impressions: 150000,
        clicks: 11700,
        conversionRate: 7.8,
        date: new Date(),
      },
      {
        id: 'google_002',
        name: 'Jean Mom - Search Ads',
        status: 'ENABLED',
        spend: 35000,
        revenue: 140000,
        impressions: 95000,
        clicks: 4750,
        conversionRate: 5.2,
        date: new Date(),
      },
      {
        id: 'google_003',
        name: 'Remera Básica - Display Network',
        status: 'ENABLED',
        spend: 20000,
        revenue: 72000,
        impressions: 180000,
        clicks: 3600,
        conversionRate: 3.1,
        date: new Date(),
      },
      {
        id: 'google_004',
        name: 'Zapatillas Urbanas - Shopping',
        status: 'ENABLED',
        spend: 42000,
        revenue: 168000,
        impressions: 120000,
        clicks: 6000,
        conversionRate: 4.5,
        date: new Date(),
      },
    ];
  }

  /**
   * Fetches competitor pricing data from Google Merchant Center
   */
  async getMerchantPricing(): Promise<GoogleMerchantData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150));

    return [
      {
        productId: 'prod_001',
        productName: 'Tapado Paño Gris',
        price: 89990,
        competitorPrice: 74990,
        competitorName: 'Kosiuko',
        priceChange: -25,
        lastUpdated: new Date(),
      },
      {
        productId: 'prod_002',
        productName: 'Jean Mom Celeste',
        price: 45990,
        competitorPrice: 42990,
        competitorName: 'Vitamina',
        priceChange: -10,
        lastUpdated: new Date(),
      },
    ];
  }
}
