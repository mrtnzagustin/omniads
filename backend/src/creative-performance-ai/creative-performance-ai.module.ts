import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreativePerformanceAi } from '../database/entities/creative-performance-ai.entity';
import { CreativePerformanceAiController } from './creative-performance-ai.controller';
import { CreativePerformanceAiService } from './creative-performance-ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([CreativePerformanceAi])],
  controllers: [CreativePerformanceAiController],
  providers: [CreativePerformanceAiService],
  exports: [CreativePerformanceAiService],
})
export class CreativePerformanceAiModule {}
