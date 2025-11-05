import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoAsset } from '../database/entities/video-asset.entity';
import { VideoAssetService } from './video-assets.service';
import { VideoAssetController } from './video-assets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VideoAsset])],
  providers: [VideoAssetService],
  controllers: [VideoAssetController],
  exports: [VideoAssetService],
})
export class VideoAssetModule {}
