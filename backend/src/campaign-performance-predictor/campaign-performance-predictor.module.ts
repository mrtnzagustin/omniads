import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignPerformancePredictorController } from './campaign-performance-predictor.controller';
import { CampaignPerformancePredictorService } from './campaign-performance-predictor.service';
import { CampaignPrediction } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignPrediction])],
  controllers: [CampaignPerformancePredictorController],
  providers: [CampaignPerformancePredictorService],
  exports: [CampaignPerformancePredictorService],
})
export class CampaignPerformancePredictorModule {}
