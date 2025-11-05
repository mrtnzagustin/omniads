import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { apiClient } from '../lib/apiClient';

export function WorkflowDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, tasksRes] = await Promise.all([
        apiClient.get('/api/v1/workflow/analytics'),
        apiClient.get('/api/v1/workflow/tasks'),
      ]);
      setAnalytics(analyticsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching workflow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      await apiClient.put(`/api/v1/workflow/tasks/${taskId}`, { status });
      fetchData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return <Layout><div className="p-8">Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Recommendation Workflow</h1>
          <p className="text-gray-600">
            Manage recommendation lifecycle and automation
          </p>
        </div>

        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <p className="text-sm text-gray-600">Total Recommendations</p>
              <p className="text-3xl font-bold">{analytics.total}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-3xl font-bold">{analytics.inProgress}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold">
                {analytics.completionRate.toFixed(1)}%
              </p>
            </Card>
          </div>
        )}

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Active Tasks</h2>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-gray-500">No active tasks</p>
            ) : (
              tasks.map((task: any) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge>{task.type}</Badge>
                        <Badge variant="outline">{task.status}</Badge>
                      </div>
                      <h3 className="font-semibold">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600">{task.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {task.status === 'TODO' && (
                        <Button
                          size="sm"
                          onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
                        >
                          Start
                        </Button>
                      )}
                      {task.status === 'IN_PROGRESS' && (
                        <Button
                          size="sm"
                          onClick={() => updateTaskStatus(task.id, 'DONE')}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
