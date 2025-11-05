import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreativeFatigueMetric } from '../database/entities/creative-fatigue-metric.entity';
import { CreativeFatigueService } from './creative-fatigue.service';
import { CreativeFatigueController } from './creative-fatigue.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CreativeFatigueMetric])],
  controllers: [CreativeFatigueController],
  providers: [CreativeFatigueService],
  exports: [CreativeFatigueService],
})
export class CreativeFatigueModule {}
