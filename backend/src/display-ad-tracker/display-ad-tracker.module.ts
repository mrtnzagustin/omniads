import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisplayAd } from '../database/entities/display-ad.entity';
import { DisplayAdTrackerService } from './display-ad-tracker.service';
import { DisplayAdTrackerController } from './display-ad-tracker.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DisplayAd])],
  controllers: [DisplayAdTrackerController],
  providers: [DisplayAdTrackerService],
  exports: [DisplayAdTrackerService],
})
export class DisplayAdTrackerModule {}
