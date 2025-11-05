import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIAnalysisController } from './ai-analysis.controller';
import { AIAnalysisService } from './ai-analysis.service';
import { AIAnalysis } from '../database/entities/ai-analysis.entity';
import { AIAnalysisOutcome } from '../database/entities/ai-analysis-outcome.entity';
import { AIAnalysisFeedback } from '../database/entities/ai-analysis-feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AIAnalysis,
      AIAnalysisOutcome,
      AIAnalysisFeedback,
    ]),
  ],
  controllers: [AIAnalysisController],
  providers: [AIAnalysisService],
  exports: [AIAnalysisService], // Export for use in other modules
})
export class AIAnalysisModule {}
