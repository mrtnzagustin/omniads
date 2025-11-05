import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recommendation } from '../database/entities/recommendation.entity';
import { Product } from '../database/entities/product.entity';
import { RecommendationActivity } from '../database/entities/recommendation-activity.entity';
import { AutomationPlaybook } from '../database/entities/automation-playbook.entity';
import { Task } from '../database/entities/task.entity';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { RecommendationWorkflowService } from './recommendation-workflow.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recommendation,
      Product,
      RecommendationActivity,
      AutomationPlaybook,
      Task,
    ]),
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService, RecommendationWorkflowService],
  exports: [RecommendationsService, RecommendationWorkflowService],
})
export class RecommendationsModule {}
