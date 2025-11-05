import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrossDeviceAttribution } from '../database/entities/cross-device-attribution.entity';
import { CrossDeviceAttributionController } from './cross-device-attribution.controller';
import { CrossDeviceAttributionService } from './cross-device-attribution.service';

@Module({
  imports: [TypeOrmModule.forFeature([CrossDeviceAttribution])],
  controllers: [CrossDeviceAttributionController],
  providers: [CrossDeviceAttributionService],
  exports: [CrossDeviceAttributionService],
})
export class CrossDeviceAttributionModule {}
