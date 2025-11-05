import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrossCampaignSynthesizer } from '../database/entities/cross-campaign-synthesizer.entity';
import { CrossCampaignSynthesizerService } from './cross-campaign-synthesizer.service';
import { CrossCampaignSynthesizerController } from './cross-campaign-synthesizer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CrossCampaignSynthesizer])],
  controllers: [CrossCampaignSynthesizerController],
  providers: [CrossCampaignSynthesizerService],
  exports: [CrossCampaignSynthesizerService],
})
export class CrossCampaignSynthesizerModule {}
