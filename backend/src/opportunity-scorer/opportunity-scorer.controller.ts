import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OpportunityScorerService } from './opportunity-scorer.service';

@Controller('api/v1/opportunity-scorer')
@UseGuards(JwtAuthGuard)
export class OpportunityScorerController {
  constructor(
    private readonly opportunityScorerService: OpportunityScorerService,
  ) {}

  /**
   * Score a single campaign
   */
  @Post('campaigns/:campaignId/score')
  @HttpCode(HttpStatus.OK)
  async scoreCampaign(@Param('campaignId') campaignId: string) {
    const result = await this.opportunityScorerService.scoreCampaign(campaignId);
    return {
      success: true,
      data: result,
    };
  }

  /**
   * Get campaign score
   */
  @Get('campaigns/:campaignId/score')
  async getCampaignScore(@Param('campaignId') campaignId: string) {
    const score = await this.opportunityScorerService.getScore(campaignId);

    if (!score) {
      return {
        success: false,
        message: 'Score not found. Run scoring first.',
      };
    }

    return {
      success: true,
      data: score,
    };
  }

  /**
   * Score all campaigns for a platform
   */
  @Post('platforms/:platform/score')
  @HttpCode(HttpStatus.OK)
  async scorePlatform(@Param('platform') platform: string) {
    const results =
      await this.opportunityScorerService.scorePlatformCampaigns(platform);

    return {
      success: true,
      data: {
        scoredCount: results.length,
        results,
      },
    };
  }

  /**
   * Get platform aggregate score
   */
  @Get('platforms/:platform/aggregate')
  async getPlatformAggregate(@Param('platform') platform: string) {
    const aggregate =
      await this.opportunityScorerService.getPlatformAggregate(platform);

    if (!aggregate) {
      return {
        success: false,
        message: 'Aggregate not found. Run platform scoring first.',
      };
    }

    return {
      success: true,
      data: aggregate,
    };
  }

  /**
   * Get all scores (leaderboard)
   */
  @Get('leaderboard')
  async getLeaderboard() {
    const scores = await this.opportunityScorerService.getAllScores();

    return {
      success: true,
      data: scores,
    };
  }
}
