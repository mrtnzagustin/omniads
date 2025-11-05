import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartBudgetInsurancePoolService } from './smart-budget-insurance-pool.service';
import { SmartBudgetInsurancePoolController } from './smart-budget-insurance-pool.controller';
import { SmartBudgetInsurancePool } from './smart-budget-insurance-pool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmartBudgetInsurancePool])],
  providers: [SmartBudgetInsurancePoolService],
  controllers: [SmartBudgetInsurancePoolController],
  exports: [SmartBudgetInsurancePoolService],
})
export class SmartBudgetInsurancePoolModule {}
