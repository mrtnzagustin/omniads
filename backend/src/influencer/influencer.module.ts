import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfluencerProfile } from '../database/entities/influencer-profile.entity';
import { InfluencerProfileService } from './influencer.service';
import { InfluencerProfileController } from './influencer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InfluencerProfile])],
  providers: [InfluencerProfileService],
  controllers: [InfluencerProfileController],
  exports: [InfluencerProfileService],
})
export class InfluencerProfileModule {}
