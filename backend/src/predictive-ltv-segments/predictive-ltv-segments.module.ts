import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictiveLtvSegments } from '../database/entities/predictive-ltv-segments.entity';
import { PredictiveLtvSegmentsController } from './predictive-ltv-segments.controller';
import { PredictiveLtvSegmentsService } from './predictive-ltv-segments.service';

@Module({
  imports: [TypeOrmModule.forFeature([PredictiveLtvSegments])],
  controllers: [PredictiveLtvSegmentsController],
  providers: [PredictiveLtvSegmentsService],
  exports: [PredictiveLtvSegmentsService],
})
export class PredictiveLtvSegmentsModule {}
