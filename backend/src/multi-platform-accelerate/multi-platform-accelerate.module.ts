import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultiPlatformAccelerateController } from './multi-platform-accelerate.controller';
import { MultiPlatformAccelerateService } from './multi-platform-accelerate.service';
import { AccelerateCampaign } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([AccelerateCampaign])],
  controllers: [MultiPlatformAccelerateController],
  providers: [MultiPlatformAccelerateService],
  exports: [MultiPlatformAccelerateService],
})
export class MultiPlatformAccelerateModule {}
