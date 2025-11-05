import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfitAnalyticsDashboard } from '../database/entities/profit-analytics-dashboard.entity';
import { ProfitAnalyticsDashboardController } from './profit-analytics-dashboard.controller';
import { ProfitAnalyticsDashboardService } from './profit-analytics-dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfitAnalyticsDashboard])],
  controllers: [ProfitAnalyticsDashboardController],
  providers: [ProfitAnalyticsDashboardService],
  exports: [ProfitAnalyticsDashboardService],
})
export class ProfitAnalyticsDashboardModule {}
