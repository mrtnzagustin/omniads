import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictiveLifetimeBudget } from '../database/entities/predictive-lifetime-budget.entity';
import { PredictiveLifetimeBudgetService } from './predictive-lifetime-budget.service';
import { PredictiveLifetimeBudgetController } from './predictive-lifetime-budget.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PredictiveLifetimeBudget])],
  controllers: [PredictiveLifetimeBudgetController],
  providers: [PredictiveLifetimeBudgetService],
  exports: [PredictiveLifetimeBudgetService],
})
export class PredictiveLifetimeBudgetModule {}
