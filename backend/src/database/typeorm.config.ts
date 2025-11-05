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
// Features 027-046: New Features
import { AIAgent } from './entities/ai_agent.entity';
import { AutopilotConfig } from './entities/autopilot_config.entity';
import { IntentModel } from './entities/intent_model.entity';
import { DataCollectionForm } from './entities/data_collection_form.entity';
import { ContextualTargetingConfig } from './entities/contextual_targeting_config.entity';
import { DataEnrichmentConfig } from './entities/data_enrichment_config.entity';
import { JourneyConfig } from './entities/journey_config.entity';
import { FrequencyConfig } from './entities/frequency_config.entity';
import { SequentialMessageConfig } from './entities/sequential_message_config.entity';
import { VideoAsset } from './entities/video_asset.entity';
import { LandingPageTemplate } from './entities/landing_page_template.entity';
import { ARVRExperience } from './entities/ar_vr_experience.entity';
import { RecommendationModel } from './entities/recommendation_model.entity';
import { LookalikeModel } from './entities/lookalike_model.entity';
import { PersonalizationRule } from './entities/personalization_rule.entity';
import { IncrementalityTest } from './entities/incrementality_test.entity';
import { MMMModel } from './entities/mmm_model.entity';
import { SentimentMonitor } from './entities/sentiment_monitor.entity';
import { WhatsAppSession } from './entities/whats_app_session.entity';
import { InfluencerProfile } from './entities/influencer_profile.entity';
// Features 048-067
import { AIAgent as AIAgentEntity } from './entities/ai-agent.entity';
import { AgentDecision } from './entities/agent-decision.entity';
import { AgentOutcome } from './entities/agent-outcome.entity';
import { RealTimeBidOptimizationEntity } from './entities/real-time-bid-optimization-main.entity';
import { AIVideoCreativeStudioEntity } from './entities/ai-video-creative-studio-main.entity';
import { PrivacyFirstAnalyticsEntity } from './entities/privacy-first-analytics-main.entity';
import { CrossDeviceJourneyEntity } from './entities/cross-device-journey-main.entity';
import { AdFraudProtectionEntity } from './entities/ad-fraud-protection-main.entity';
import { DeepLearningAudienceEntity } from './entities/deep-learning-audience-main.entity';
import { VoiceSearchOptimizationEntity } from './entities/voice-search-optimization-main.entity';
import { StreamingPodcastAdEntity } from './entities/streaming-podcast-main.entity';
import { RetailMediaNetworkEntity } from './entities/retail-media-network-main.entity';
import { ConnectedTVCampaignEntity } from './entities/connected-tv-campaign-main.entity';
import { SustainabilityCarbonEntity } from './entities/sustainability-carbon-main.entity';
import { BlockchainAdVerificationEntity } from './entities/blockchain-ad-verification-main.entity';
import { CreatorInfluencerCRMEntity } from './entities/creator-influencer-crm-main.entity';
import { Web3MetaverseEntity } from './entities/web3-metaverse-main.entity';
import { AICustomerServiceEntity } from './entities/ai-customer-service-main.entity';
import { GamificationLoyaltyEntity } from './entities/gamification-loyalty-main.entity';
import { SocialListeningEntity } from './entities/social-listening-main.entity';
import { EconomicTrendAnalysisEntity } from './entities/economic-trend-analysis-main.entity';
import { SubscriptionRetentionEntity } from './entities/subscription-retention-main.entity';

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
    // Features 027-046
    AIAgent,
    AutopilotConfig,
    IntentModel,
    DataCollectionForm,
    ContextualTargetingConfig,
    DataEnrichmentConfig,
    JourneyConfig,
    FrequencyConfig,
    SequentialMessageConfig,
    VideoAsset,
    LandingPageTemplate,
    ARVRExperience,
    RecommendationModel,
    LookalikeModel,
    PersonalizationRule,
    IncrementalityTest,
    MMMModel,
    SentimentMonitor,
    WhatsAppSession,
    InfluencerProfile,
    // Features 048-067
    AIAgentEntity,
    AgentDecision,
    AgentOutcome,
    RealTimeBidOptimizationEntity,
    AIVideoCreativeStudioEntity,
    PrivacyFirstAnalyticsEntity,
    CrossDeviceJourneyEntity,
    AdFraudProtectionEntity,
    DeepLearningAudienceEntity,
    VoiceSearchOptimizationEntity,
    StreamingPodcastAdEntity,
    RetailMediaNetworkEntity,
    ConnectedTVCampaignEntity,
    SustainabilityCarbonEntity,
    BlockchainAdVerificationEntity,
    CreatorInfluencerCRMEntity,
    Web3MetaverseEntity,
    AICustomerServiceEntity,
    GamificationLoyaltyEntity,
    SocialListeningEntity,
    EconomicTrendAnalysisEntity,
    SubscriptionRetentionEntity,
  ],
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync in dev only
  logging: process.env.NODE_ENV === 'development',
  migrations: ['dist/database/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
