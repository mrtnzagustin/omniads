import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreativeTest } from '../database/entities/creative-test.entity';
import { CreativeTestVariant } from '../database/entities/creative-test-variant.entity';

@Injectable()
export class CreativeTestingService {
  private readonly logger = new Logger(CreativeTestingService.name);

  constructor(
    @InjectRepository(CreativeTest)
    private testRepository: Repository<CreativeTest>,
    @InjectRepository(CreativeTestVariant)
    private variantRepository: Repository<CreativeTestVariant>,
  ) {}

  async createTest(dto: any): Promise<CreativeTest> {
    const test = this.testRepository.create({
      ...dto,
      status: 'PENDING',
    });

    const saved = await this.testRepository.save(test);

    // Create variants
    const variantCount = dto.variantCount || 3;
    const allocationPerVariant = 100 / variantCount;

    for (let i = 0; i < variantCount; i++) {
      await this.variantRepository.save({
        testId: saved.id,
        name: `Variant ${i + 1}`,
        currentAllocation: allocationPerVariant,
        status: 'ACTIVE',
      });
    }

    return saved;
  }

  async startTest(testId: string): Promise<CreativeTest> {
    await this.testRepository.update(testId, {
      status: 'RUNNING',
      startedAt: new Date(),
    });
    return this.testRepository.findOne({ where: { id: testId } });
  }

  async updateVariantPerformance(variantId: string, metrics: any): Promise<void> {
    const variant = await this.variantRepository.findOne({ where: { id: variantId } });

    variant.impressions += metrics.impressions || 0;
    variant.clicks += metrics.clicks || 0;
    variant.conversions += metrics.conversions || 0;
    variant.cost = Number(variant.cost) + (metrics.cost || 0);
    variant.revenue = Number(variant.revenue) + (metrics.revenue || 0);
    variant.ctr = variant.clicks / variant.impressions;
    variant.roas = Number(variant.revenue) / Number(variant.cost);

    await this.variantRepository.save(variant);

    // Update allocations using Bayesian bandit logic
    await this.updateBudgetAllocations(variant.testId);
  }

  private async updateBudgetAllocations(testId: string): Promise<void> {
    const variants = await this.variantRepository.find({
      where: { testId, status: 'ACTIVE' }
    });

    // Simplified Bayesian bandit - allocate more to better performers
    const scores = variants.map(v => ({
      id: v.id,
      score: this.calculateBayesianScore(v),
    }));

    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);

    for (const score of scores) {
      const allocation = (score.score / totalScore) * 100;
      await this.variantRepository.update(score.id, {
        currentAllocation: allocation,
        confidenceScore: Math.min(95, allocation),
      });
    }

    // Check for winner
    await this.checkForWinner(testId, variants);
  }

  private calculateBayesianScore(variant: CreativeTestVariant): number {
    if (variant.impressions < 100) return 1; // Minimum exploration

    const ctr = variant.ctr || 0;
    const conversions = variant.conversions || 0;

    // Simple Thompson sampling approximation
    return ctr * 100 + conversions * 0.1 + Math.random() * 0.1;
  }

  private async checkForWinner(testId: string, variants: CreativeTestVariant[]): Promise<void> {
    const sorted = variants.sort((a, b) => Number(b.roas || 0) - Number(a.roas || 0));

    if (sorted[0].confidenceScore >= 95 && sorted[0].conversions >= 10) {
      await this.testRepository.update(testId, {
        status: 'COMPLETED',
        completedAt: new Date(),
        winnerId: sorted[0].id,
        confidenceLevel: sorted[0].confidenceScore,
      });

      // Pause losers
      for (let i = 1; i < sorted.length; i++) {
        await this.variantRepository.update(sorted[i].id, { status: 'LOSER' });
      }

      await this.variantRepository.update(sorted[0].id, { status: 'WINNER' });

      this.logger.log(`Test ${testId} completed. Winner: ${sorted[0].name}`);
    }
  }

  async listTests(workspaceId: string): Promise<CreativeTest[]> {
    return this.testRepository.find({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
    });
  }

  async getTestWithVariants(testId: string): Promise<any> {
    const test = await this.testRepository.findOne({ where: { id: testId } });
    const variants = await this.variantRepository.find({ where: { testId } });
    return { ...test, variants };
  }
}
