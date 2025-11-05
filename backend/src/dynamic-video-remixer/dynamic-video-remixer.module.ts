import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicVideoRemixerController } from './dynamic-video-remixer.controller';
import { DynamicVideoRemixerService } from './dynamic-video-remixer.service';
import { VideoAsset089 } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([VideoAsset089])],
  controllers: [DynamicVideoRemixerController],
  providers: [DynamicVideoRemixerService],
  exports: [DynamicVideoRemixerService],
})
export class DynamicVideoRemixerModule {}
