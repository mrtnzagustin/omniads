import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AIAnalysisService, SearchAnalysesDto, SubmitFeedbackDto } from './ai-analysis.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/ai-analyses')
@UseGuards(JwtAuthGuard)
export class AIAnalysisController {
  constructor(private readonly analysisService: AIAnalysisService) {}

  /**
   * GET /api/v1/ai-analyses
   * List all AI analyses for the workspace with pagination
   */
  @Get()
  async listAnalyses(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const workspaceId = req.user.userId; // Using userId as workspaceId for MVP
    const limitNum = limit ? parseInt(limit) : 50;
    const offsetNum = offset ? parseInt(offset) : 0;

    return await this.analysisService.listAnalyses(workspaceId, limitNum, offsetNum);
  }

  /**
   * GET /api/v1/ai-analyses/:id
   * Get a specific analysis by ID
   */
  @Get(':id')
  async getAnalysis(@Param('id') id: string, @Request() req) {
    const workspaceId = req.user.userId;
    return await this.analysisService.getAnalysisById(id, workspaceId);
  }

  /**
   * POST /api/v1/ai-analyses/search
   * Search analyses with filters
   */
  @Post('search')
  @HttpCode(HttpStatus.OK)
  async searchAnalyses(@Request() req, @Body() body: Partial<SearchAnalysesDto>) {
    const workspaceId = req.user.userId;

    const searchDto: SearchAnalysesDto = {
      workspaceId,
      query: body.query,
      analysisType: body.analysisType,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      limit: body.limit || 50,
      offset: body.offset || 0,
    };

    return await this.analysisService.searchAnalyses(searchDto);
  }

  /**
   * GET /api/v1/ai-analyses/:id/outcome
   * Get outcome tracking for a specific analysis
   */
  @Get(':id/outcome')
  async getOutcome(@Param('id') id: string, @Request() req) {
    const workspaceId = req.user.userId;
    // Verify analysis belongs to workspace
    await this.analysisService.getAnalysisById(id, workspaceId);

    return await this.analysisService.getAnalysisOutcome(id);
  }

  /**
   * POST /api/v1/ai-analyses/:id/feedback
   * Submit user feedback on an analysis
   */
  @Post(':id/feedback')
  async submitFeedback(
    @Param('id') id: string,
    @Request() req,
    @Body() body: Omit<SubmitFeedbackDto, 'analysisId' | 'userId'>,
  ) {
    const feedbackDto: SubmitFeedbackDto = {
      analysisId: id,
      userId: req.user.userId,
      rating: body.rating,
      helpful: body.helpful,
      comment: body.comment,
      feedbackType: body.feedbackType,
    };

    return await this.analysisService.submitFeedback(feedbackDto);
  }

  /**
   * GET /api/v1/ai-analyses/accuracy
   * Get AI accuracy dashboard statistics
   */
  @Get('stats/accuracy')
  async getAccuracyStats(@Request() req) {
    const workspaceId = req.user.userId;
    return await this.analysisService.getAccuracyStats(workspaceId);
  }

  /**
   * GET /api/v1/ai-analyses/export
   * Export analysis history
   */
  @Get('export/json')
  async exportAnalyses(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const workspaceId = req.user.userId;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const analyses = await this.analysisService.exportAnalyses(workspaceId, start, end);

    return {
      exportedAt: new Date(),
      workspaceId,
      count: analyses.length,
      analyses,
    };
  }
}
