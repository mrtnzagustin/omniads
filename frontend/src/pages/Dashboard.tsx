import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { RoasTrendChart } from '@/components/dashboard/RoasTrendChart';
import { CampaignTable } from '@/components/dashboard/CampaignTable';
import { PlatformSummary } from '@/components/dashboard/PlatformSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Target } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { formatCurrency } from '@/lib/utils';

export function Dashboard() {
  const [kpis, setKpis] = useState<any>(null);
  const [roasTrends, setRoasTrends] = useState<any>(null);
  const [platformSummary, setPlatformSummary] = useState<any>([]);
  const [topCampaigns, setTopCampaigns] = useState<any>([]);
  const [bottomCampaigns, setBottomCampaigns] = useState<any>([]);
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [kpisRes, trendsRes, platformRes, topRes, bottomRes, insightRes] = await Promise.all([
          apiClient.get('/api/v1/dashboard/kpis?period=7d'),
          apiClient.get('/api/v1/dashboard/roas-trends?period=30d'),
          apiClient.get('/api/v1/dashboard/platform-summary?period=7d'),
          apiClient.get('/api/v1/dashboard/campaigns/top?period=7d'),
          apiClient.get('/api/v1/dashboard/campaigns/bottom?period=7d'),
          apiClient.get('/api/v1/dashboard/insight'),
        ]);

        setKpis(kpisRes.data);
        setRoasTrends(trendsRes.data);
        setPlatformSummary(platformRes.data);
        setTopCampaigns(topRes.data);
        setBottomCampaigns(bottomRes.data);
        setInsight(insightRes.data.insight);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            AI-Powered insights across all your advertising platforms
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard
            title="Total Investment"
            value={formatCurrency(kpis?.totalInvestment || 0)}
            icon={DollarSign}
            description="Last 7 days"
          />
          <KpiCard
            title="Total Revenue"
            value={formatCurrency(kpis?.totalRevenue || 0)}
            icon={TrendingUp}
            description="Last 7 days"
          />
          <KpiCard
            title="Average ROAS"
            value={`${kpis?.avgRoas || 0}x`}
            icon={Target}
            description="Last 7 days"
          />
        </div>

        {/* AI Insight */}
        {insight && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">AI Global Insight</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{insight}</p>
            </CardContent>
          </Card>
        )}

        {/* ROAS Trend Chart */}
        {roasTrends && <RoasTrendChart data={roasTrends} />}

        {/* Platform Summary & Top/Bottom Campaigns */}
        <div className="grid gap-6 md:grid-cols-2">
          <PlatformSummary data={platformSummary} />
          <div className="space-y-6">
            <CampaignTable title="Top 5 Campaigns" campaigns={topCampaigns.slice(0, 5)} />
          </div>
        </div>

        {/* Bottom Campaigns */}
        <CampaignTable title="Bottom 5 Campaigns (Needs Review)" campaigns={bottomCampaigns.slice(0, 5)} />
      </div>
    </Layout>
  );
}
