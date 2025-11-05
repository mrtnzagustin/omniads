import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetPacingController } from '../database/entities/budget-pacing-controller.entity';
import { BudgetPacingControllerController } from './budget-pacing-controller.controller';
import { BudgetPacingControllerService } from './budget-pacing-controller.service';

@Module({
  imports: [TypeOrmModule.forFeature([BudgetPacingController])],
  controllers: [BudgetPacingControllerController],
  providers: [BudgetPacingControllerService],
  exports: [BudgetPacingControllerService],
})
export class BudgetPacingControllerModule {}
