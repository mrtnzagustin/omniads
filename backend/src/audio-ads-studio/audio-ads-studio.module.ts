import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioAdsStudioController } from './audio-ads-studio.controller';
import { AudioAdsStudioService } from './audio-ads-studio.service';
import { AudioAd } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([AudioAd])],
  controllers: [AudioAdsStudioController],
  providers: [AudioAdsStudioService],
  exports: [AudioAdsStudioService],
})
export class AudioAdsStudioModule {}
