import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContextualMomentTargeting } from '../database/entities/contextual-moment-targeting.entity';
import { ContextualMomentTargetingService } from './contextual-moment-targeting.service';
import { ContextualMomentTargetingController } from './contextual-moment-targeting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContextualMomentTargeting])],
  controllers: [ContextualMomentTargetingController],
  providers: [ContextualMomentTargetingService],
  exports: [ContextualMomentTargetingService],
})
export class ContextualMomentTargetingModule {}
