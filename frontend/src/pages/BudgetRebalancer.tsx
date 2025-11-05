import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { apiClient } from '../lib/apiClient';

export function BudgetRebalancer() {
  const [recommendations, setRecommendations] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recsRes, adjsRes] = await Promise.all([
        apiClient.get('/budget-rebalancer/recommendations'),
        apiClient.get('/budget-rebalancer/adjustments'),
      ]);
      setRecommendations(recsRes.data);
      setAdjustments(adjsRes.data);
    } catch (error) {
      console.error('Error fetching budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveRecommendation = async (id: string) => {
    try {
      await apiClient.post(`/budget-rebalancer/recommendations/${id}/approve`, {
        userId: 'current-user-id',
      });
      fetchData();
    } catch (error) {
      console.error('Error approving recommendation:', error);
    }
  };

  const rejectRecommendation = async (id: string) => {
    try {
      await apiClient.post(`/budget-rebalancer/recommendations/${id}/reject`);
      fetchData();
    } catch (error) {
      console.error('Error rejecting recommendation:', error);
    }
  };

  if (loading) {
    return <Layout><div className="p-8">Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Budget Rebalancer</h1>
          <p className="text-gray-600">Review and approve budget reallocation recommendations</p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Pending Recommendations</h2>
            <div className="space-y-4">
              {recommendations.length === 0 ? (
                <p className="text-gray-500">No pending recommendations</p>
              ) : (
                recommendations.map((rec: any) => (
                  <div key={rec.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge>{rec.platform}</Badge>
                          <Badge variant="outline">
                            {rec.status}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">{rec.rationale}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          ${Math.abs(rec.suggestedDelta)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {rec.suggestedDelta > 0 ? 'Increase' : 'Decrease'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveRecommendation(rec.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectRecommendation(rec.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Adjustments</h2>
            <div className="space-y-2">
              {adjustments.slice(0, 10).map((adj: any) => (
                <div key={adj.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <Badge>{adj.status}</Badge>
                    <span className="ml-2 text-sm">
                      {adj.autoApproved ? 'Auto-approved' : 'Manual approval'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${adj.actualDelta}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(adj.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
