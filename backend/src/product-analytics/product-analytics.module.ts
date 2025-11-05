import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPerformance } from '../database/entities/product-performance.entity';
import { ProductAnalyticsService } from './product-analytics.service';
import { ProductAnalyticsController } from './product-analytics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductPerformance])],
  controllers: [ProductAnalyticsController],
  providers: [ProductAnalyticsService],
  exports: [ProductAnalyticsService],
})
export class ProductAnalyticsModule {}
