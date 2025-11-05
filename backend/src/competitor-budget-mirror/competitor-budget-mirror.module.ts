import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitorBudgetMirror } from '../database/entities/competitor-budget-mirror.entity';
import { CompetitorBudgetMirrorService } from './competitor-budget-mirror.service';
import { CompetitorBudgetMirrorController } from './competitor-budget-mirror.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompetitorBudgetMirror])],
  controllers: [CompetitorBudgetMirrorController],
  providers: [CompetitorBudgetMirrorService],
  exports: [CompetitorBudgetMirrorService],
})
export class CompetitorBudgetMirrorModule {}
