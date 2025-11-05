import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnomalyBaseline } from '../database/entities/anomaly-baseline.entity';
import { AnomalyAlert } from '../database/entities/anomaly-alert.entity';
import { AlertRoutingRule } from '../database/entities/alert-routing-rule.entity';
import { AlertNotificationLog } from '../database/entities/alert-notification-log.entity';
import { Campaign } from '../database/entities/campaign.entity';
import { AnomalyAlertsService } from './anomaly-alerts.service';
import { AnomalyAlertsController } from './anomaly-alerts.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnomalyBaseline,
      AnomalyAlert,
      AlertRoutingRule,
      AlertNotificationLog,
      Campaign,
    ]),
  ],
  controllers: [AnomalyAlertsController],
  providers: [AnomalyAlertsService],
  exports: [AnomalyAlertsService],
})
export class AnomalyAlertsModule {}
