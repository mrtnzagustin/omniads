import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetScenario } from '../database/entities/budget-scenario.entity';
import { BudgetScenariosService } from './budget-scenarios.service';
import { BudgetScenariosController } from './budget-scenarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BudgetScenario])],
  controllers: [BudgetScenariosController],
  providers: [BudgetScenariosService],
  exports: [BudgetScenariosService],
})
export class BudgetScenariosModule {}
