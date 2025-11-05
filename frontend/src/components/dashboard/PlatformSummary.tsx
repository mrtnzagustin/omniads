import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';

interface PlatformData {
  platform: string;
  investment: number;
  revenue: number;
  roas: number;
  campaignCount: number;
}

interface PlatformSummaryProps {
  data: PlatformData[];
}

const platformNames = {
  google: 'Google Ads',
  meta: 'Meta Ads',
  tiktok: 'TikTok Ads',
};

export function PlatformSummary({ data }: PlatformSummaryProps) {
  const maxRoas = Math.max(...data.map((p) => p.roas), 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Performance Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((platform) => (
          <div key={platform.platform} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium">
                {platformNames[platform.platform as keyof typeof platformNames]}
              </div>
              <div className="text-sm text-muted-foreground">
                {platform.campaignCount} campaigns
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground">Investment</div>
                <div className="font-semibold">{formatCurrency(platform.investment)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Revenue</div>
                <div className="font-semibold">{formatCurrency(platform.revenue)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">ROAS</div>
                <div
                  className={`font-bold ${
                    platform.roas >= 3
                      ? 'text-green-600'
                      : platform.roas >= 1
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {platform.roas.toFixed(2)}x
                </div>
              </div>
            </div>

            <Progress value={(platform.roas / maxRoas) * 100} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
