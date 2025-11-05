import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HyperPersonalizationEngineController } from './hyper-personalization-engine.controller';
import { HyperPersonalizationEngineService } from './hyper-personalization-engine.service';
import { PersonalizationTemplate } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalizationTemplate])],
  controllers: [HyperPersonalizationEngineController],
  providers: [HyperPersonalizationEngineService],
  exports: [HyperPersonalizationEngineService],
})
export class HyperPersonalizationEngineModule {}
