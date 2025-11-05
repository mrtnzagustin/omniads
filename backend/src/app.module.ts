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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
