import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrossPlatformCreativeSyncer } from '../database/entities/cross-platform-creative-syncer.entity';
import { CrossPlatformCreativeSyncerService } from './cross-platform-creative-syncer.service';
import { CrossPlatformCreativeSyncerController } from './cross-platform-creative-syncer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CrossPlatformCreativeSyncer])],
  controllers: [CrossPlatformCreativeSyncerController],
  providers: [CrossPlatformCreativeSyncerService],
  exports: [CrossPlatformCreativeSyncerService],
})
export class CrossPlatformCreativeSyncerModule {}
