import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  investment: number;
  revenue: number;
  roas: number;
}

interface CampaignTableProps {
  title: string;
  campaigns: Campaign[];
}

const platformColors = {
  google: 'bg-blue-100 text-blue-800',
  meta: 'bg-indigo-100 text-indigo-800',
  tiktok: 'bg-gray-100 text-gray-800',
};

export function CampaignTable({ title, campaigns }: CampaignTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead className="text-right">Investment</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">ROAS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={platformColors[campaign.platform as keyof typeof platformColors]}
                  >
                    {campaign.platform}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(campaign.investment)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(campaign.revenue)}
                </TableCell>
                <TableCell className="text-right font-bold">
                  <span
                    className={
                      campaign.roas >= 3
                        ? 'text-green-600'
                        : campaign.roas >= 1
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }
                  >
                    {campaign.roas.toFixed(2)}x
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
