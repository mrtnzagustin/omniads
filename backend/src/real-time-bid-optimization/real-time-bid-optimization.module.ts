import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealTimeBidOptimizationService } from './real-time-bid-optimization.service';
import { RealTimeBidOptimizationController } from './real-time-bid-optimization.controller';
import { RealTimeBidOptimizationEntity } from '../database/entities/real-time-bid-optimization-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RealTimeBidOptimizationEntity])],
  providers: [RealTimeBidOptimizationService],
  controllers: [RealTimeBidOptimizationController],
  exports: [RealTimeBidOptimizationService],
})
export class RealTimeBidOptimizationModule {}
