import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { apiClient } from '../lib/apiClient';

export function WhatsAppCenter() {
  const [subscription, setSubscription] = useState<any>(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userId = 'current-user-id';
      const [subRes, convRes] = await Promise.all([
        apiClient.get(`/whatsapp/subscription/${userId}`).catch(() => ({ data: null })),
        apiClient.get(`/whatsapp/conversation/${userId}`).catch(() => ({ data: [] })),
      ]);
      setSubscription(subRes.data);
      setConversations(convRes.data);
    } catch (error) {
      console.error('Error fetching WhatsApp data:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async () => {
    try {
      await apiClient.post('/whatsapp/subscribe', {
        userId: 'current-user-id',
        phoneNumber,
      });
      fetchData();
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  const unsubscribe = async () => {
    try {
      await apiClient.post('/whatsapp/unsubscribe', {
        userId: 'current-user-id',
      });
      fetchData();
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  };

  const sendTestDigest = async () => {
    try {
      await apiClient.post('/whatsapp/digest/send', {
        userId: 'current-user-id',
        digestData: {
          kpis: {
            spend: 1250,
            revenue: 5000,
            roas: 4.0,
          },
          alerts: [{ title: 'Test alert' }],
          recommendations: [{ title: 'Test recommendation' }],
        },
      });
      alert('Test digest sent!');
    } catch (error) {
      console.error('Error sending digest:', error);
    }
  };

  if (loading) {
    return <Layout><div className="p-8">Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">WhatsApp Command Center</h1>
          <p className="text-gray-600">
            Receive actionable insights and control your campaigns via WhatsApp
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
            {subscription?.optedIn ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                  <span className="text-sm">{subscription.phoneNumber}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={sendTestDigest}>
                    Send Test Digest
                  </Button>
                  <Button size="sm" variant="outline" onClick={unsubscribe}>
                    Unsubscribe
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Subscribe to receive daily digests and quick action buttons via WhatsApp
                </p>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="+1234567890"
                    className="border rounded px-3 py-2"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <Button onClick={subscribe}>Subscribe</Button>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
            <div className="space-y-3">
              {conversations.length === 0 ? (
                <p className="text-gray-500">No messages yet</p>
              ) : (
                conversations.map((conv: any) => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-lg ${
                      conv.direction === 'OUTBOUND'
                        ? 'bg-blue-50 ml-auto'
                        : 'bg-gray-50'
                    }`}
                    style={{ maxWidth: '80%' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{conv.direction}</Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(conv.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{conv.messageText}</p>
                    {conv.aiResponse && (
                      <div className="mt-2 pt-2 border-t text-sm text-gray-600">
                        <strong>AI Response:</strong> {conv.aiResponse}
                      </div>
                    )}
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
