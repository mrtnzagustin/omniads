import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiSeasonalityPlanner } from '../database/entities/ai-seasonality-planner.entity';
import { AiSeasonalityPlannerService } from './ai-seasonality-planner.service';
import { AiSeasonalityPlannerController } from './ai-seasonality-planner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AiSeasonalityPlanner])],
  controllers: [AiSeasonalityPlannerController],
  providers: [AiSeasonalityPlannerService],
  exports: [AiSeasonalityPlannerService],
})
export class AiSeasonalityPlannerModule {}
