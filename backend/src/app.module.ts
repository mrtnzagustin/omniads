import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { ServicesModule } from './services/services.module';
import { BudgetRebalancerModule } from './budget-rebalancer/budget-rebalancer.module';
import { AnomalyAlertsModule } from './anomaly-alerts/anomaly-alerts.module';
import { CreativeWorkbenchModule } from './creative-workbench/creative-workbench.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { AIAnalysisModule } from './ai-analysis/ai-analysis.module';
// New Feature Modules (027-046)
import { AIAgentModule } from './ai-agents/ai-agents.module';
import { AutopilotConfigModule } from './autopilot/autopilot.module';
import { IntentModelModule } from './intent/intent.module';
import { DataCollectionFormModule } from './zero-party-data/zero-party-data.module';
import { ContextualTargetingConfigModule } from './contextual-targeting/contextual-targeting.module';
import { DataEnrichmentConfigModule } from './data-enrichment/data-enrichment.module';
import { JourneyConfigModule } from './journey/journey.module';
import { FrequencyConfigModule } from './frequency/frequency.module';
import { SequentialMessageConfigModule } from './sequential-messaging/sequential-messaging.module';
import { VideoAssetModule } from './video-assets/video-assets.module';
import { LandingPageTemplateModule } from './landing-pages/landing-pages.module';
import { ARVRExperienceModule } from './ar-vr/ar-vr.module';
import { RecommendationModelModule } from './product-recommendations/product-recommendations.module';
import { LookalikeModelModule } from './lookalike-audiences/lookalike-audiences.module';
import { PersonalizationRuleModule } from './personalization/personalization.module';
import { IncrementalityTestModule } from './incrementality/incrementality.module';
import { MMMModelModule } from './mmm/mmm.module';
import { SentimentMonitorModule } from './sentiment/sentiment.module';
import { WhatsAppSessionModule } from './whatsapp-commerce/whatsapp-commerce.module';
import { InfluencerProfileModule } from './influencer/influencer.module';
import { ScheduledJobsModule } from './scheduled-jobs/scheduled-jobs.module';
import { AttributionModule } from './attribution/attribution.module';
// Specs 010-026 Modules
import { ForecastingModule } from './forecasting/forecasting.module';
import { CompetitorIntelligenceModule } from './competitor-intelligence/competitor-intelligence.module';
import { KeywordIntelligenceModule } from './keyword-intelligence/keyword-intelligence.module';
import { DisplayAdTrackerModule } from './display-ad-tracker/display-ad-tracker.module';
import { CreativeTestingModule } from './creative-testing/creative-testing.module';
import { AdCopyGeneratorModule } from './ad-copy-generator/ad-copy-generator.module';
import { CreativeFatigueModule } from './creative-fatigue/creative-fatigue.module';
import { CampaignBenchmarkingModule } from './campaign-benchmarking/campaign-benchmarking.module';
import { ExportEngineModule } from './export-engine/export-engine.module';
import { GeoAnalyticsModule } from './geo-analytics/geo-analytics.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { ApprovalWorkflowsModule } from './approval-workflows/approval-workflows.module';
import { AlertRulesModule } from './alert-rules/alert-rules.module';
import { ProductAnalyticsModule } from './product-analytics/product-analytics.module';
import { LTVAnalysisModule } from './ltv-analysis/ltv-analysis.module';
import { BudgetScenariosModule } from './budget-scenarios/budget-scenarios.module';
// Features 048-067
import { AIAgenticCampaignModule } from './ai-agentic-campaign/ai-agentic-campaign.module';
import { RealTimeBidOptimizationModule } from './real-time-bid-optimization/real-time-bid-optimization.module';
import { AIVideoCreativeStudioModule } from './ai-video-creative-studio/ai-video-creative-studio.module';
import { PrivacyFirstAnalyticsModule } from './privacy-first-analytics/privacy-first-analytics.module';
import { CrossDeviceJourneyModule } from './cross-device-journey/cross-device-journey.module';
import { AdFraudProtectionModule } from './ad-fraud-protection/ad-fraud-protection.module';
import { DeepLearningAudienceModule } from './deep-learning-audience/deep-learning-audience.module';
import { VoiceSearchOptimizationModule } from './voice-search-optimization/voice-search-optimization.module';
import { StreamingPodcastAdModule } from './streaming-podcast/streaming-podcast.module';
import { RetailMediaNetworkModule } from './retail-media-network/retail-media-network.module';
import { ConnectedTVCampaignModule } from './connected-tv-campaign/connected-tv-campaign.module';
import { SustainabilityCarbonModule } from './sustainability-carbon/sustainability-carbon.module';
import { BlockchainAdVerificationModule } from './blockchain-ad-verification/blockchain-ad-verification.module';
import { CreatorInfluencerCRMModule } from './creator-influencer-crm/creator-influencer-crm.module';
import { Web3MetaverseModule } from './web3-metaverse/web3-metaverse.module';
import { AICustomerServiceModule } from './ai-customer-service/ai-customer-service.module';
import { GamificationLoyaltyModule } from './gamification-loyalty/gamification-loyalty.module';
import { SocialListeningModule } from './social-listening/social-listening.module';
import { EconomicTrendAnalysisModule } from './economic-trend-analysis/economic-trend-analysis.module';
import { SubscriptionRetentionModule } from './subscription-retention/subscription-retention.module';
// Features 068-087
import { OpportunityScorerModule } from './opportunity-scorer/opportunity-scorer.module';
import { AICreativeTestingArenaModule } from './ai-creative-testing-arena/ai-creative-testing-arena.module';
import { SentimentDrivenBudgetAllocatorModule } from './sentiment-driven-budget-allocator/sentiment-driven-budget-allocator.module';
import { CompetitiveAdIntelligenceClonerModule } from './competitive-ad-intelligence-cloner/competitive-ad-intelligence-cloner.module';
import { ROASGuaranteeEngineModule } from './roas-guarantee-engine/roas-guarantee-engine.module';
import { InfluencerPerformancePredictorModule } from './influencer-performance-predictor/influencer-performance-predictor.module';
import { DynamicLandingPageGeneratorModule } from './dynamic-landing-page-generator/dynamic-landing-page-generator.module';
import { SmartCreativeAutoRefreshModule } from './smart-creative-auto-refresh/smart-creative-auto-refresh.module';
import { VoiceSearchAdOptimizerModule } from './voice-search-ad-optimizer/voice-search-ad-optimizer.module';
import { RetailMediaNetworkHubModule } from './retail-media-network-hub/retail-media-network-hub.module';
import { AICopywriterMultivariateModule } from './ai-copywriter-multivariate/ai-copywriter-multivariate.module';
import { CrossPlatformSymphonyIntegrationModule } from './cross-platform-symphony-integration/cross-platform-symphony-integration.module';
import { SmartBudgetInsurancePoolModule } from './smart-budget-insurance-pool/smart-budget-insurance-pool.module';
import { RealtimeCompetitorBidMonitorModule } from './realtime-competitor-bid-monitor/realtime-competitor-bid-monitor.module';
import { UnifiedSocialInboxModule } from './unified-social-inbox/unified-social-inbox.module';
import { AIMaxCampaignReplicatorModule } from './ai-max-campaign-replicator/ai-max-campaign-replicator.module';
import { CustomerLifecycleJourneyMapperModule } from './customer-lifecycle-journey-mapper/customer-lifecycle-journey-mapper.module';
import { CrossPlatformBroadMatchOptimizerModule } from './cross-platform-broad-match-optimizer/cross-platform-broad-match-optimizer.module';
import { SustainabilityAdImpactScorerModule } from './sustainability-ad-impact-scorer/sustainability-ad-impact-scorer.module';
import { FirstPartyDataEnrichmentHubModule } from './first-party-data-enrichment-hub/first-party-data-enrichment-hub.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    DashboardModule,
    RecommendationsModule,
    ServicesModule,
    BudgetRebalancerModule,
    AnomalyAlertsModule,
    CreativeWorkbenchModule,
    WhatsAppModule,
    AIAnalysisModule,
    // New Feature Modules (027-046)
    AIAgentModule,
    AutopilotConfigModule,
    IntentModelModule,
    DataCollectionFormModule,
    ContextualTargetingConfigModule,
    DataEnrichmentConfigModule,
    JourneyConfigModule,
    FrequencyConfigModule,
    SequentialMessageConfigModule,
    VideoAssetModule,
    LandingPageTemplateModule,
    ARVRExperienceModule,
    RecommendationModelModule,
    LookalikeModelModule,
    PersonalizationRuleModule,
    IncrementalityTestModule,
    MMMModelModule,
    SentimentMonitorModule,
    WhatsAppSessionModule,
    InfluencerProfileModule,
    ScheduledJobsModule,
    AttributionModule,
    // Specs 010-026 Modules
    ForecastingModule,
    CompetitorIntelligenceModule,
    KeywordIntelligenceModule,
    DisplayAdTrackerModule,
    CreativeTestingModule,
    AdCopyGeneratorModule,
    CreativeFatigueModule,
    CampaignBenchmarkingModule,
    ExportEngineModule,
    GeoAnalyticsModule,
    CollaborationModule,
    ApprovalWorkflowsModule,
    AlertRulesModule,
    ProductAnalyticsModule,
    LTVAnalysisModule,
    BudgetScenariosModule,
    // Features 048-067
    AIAgenticCampaignModule,
    RealTimeBidOptimizationModule,
    AIVideoCreativeStudioModule,
    PrivacyFirstAnalyticsModule,
    CrossDeviceJourneyModule,
    AdFraudProtectionModule,
    DeepLearningAudienceModule,
    VoiceSearchOptimizationModule,
    StreamingPodcastAdModule,
    RetailMediaNetworkModule,
    ConnectedTVCampaignModule,
    SustainabilityCarbonModule,
    BlockchainAdVerificationModule,
    CreatorInfluencerCRMModule,
    Web3MetaverseModule,
    AICustomerServiceModule,
    GamificationLoyaltyModule,
    SocialListeningModule,
    EconomicTrendAnalysisModule,
    SubscriptionRetentionModule,
    // Features 068-087
    OpportunityScorerModule,
    AICreativeTestingArenaModule,
    SentimentDrivenBudgetAllocatorModule,
    CompetitiveAdIntelligenceClonerModule,
    ROASGuaranteeEngineModule,
    InfluencerPerformancePredictorModule,
    DynamicLandingPageGeneratorModule,
    SmartCreativeAutoRefreshModule,
    VoiceSearchAdOptimizerModule,
    RetailMediaNetworkHubModule,
    AICopywriterMultivariateModule,
    CrossPlatformSymphonyIntegrationModule,
    SmartBudgetInsurancePoolModule,
    RealtimeCompetitorBidMonitorModule,
    UnifiedSocialInboxModule,
    AIMaxCampaignReplicatorModule,
    CustomerLifecycleJourneyMapperModule,
    CrossPlatformBroadMatchOptimizerModule,
    SustainabilityAdImpactScorerModule,
    FirstPartyDataEnrichmentHubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
