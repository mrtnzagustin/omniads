import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicProductFeedOptimizerController } from './dynamic-product-feed-optimizer.controller';
import { DynamicProductFeedOptimizerService } from './dynamic-product-feed-optimizer.service';
import { ProductFeed } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([ProductFeed])],
  controllers: [DynamicProductFeedOptimizerController],
  providers: [DynamicProductFeedOptimizerService],
  exports: [DynamicProductFeedOptimizerService],
})
export class DynamicProductFeedOptimizerModule {}
