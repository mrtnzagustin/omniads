import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import apiClient from '@/lib/apiClient';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { Lightbulb, Package } from 'lucide-react';

export function Opportunities() {
  const [organicOpportunities, setOrganicOpportunities] = useState<any[]>([]);
  const [bundleOpportunities, setBundleOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const [organicRes, bundleRes] = await Promise.all([
          apiClient.get('/api/v1/opportunities/organic'),
          apiClient.get('/api/v1/opportunities/bundles'),
        ]);

        setOrganicOpportunities(organicRes.data);
        setBundleOpportunities(bundleRes.data);
      } catch (error) {
        console.error('Failed to fetch opportunities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-lg">Loading opportunities...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Opportunities</h1>
          <p className="text-muted-foreground">
            Discover high-potential products and bundle opportunities
          </p>
        </div>

        {/* Organic Product Opportunities */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">High-Converting Organic Products</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {organicOpportunities.map((opp) => (
              <Card key={opp.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{opp.name}</CardTitle>
                  <CardDescription>
                    {formatCurrency(opp.price)} • {formatPercentage(opp.conversionRate)} conversion rate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{opp.recommendation}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">Estimated ROAS: {opp.estimatedRoas.toFixed(1)}x</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bundle Opportunities */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Bundle Opportunities</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {bundleOpportunities.map((bundle, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {bundle.product1} + {bundle.product2}
                  </CardTitle>
                  <CardDescription>
                    {bundle.coOccurrenceRate}% of customers buy these together
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Individual Prices:</span>
                      <span className="font-medium">
                        {formatCurrency(bundle.product1Price + bundle.product2Price)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Suggested Bundle:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(bundle.suggestedBundlePrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount:</span>
                      <span className="font-medium">{bundle.suggestedDiscount}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">{bundle.recommendation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
