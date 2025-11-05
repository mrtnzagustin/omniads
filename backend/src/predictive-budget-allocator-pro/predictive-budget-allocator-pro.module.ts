import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictiveBudgetAllocatorProController } from './predictive-budget-allocator-pro.controller';
import { PredictiveBudgetAllocatorProService } from './predictive-budget-allocator-pro.service';
import { BudgetForecast } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([BudgetForecast])],
  controllers: [PredictiveBudgetAllocatorProController],
  providers: [PredictiveBudgetAllocatorProService],
  exports: [PredictiveBudgetAllocatorProService],
})
export class PredictiveBudgetAllocatorProModule {}
