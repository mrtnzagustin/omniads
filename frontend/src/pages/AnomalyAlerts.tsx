import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { apiClient } from '../lib/apiClient';

export function AnomalyAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('OPEN');

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const fetchAlerts = async () => {
    try {
      const res = await apiClient.get(`/anomaly-alerts/alerts?status=${filter}`);
      setAlerts(res.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (id: string) => {
    try {
      await apiClient.post(`/anomaly-alerts/alerts/${id}/acknowledge`, {
        userId: 'current-user-id',
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const resolveAlert = async (id: string) => {
    try {
      await apiClient.post(`/anomaly-alerts/alerts/${id}/resolve`, {
        userId: 'current-user-id',
        resolutionSummary: 'Resolved via UI',
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'P1': return 'bg-red-100 text-red-800';
      case 'P2': return 'bg-orange-100 text-orange-800';
      case 'P3': return 'bg-yellow-100 text-yellow-800';
      case 'P4': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <Layout><div className="p-8">Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Performance Anomaly Alerts</h1>
          <p className="text-gray-600">Monitor and respond to performance anomalies</p>
        </div>

        <div className="flex gap-2">
          {['OPEN', 'ACKNOWLEDGED', 'RESOLVED'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {alerts.length === 0 ? (
            <Card className="p-6">
              <p className="text-gray-500">No alerts found</p>
            </Card>
          ) : (
            alerts.map((alert: any) => (
              <Card key={alert.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge>{alert.platform}</Badge>
                        <Badge variant="outline">{alert.metric}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold">{alert.title}</h3>
                      <p className="text-gray-700">{alert.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Deviation</p>
                      <p className="text-2xl font-bold text-red-600">
                        {alert.deviationPercentage}%
                      </p>
                    </div>
                  </div>

                  {alert.rootCauseInsights && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold">AI Insights:</p>
                      <p className="text-sm">{alert.rootCauseInsights}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {alert.status === 'OPEN' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          Resolve
                        </Button>
                      </>
                    )}
                    {alert.status === 'ACKNOWLEDGED' && (
                      <Button
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
