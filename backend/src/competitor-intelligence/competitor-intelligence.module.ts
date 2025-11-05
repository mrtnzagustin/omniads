import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competitor } from '../database/entities/competitor.entity';
import { CompetitorAd } from '../database/entities/competitor-ad.entity';
import { CompetitorSpendEstimate } from '../database/entities/competitor-spend-estimate.entity';
import { CompetitorAlert } from '../database/entities/competitor-alert.entity';
import { CompetitorIntelligenceService } from './competitor-intelligence.service';
import {
  CompetitorsController,
  CompetitorAdsController,
  CompetitorAlertsController,
} from './competitor-intelligence.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Competitor,
      CompetitorAd,
      CompetitorSpendEstimate,
      CompetitorAlert,
    ]),
  ],
  controllers: [
    CompetitorsController,
    CompetitorAdsController,
    CompetitorAlertsController,
  ],
  providers: [CompetitorIntelligenceService],
  exports: [CompetitorIntelligenceService],
})
export class CompetitorIntelligenceModule {}
