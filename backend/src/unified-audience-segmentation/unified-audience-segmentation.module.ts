import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnifiedAudienceSegmentationController } from './unified-audience-segmentation.controller';
import { UnifiedAudienceSegmentationService } from './unified-audience-segmentation.service';
import { UnifiedAudience } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([UnifiedAudience])],
  controllers: [UnifiedAudienceSegmentationController],
  providers: [UnifiedAudienceSegmentationService],
  exports: [UnifiedAudienceSegmentationService],
})
export class UnifiedAudienceSegmentationModule {}
