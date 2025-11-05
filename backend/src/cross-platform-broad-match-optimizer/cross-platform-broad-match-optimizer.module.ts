import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrossPlatformBroadMatchOptimizerService } from './cross-platform-broad-match-optimizer.service';
import { CrossPlatformBroadMatchOptimizerController } from './cross-platform-broad-match-optimizer.controller';
import { CrossPlatformBroadMatchOptimizer } from './cross-platform-broad-match-optimizer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CrossPlatformBroadMatchOptimizer])],
  providers: [CrossPlatformBroadMatchOptimizerService],
  controllers: [CrossPlatformBroadMatchOptimizerController],
  exports: [CrossPlatformBroadMatchOptimizerService],
})
export class CrossPlatformBroadMatchOptimizerModule {}
