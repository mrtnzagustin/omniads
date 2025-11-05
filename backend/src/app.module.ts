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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
