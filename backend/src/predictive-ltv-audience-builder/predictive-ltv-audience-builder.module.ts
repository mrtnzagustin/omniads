import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictiveLtvAudienceBuilderController } from './predictive-ltv-audience-builder.controller';
import { PredictiveLtvAudienceBuilderService } from './predictive-ltv-audience-builder.service';
import { LTVModel } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([LTVModel])],
  controllers: [PredictiveLtvAudienceBuilderController],
  providers: [PredictiveLtvAudienceBuilderService],
  exports: [PredictiveLtvAudienceBuilderService],
})
export class PredictiveLtvAudienceBuilderModule {}
