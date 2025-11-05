import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerSideTracking } from '../database/entities/server-side-tracking.entity';
import { ServerSideTrackingController } from './server-side-tracking.controller';
import { ServerSideTrackingService } from './server-side-tracking.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServerSideTracking])],
  controllers: [ServerSideTrackingController],
  providers: [ServerSideTrackingService],
  exports: [ServerSideTrackingService],
})
export class ServerSideTrackingModule {}
