import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetRecommendation } from '../database/entities/budget-recommendation.entity';
import { BudgetAdjustment } from '../database/entities/budget-adjustment.entity';
import { AutomationRule } from '../database/entities/automation-rule.entity';
import { Campaign } from '../database/entities/campaign.entity';
import { BudgetRebalancerService } from './budget-rebalancer.service';
import { BudgetRebalancerController } from './budget-rebalancer.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BudgetRecommendation,
      BudgetAdjustment,
      AutomationRule,
      Campaign,
    ]),
  ],
  controllers: [BudgetRebalancerController],
  providers: [BudgetRebalancerService],
  exports: [BudgetRebalancerService],
})
export class BudgetRebalancerModule {}
