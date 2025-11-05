import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealtimeCompetitorBidMonitorService } from './realtime-competitor-bid-monitor.service';
import { RealtimeCompetitorBidMonitorController } from './realtime-competitor-bid-monitor.controller';
import { RealtimeCompetitorBidMonitor } from './realtime-competitor-bid-monitor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RealtimeCompetitorBidMonitor])],
  providers: [RealtimeCompetitorBidMonitorService],
  controllers: [RealtimeCompetitorBidMonitorController],
  exports: [RealtimeCompetitorBidMonitorService],
})
export class RealtimeCompetitorBidMonitorModule {}
