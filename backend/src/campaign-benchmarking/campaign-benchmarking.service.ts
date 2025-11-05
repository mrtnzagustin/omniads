import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampaignBenchmark } from '../database/entities/campaign-benchmark.entity';

@Injectable()
export class CampaignBenchmarkingService {
  constructor(
    @InjectRepository(CampaignBenchmark)
    private benchmarkRepository: Repository<CampaignBenchmark>,
  ) {}

  async getBenchmarks(industry: string, campaignType: string, region: string): Promise<CampaignBenchmark> {
    let benchmark = await this.benchmarkRepository.findOne({
      where: { industry, campaignType, region, benchmarkType: 'PUBLIC' },
    });

    if (!benchmark) {
      // Create default benchmark
      benchmark = this.benchmarkRepository.create({
        industry,
        campaignType,
        region,
        avgCtr: 0.02,
        avgCpc: 2.5,
        avgCpa: 50,
        avgRoas: 3.0,
        avgConversionRate: 0.03,
        sampleSize: 1000,
        periodStart: new Date('2024-01-01'),
        periodEnd: new Date('2024-12-31'),
        benchmarkType: 'PUBLIC',
      });
      benchmark = await this.benchmarkRepository.save(benchmark);
    }

    return benchmark;
  }

  async compareToBenchmark(campaignMetrics: any, industry: string, campaignType: string, region: string): Promise<any> {
    const benchmark = await this.getBenchmarks(industry, campaignType, region);

    return {
      benchmark,
      campaign: campaignMetrics,
      comparison: {
        ctr: this.calculatePerformance(campaignMetrics.ctr, benchmark.avgCtr),
        cpc: this.calculatePerformance(campaignMetrics.cpc, benchmark.avgCpc),
        cpa: this.calculatePerformance(campaignMetrics.cpa, benchmark.avgCpa),
        roas: this.calculatePerformance(campaignMetrics.roas, benchmark.avgRoas),
        conversionRate: this.calculatePerformance(campaignMetrics.conversionRate, benchmark.avgConversionRate),
      },
    };
  }

  private calculatePerformance(actual: number, benchmark: number): any {
    const diff = ((actual - benchmark) / benchmark) * 100;
    return {
      actual,
      benchmark,
      percentageDifference: diff,
      status: diff > 10 ? 'ABOVE' : diff < -10 ? 'BELOW' : 'ON_PAR',
    };
  }

  async createCustomBenchmark(dto: any): Promise<CampaignBenchmark> {
    return this.benchmarkRepository.save(this.benchmarkRepository.create({ ...dto, benchmarkType: 'CUSTOM' }));
  }
}
