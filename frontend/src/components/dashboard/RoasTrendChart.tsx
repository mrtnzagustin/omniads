import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface RoasTrendData {
  google: { date: string; roas: number }[];
  meta: { date: string; roas: number }[];
  tiktok: { date: string; roas: number }[];
}

interface RoasTrendChartProps {
  data: RoasTrendData;
}

export function RoasTrendChart({ data }: RoasTrendChartProps) {
  // Merge all platform data by date
  const mergedData = data.google.map((item, index) => ({
    date: item.date,
    Google: item.roas,
    Meta: data.meta[index]?.roas || 0,
    TikTok: data.tiktok[index]?.roas || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>ROAS Trends (30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleDateString('es-AR')}
              formatter={(value: number) => [`${value.toFixed(2)}x`, '']}
            />
            <Legend />
            <Line type="monotone" dataKey="Google" stroke="#4285f4" strokeWidth={2} />
            <Line type="monotone" dataKey="Meta" stroke="#1877f2" strokeWidth={2} />
            <Line type="monotone" dataKey="TikTok" stroke="#000000" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
