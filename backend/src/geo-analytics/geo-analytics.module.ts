import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoPerformance } from '../database/entities/geo-performance.entity';
import { GeoAnalyticsService } from './geo-analytics.service';
import { GeoAnalyticsController } from './geo-analytics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GeoPerformance])],
  controllers: [GeoAnalyticsController],
  providers: [GeoAnalyticsService],
  exports: [GeoAnalyticsService],
})
export class GeoAnalyticsModule {}
