import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrossDeviceJourneyService } from './cross-device-journey.service';
import { CrossDeviceJourneyController } from './cross-device-journey.controller';
import { CrossDeviceJourneyEntity } from '../database/entities/cross-device-journey-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CrossDeviceJourneyEntity])],
  providers: [CrossDeviceJourneyService],
  controllers: [CrossDeviceJourneyController],
  exports: [CrossDeviceJourneyService],
})
export class CrossDeviceJourneyModule {}
