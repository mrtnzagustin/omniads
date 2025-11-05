import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContextualTargetingConfig } from '../database/entities/contextual-targeting-config.entity';
import { ContextualTargetingConfigService } from './contextual-targeting.service';
import { ContextualTargetingConfigController } from './contextual-targeting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContextualTargetingConfig])],
  providers: [ContextualTargetingConfigService],
  controllers: [ContextualTargetingConfigController],
  exports: [ContextualTargetingConfigService],
})
export class ContextualTargetingConfigModule {}
