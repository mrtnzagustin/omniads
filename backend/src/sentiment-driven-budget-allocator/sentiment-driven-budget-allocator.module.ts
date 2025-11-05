import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentimentDrivenBudgetAllocatorService } from './sentiment-driven-budget-allocator.service';
import { SentimentDrivenBudgetAllocatorController } from './sentiment-driven-budget-allocator.controller';
import { SentimentDrivenBudgetAllocator } from './sentiment-driven-budget-allocator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SentimentDrivenBudgetAllocator])],
  providers: [SentimentDrivenBudgetAllocatorService],
  controllers: [SentimentDrivenBudgetAllocatorController],
  exports: [SentimentDrivenBudgetAllocatorService],
})
export class SentimentDrivenBudgetAllocatorModule {}
