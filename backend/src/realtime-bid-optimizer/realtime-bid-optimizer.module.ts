import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealtimeBidOptimizer } from '../database/entities/realtime-bid-optimizer.entity';
import { RealtimeBidOptimizerController } from './realtime-bid-optimizer.controller';
import { RealtimeBidOptimizerService } from './realtime-bid-optimizer.service';

@Module({
  imports: [TypeOrmModule.forFeature([RealtimeBidOptimizer])],
  controllers: [RealtimeBidOptimizerController],
  providers: [RealtimeBidOptimizerService],
  exports: [RealtimeBidOptimizerService],
})
export class RealtimeBidOptimizerModule {}
