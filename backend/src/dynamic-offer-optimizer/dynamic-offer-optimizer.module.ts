import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicOfferOptimizer } from '../database/entities/dynamic-offer-optimizer.entity';
import { DynamicOfferOptimizerService } from './dynamic-offer-optimizer.service';
import { DynamicOfferOptimizerController } from './dynamic-offer-optimizer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DynamicOfferOptimizer])],
  controllers: [DynamicOfferOptimizerController],
  providers: [DynamicOfferOptimizerService],
  exports: [DynamicOfferOptimizerService],
})
export class DynamicOfferOptimizerModule {}
