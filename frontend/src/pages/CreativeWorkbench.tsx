import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { apiClient } from '../lib/apiClient';

export function CreativeWorkbench() {
  const [creatives, setCreatives] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [creativesRes, collectionsRes] = await Promise.all([
        apiClient.get('/creative-workbench/creatives'),
        apiClient.get('/creative-workbench/collections'),
      ]);
      setCreatives(creativesRes.data);
      setCollections(collectionsRes.data);
    } catch (error) {
      console.error('Error fetching creative data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Layout><div className="p-8">Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Creative Intelligence Workbench</h1>
          <p className="text-gray-600">
            Analyze and compare creative performance across platforms
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Creative Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {creatives.length === 0 ? (
                <p className="col-span-full text-gray-500">No creatives found</p>
              ) : (
                creatives.slice(0, 12).map((creative: any) => (
                  <div key={creative.id} className="border rounded-lg overflow-hidden">
                    {creative.thumbnailUrl && (
                      <div className="aspect-video bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Preview</span>
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge>{creative.platform}</Badge>
                        <Badge variant="outline">{creative.assetType}</Badge>
                      </div>
                      {creative.headline && (
                        <p className="font-semibold text-sm">{creative.headline}</p>
                      )}
                      {creative.metricsSnapshot && (
                        <div className="text-sm text-gray-600">
                          <p>ROAS: {creative.metricsSnapshot.roas || 'N/A'}</p>
                          <p>Fatigue: {creative.fatigueScore}/100</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Experiment Collections</h2>
            <div className="space-y-3">
              {collections.length === 0 ? (
                <p className="text-gray-500">No collections yet</p>
              ) : (
                collections.map((collection: any) => (
                  <div key={collection.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{collection.name}</h3>
                    {collection.hypothesis && (
                      <p className="text-sm text-gray-600 mt-1">{collection.hypothesis}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline">{collection.status}</Badge>
                      {collection.goalMetric && (
                        <span className="text-sm">Goal: {collection.goalMetric}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
