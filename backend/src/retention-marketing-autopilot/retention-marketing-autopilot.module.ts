import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetentionMarketingAutopilotController } from './retention-marketing-autopilot.controller';
import { RetentionMarketingAutopilotService } from './retention-marketing-autopilot.service';
import { ChurnPrediction } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([ChurnPrediction])],
  controllers: [RetentionMarketingAutopilotController],
  providers: [RetentionMarketingAutopilotService],
  exports: [RetentionMarketingAutopilotService],
})
export class RetentionMarketingAutopilotModule {}
