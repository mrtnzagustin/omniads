import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfluencerPerformancePredictorService } from './influencer-performance-predictor.service';
import { InfluencerPerformancePredictorController } from './influencer-performance-predictor.controller';
import { InfluencerPerformancePredictor } from './influencer-performance-predictor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InfluencerPerformancePredictor])],
  providers: [InfluencerPerformancePredictorService],
  controllers: [InfluencerPerformancePredictorController],
  exports: [InfluencerPerformancePredictorService],
})
export class InfluencerPerformancePredictorModule {}
