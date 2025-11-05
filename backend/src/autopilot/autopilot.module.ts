import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutopilotConfig } from '../database/entities/autopilot-config.entity';
import { AutopilotConfigService } from './autopilot.service';
import { AutopilotConfigController } from './autopilot.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AutopilotConfig])],
  providers: [AutopilotConfigService],
  controllers: [AutopilotConfigController],
  exports: [AutopilotConfigService],
})
export class AutopilotConfigModule {}
