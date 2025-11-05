import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartCampaignPauser } from '../database/entities/smart-campaign-pauser.entity';
import { SmartCampaignPauserService } from './smart-campaign-pauser.service';
import { SmartCampaignPauserController } from './smart-campaign-pauser.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SmartCampaignPauser])],
  controllers: [SmartCampaignPauserController],
  providers: [SmartCampaignPauserService],
  exports: [SmartCampaignPauserService],
})
export class SmartCampaignPauserModule {}
