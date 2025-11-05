import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectedTVCampaignService } from './connected-tv-campaign.service';
import { ConnectedTVCampaignController } from './connected-tv-campaign.controller';
import { ConnectedTVCampaignEntity } from '../database/entities/connected-tv-campaign-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectedTVCampaignEntity])],
  providers: [ConnectedTVCampaignService],
  controllers: [ConnectedTVCampaignController],
  exports: [ConnectedTVCampaignService],
})
export class ConnectedTVCampaignModule {}
