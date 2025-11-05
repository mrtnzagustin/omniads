import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ActionItemCard } from '@/components/dashboard/ActionItemCard';
import apiClient from '@/lib/apiClient';

interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await apiClient.get('/api/v1/recommendations/action-items');
      setRecommendations(response.data);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await apiClient.post(`/api/v1/recommendations/${id}/archive`);
      setRecommendations(recommendations.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Failed to archive recommendation:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-lg">Loading recommendations...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Action Items</h1>
          <p className="text-muted-foreground">
            AI-generated recommendations to optimize your advertising performance
          </p>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No new action items. All campaigns are performing well!
          </div>
        ) : (
          <div className="grid gap-4">
            {recommendations.map((rec) => (
              <ActionItemCard
                key={rec.id}
                type={rec.type}
                title={rec.title}
                description={rec.description}
                onArchive={() => handleArchive(rec.id)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
