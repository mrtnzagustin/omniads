import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EconomicTrendAnalysisService } from './economic-trend-analysis.service';
import { EconomicTrendAnalysisController } from './economic-trend-analysis.controller';
import { EconomicTrendAnalysisEntity } from '../database/entities/economic-trend-analysis-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EconomicTrendAnalysisEntity])],
  providers: [EconomicTrendAnalysisService],
  controllers: [EconomicTrendAnalysisController],
  exports: [EconomicTrendAnalysisService],
})
export class EconomicTrendAnalysisModule {}
