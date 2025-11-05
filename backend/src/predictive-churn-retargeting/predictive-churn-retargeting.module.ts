import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictiveChurnRetargeting } from '../database/entities/predictive-churn-retargeting.entity';
import { PredictiveChurnRetargetingService } from './predictive-churn-retargeting.service';
import { PredictiveChurnRetargetingController } from './predictive-churn-retargeting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PredictiveChurnRetargeting])],
  controllers: [PredictiveChurnRetargetingController],
  providers: [PredictiveChurnRetargetingService],
  exports: [PredictiveChurnRetargetingService],
})
export class PredictiveChurnRetargetingModule {}
