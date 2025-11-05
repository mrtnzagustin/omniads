import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhiteLabelDashboard } from '../database/entities/white-label-dashboard.entity';
import { WhiteLabelDashboardController } from './white-label-dashboard.controller';
import { WhiteLabelDashboardService } from './white-label-dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([WhiteLabelDashboard])],
  controllers: [WhiteLabelDashboardController],
  providers: [WhiteLabelDashboardService],
  exports: [WhiteLabelDashboardService],
})
export class WhiteLabelDashboardModule {}
