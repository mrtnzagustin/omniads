import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { CreativeFatigueMetric } from '../database/entities/creative-fatigue-metric.entity';

@Injectable()
export class CreativeFatigueService {
  private readonly logger = new Logger(CreativeFatigueService.name);

  constructor(
    @InjectRepository(CreativeFatigueMetric)
    private metricRepository: Repository<CreativeFatigueMetric>,
  ) {}

  async analyzeCreativeFatigue(workspaceId: string, creativeId: string): Promise<any> {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const metrics = await this.metricRepository.find({
      where: {
        workspaceId,
        creativeId,
        date: MoreThan(last30Days),
      },
      order: { date: 'ASC' },
    });

    if (metrics.length < 7) {
      return { status: 'INSUFFICIENT_DATA', fatigueScore: 0, isFatigued: false };
    }

    // Calculate fatigue based on CTR decline
    const recentCtr = metrics.slice(-7).reduce((sum, m) => sum + Number(m.ctr), 0) / 7;
    const oldCtr = metrics.slice(0, 7).reduce((sum, m) => sum + Number(m.ctr), 0) / 7;
    const ctrDecline = ((oldCtr - recentCtr) / oldCtr) * 100;

    const fatigueScore = Math.max(0, Math.min(100, ctrDecline * 2));
    const isFatigued = fatigueScore > 50;

    return {
      status: 'ANALYZED',
      fatigueScore,
      isFatigued,
      ctrDecline,
      recommendation: isFatigued ? 'REFRESH_CREATIVE' : 'CONTINUE',
    };
  }

  async trackCreativeMetric(dto: any): Promise<CreativeFatigueMetric> {
    return this.metricRepository.save(this.metricRepository.create(dto));
  }

  async getFatiguedCreatives(workspaceId: string): Promise<string[]> {
    const fatigued = await this.metricRepository.find({
      where: { workspaceId, isFatigued: true },
      order: { fatigueScore: 'DESC' },
    });

    return [...new Set(fatigued.map(m => m.creativeId))];
  }
}
