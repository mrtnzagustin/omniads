import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, DollarSign, AlertTriangle, Lightbulb, Package } from 'lucide-react';

interface ActionItemCardProps {
  type: string;
  title: string;
  description: string;
  onArchive?: () => void;
}

const typeConfig = {
  PAUSE_CAMPAIGN: {
    icon: AlertCircle,
    color: 'destructive',
    label: 'Pause Campaign',
  },
  SCALE_CAMPAIGN: {
    icon: TrendingUp,
    color: 'default',
    label: 'Scale Campaign',
  },
  BUDGET_SHIFT: {
    icon: DollarSign,
    color: 'default',
    label: 'Budget Shift',
  },
  COMPETITOR_PRICE: {
    icon: AlertTriangle,
    color: 'secondary',
    label: 'Price Alert',
  },
  PROMOTE_ORGANIC: {
    icon: Lightbulb,
    color: 'default',
    label: 'Promote Product',
  },
  CREATE_BUNDLE: {
    icon: Package,
    color: 'default',
    label: 'Bundle Opportunity',
  },
};

export function ActionItemCard({ type, title, description, onArchive }: ActionItemCardProps) {
  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.PAUSE_CAMPAIGN;
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Badge variant={config.color as any} className="mb-2">
                {config.label}
              </Badge>
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onArchive}>
            Archive
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
