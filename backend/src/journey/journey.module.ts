import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JourneyConfig } from '../database/entities/journey-config.entity';
import { JourneyConfigService } from './journey.service';
import { JourneyConfigController } from './journey.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JourneyConfig])],
  providers: [JourneyConfigService],
  controllers: [JourneyConfigController],
  exports: [JourneyConfigService],
})
export class JourneyConfigModule {}
