import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from './entities/user.entity';
import { Campaign } from './entities/campaign.entity';
import { Product } from './entities/product.entity';
import { Sale } from './entities/sale.entity';
import { Recommendation } from './entities/recommendation.entity';
// Feature 001: AI Budget Rebalancer
import { BudgetRecommendation } from './entities/budget-recommendation.entity';
import { BudgetAdjustment } from './entities/budget-adjustment.entity';
import { AutomationRule } from './entities/automation-rule.entity';
// Feature 002: Performance Anomaly Alerts
import { AnomalyBaseline } from './entities/anomaly-baseline.entity';
import { AnomalyAlert } from './entities/anomaly-alert.entity';
import { AlertRoutingRule } from './entities/alert-routing-rule.entity';
import { AlertNotificationLog } from './entities/alert-notification-log.entity';
// Feature 003: Creative Intelligence Workbench
import { CreativeAsset } from './entities/creative-asset.entity';
import { CreativeMetricSnapshot } from './entities/creative-metric-snapshot.entity';
import { CreativeCollection } from './entities/creative-collection.entity';
import { CreativeCollectionItem } from './entities/creative-collection-item.entity';
// Feature 004: Recommendation Workflow Automation
import { RecommendationActivity } from './entities/recommendation-activity.entity';
import { AutomationPlaybook } from './entities/automation-playbook.entity';
import { Task } from './entities/task.entity';
// Feature 005: WhatsApp Command Center
import { WhatsAppSubscription } from './entities/whatsapp-subscription.entity';
import { WhatsAppDigest } from './entities/whatsapp-digest.entity';
import { WhatsAppActionToken } from './entities/whatsapp-action-token.entity';
import { WhatsAppConversationLog } from './entities/whatsapp-conversation-log.entity';
// Feature 006: Unmock AI Integration
import { AIRequestLog } from './entities/ai-request-log.entity';
import { RecommendationCache } from './entities/recommendation-cache.entity';
// Feature 007: AI Analysis History
import { AIAnalysis } from './entities/ai-analysis.entity';
import { AIAnalysisOutcome } from './entities/ai-analysis-outcome.entity';
import { AIAnalysisFeedback } from './entities/ai-analysis-feedback.entity';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'omniads',
  password: process.env.DB_PASSWORD || 'omniads_password',
  database: process.env.DB_DATABASE || 'omniads',
  entities: [
    User,
    Campaign,
    Product,
    Sale,
    Recommendation,
    // Feature 001
    BudgetRecommendation,
    BudgetAdjustment,
    AutomationRule,
    // Feature 002
    AnomalyBaseline,
    AnomalyAlert,
    AlertRoutingRule,
    AlertNotificationLog,
    // Feature 003
    CreativeAsset,
    CreativeMetricSnapshot,
    CreativeCollection,
    CreativeCollectionItem,
    // Feature 004
    RecommendationActivity,
    AutomationPlaybook,
    Task,
    // Feature 005
    WhatsAppSubscription,
    WhatsAppDigest,
    WhatsAppActionToken,
    WhatsAppConversationLog,
    // Feature 006
    AIRequestLog,
    RecommendationCache,
    // Feature 007
    AIAnalysis,
    AIAnalysisOutcome,
    AIAnalysisFeedback,
  ],
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync in dev only
  logging: process.env.NODE_ENV === 'development',
  migrations: ['dist/database/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
