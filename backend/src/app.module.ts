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
    // New Feature Modules
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
