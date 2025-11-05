import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, MoreThan, In } from 'typeorm';
import { AIAnalysis } from '../database/entities/ai-analysis.entity';
import { AIAnalysisOutcome } from '../database/entities/ai-analysis-outcome.entity';
import { AIAnalysisFeedback } from '../database/entities/ai-analysis-feedback.entity';

export interface CreateAnalysisDto {
  workspaceId: string;
  analysisType: 'RECOMMENDATION' | 'SUMMARY' | 'INSIGHT';
  provider: string;
  model: string;
  prompt: string;
  response: string;
  inputSnapshot: any;
  tokensUsed?: number;
  latencyMs: number;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  errorMessage?: string;
}

export interface SearchAnalysesDto {
  workspaceId: string;
  query?: string;
  analysisType?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface SubmitFeedbackDto {
  analysisId: string;
  userId: string;
  rating?: number;
  helpful?: boolean;
  comment?: string;
  feedbackType?: 'ACCURACY' | 'RELEVANCE' | 'CLARITY';
}

@Injectable()
export class AIAnalysisService {
  constructor(
    @InjectRepository(AIAnalysis)
    private analysisRepository: Repository<AIAnalysis>,
    @InjectRepository(AIAnalysisOutcome)
    private outcomeRepository: Repository<AIAnalysisOutcome>,
    @InjectRepository(AIAnalysisFeedback)
    private feedbackRepository: Repository<AIAnalysisFeedback>,
  ) {}

  /**
   * Save a new AI analysis to the database
   */
  async saveAnalysis(dto: CreateAnalysisDto): Promise<AIAnalysis> {
    const analysis = this.analysisRepository.create({
      ...dto,
      createdAt: new Date(),
      // Set expiration based on retention policy (default: 2 years)
      expiresAt: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000),
    });

    return await this.analysisRepository.save(analysis);
  }

  /**
   * List all analyses for a workspace with pagination
   */
  async listAnalyses(
    workspaceId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<{ analyses: AIAnalysis[]; total: number }> {
    const [analyses, total] = await this.analysisRepository.findAndCount({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return { analyses, total };
  }

  /**
   * Get a specific analysis by ID
   */
  async getAnalysisById(id: string, workspaceId: string): Promise<AIAnalysis> {
    const analysis = await this.analysisRepository.findOne({
      where: { id, workspaceId },
    });

    if (!analysis) {
      throw new NotFoundException(`Analysis with ID ${id} not found`);
    }

    return analysis;
  }

  /**
   * Search analyses with filters
   */
  async searchAnalyses(dto: SearchAnalysesDto): Promise<{ analyses: AIAnalysis[]; total: number }> {
    const queryBuilder = this.analysisRepository.createQueryBuilder('analysis');

    queryBuilder.where('analysis.workspaceId = :workspaceId', {
      workspaceId: dto.workspaceId,
    });

    // Full-text search on prompt and response
    if (dto.query) {
      queryBuilder.andWhere(
        '(analysis.prompt ILIKE :query OR analysis.response ILIKE :query)',
        { query: `%${dto.query}%` },
      );
    }

    // Filter by analysis type
    if (dto.analysisType) {
      queryBuilder.andWhere('analysis.analysisType = :analysisType', {
        analysisType: dto.analysisType,
      });
    }

    // Filter by date range
    if (dto.startDate && dto.endDate) {
      queryBuilder.andWhere('analysis.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dto.startDate,
        endDate: dto.endDate,
      });
    }

    // Pagination
    queryBuilder
      .orderBy('analysis.createdAt', 'DESC')
      .take(dto.limit || 50)
      .skip(dto.offset || 0);

    const [analyses, total] = await queryBuilder.getManyAndCount();

    return { analyses, total };
  }

  /**
   * Get outcome for a specific analysis
   */
  async getAnalysisOutcome(analysisId: string): Promise<AIAnalysisOutcome | null> {
    return await this.outcomeRepository.findOne({
      where: { analysisId },
      relations: ['recommendation'],
    });
  }

  /**
   * Save analysis outcome (for tracking predictions vs actuals)
   */
  async saveOutcome(outcome: Partial<AIAnalysisOutcome>): Promise<AIAnalysisOutcome> {
    const newOutcome = this.outcomeRepository.create(outcome);
    return await this.outcomeRepository.save(newOutcome);
  }

  /**
   * Submit user feedback on an analysis
   */
  async submitFeedback(dto: SubmitFeedbackDto): Promise<AIAnalysisFeedback> {
    // Verify analysis exists and belongs to workspace
    const analysis = await this.analysisRepository.findOne({
      where: { id: dto.analysisId },
    });

    if (!analysis) {
      throw new NotFoundException(`Analysis with ID ${dto.analysisId} not found`);
    }

    const feedback = this.feedbackRepository.create({
      analysisId: dto.analysisId,
      userId: dto.userId,
      rating: dto.rating,
      helpful: dto.helpful,
      comment: dto.comment,
      feedbackType: dto.feedbackType,
    });

    return await this.feedbackRepository.save(feedback);
  }

  /**
   * Get AI accuracy statistics for a workspace
   */
  async getAccuracyStats(workspaceId: string): Promise<any> {
    // Get all analyses with outcomes
    const analyses = await this.analysisRepository.find({
      where: { workspaceId, status: 'SUCCESS' },
    });

    const analysisIds = analyses.map((a) => a.id);

    const outcomes = analysisIds.length > 0
      ? await this.outcomeRepository.find({
          where: {
            analysisId: In(analysisIds),
          },
        })
      : [];

    // Calculate statistics
    const totalAnalyses = analyses.length;
    const analysesWithOutcomes = outcomes.length;
    const avgAccuracyScore =
      outcomes.reduce((sum, o) => sum + (o.accuracyScore || 0), 0) / outcomes.length || 0;

    // Calculate acceptance rate (analyses that led to recommendations)
    const acceptedCount = outcomes.filter((o) => o.recommendationId).length;
    const acceptanceRate = analysesWithOutcomes > 0 ? (acceptedCount / analysesWithOutcomes) * 100 : 0;

    return {
      totalAnalyses,
      analysesWithOutcomes,
      avgAccuracyScore: Math.round(avgAccuracyScore * 100) / 100,
      acceptanceRate: Math.round(acceptanceRate * 100) / 100,
      byType: await this.getStatsByType(workspaceId),
    };
  }

  /**
   * Get statistics broken down by analysis type
   */
  private async getStatsByType(workspaceId: string): Promise<any> {
    const result = await this.analysisRepository
      .createQueryBuilder('analysis')
      .select('analysis.analysisType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('analysis.workspaceId = :workspaceId', { workspaceId })
      .groupBy('analysis.analysisType')
      .getRawMany();

    return result.reduce((acc, row) => {
      acc[row.type] = parseInt(row.count);
      return acc;
    }, {});
  }

  /**
   * Get recent analyses for AI context (last 30 days, limited to 10)
   */
  async getRecentForContext(
    workspaceId: string,
    limit: number = 10,
  ): Promise<AIAnalysis[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return await this.analysisRepository.find({
      where: {
        workspaceId,
        status: 'SUCCESS',
        createdAt: MoreThan(thirtyDaysAgo),
      },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Export analysis history as JSON
   */
  async exportAnalyses(
    workspaceId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<AIAnalysis[]> {
    const where: any = { workspaceId };

    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }

    return await this.analysisRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }
}

