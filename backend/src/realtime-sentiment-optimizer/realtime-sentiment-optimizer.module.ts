import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealtimeSentimentOptimizer } from '../database/entities/realtime-sentiment-optimizer.entity';
import { RealtimeSentimentOptimizerService } from './realtime-sentiment-optimizer.service';
import { RealtimeSentimentOptimizerController } from './realtime-sentiment-optimizer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RealtimeSentimentOptimizer])],
  controllers: [RealtimeSentimentOptimizerController],
  providers: [RealtimeSentimentOptimizerService],
  exports: [RealtimeSentimentOptimizerService],
})
export class RealtimeSentimentOptimizerModule {}
