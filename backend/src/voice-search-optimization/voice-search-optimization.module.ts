import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoiceSearchOptimizationService } from './voice-search-optimization.service';
import { VoiceSearchOptimizationController } from './voice-search-optimization.controller';
import { VoiceSearchOptimizationEntity } from '../database/entities/voice-search-optimization-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VoiceSearchOptimizationEntity])],
  providers: [VoiceSearchOptimizationService],
  controllers: [VoiceSearchOptimizationController],
  exports: [VoiceSearchOptimizationService],
})
export class VoiceSearchOptimizationModule {}
