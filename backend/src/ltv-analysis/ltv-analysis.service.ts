import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerLTV } from '../database/entities/customer-ltv.entity';

@Injectable()
export class LTVAnalysisService {
  constructor(
    @InjectRepository(CustomerLTV)
    private ltvRepository: Repository<CustomerLTV>,
  ) {}

  async getLTVByChannel(workspaceId: string): Promise<any[]> {
    const data = await this.ltvRepository
      .createQueryBuilder('ltv')
      .select('ltv.acquisitionChannel', 'channel')
      .addSelect('AVG(ltv.ltv30)', 'avgLtv30')
      .addSelect('AVG(ltv.ltv90)', 'avgLtv90')
      .addSelect('AVG(ltv.ltv180)', 'avgLtv180')
      .addSelect('AVG(ltv.ltv365)', 'avgLtv365')
      .addSelect('COUNT(*)', 'customerCount')
      .where('ltv.workspaceId = :workspaceId', { workspaceId })
      .groupBy('ltv.acquisitionChannel')
      .orderBy('avgLtv365', 'DESC')
      .getRawMany();

    return data;
  }

  async calculateCohortRetention(workspaceId: string): Promise<any[]> {
    // Simplified cohort retention calculation
    const ltv = await this.ltvRepository.find({
      where: { workspaceId },
      order: { acquisitionDate: 'ASC' },
    });

    const cohorts: Record<string, any> = {};

    ltv.forEach(customer => {
      const cohortKey = customer.acquisitionDate.toISOString().substring(0, 7);

      if (!cohorts[cohortKey]) {
        cohorts[cohortKey] = {
          cohort: cohortKey,
          customerCount: 0,
          avgLtv: 0,
          repeatPurchaseRate: 0,
        };
      }

      cohorts[cohortKey].customerCount++;
      cohorts[cohortKey].avgLtv += Number(customer.ltv365);

      if (customer.purchaseCount > 1) {
        cohorts[cohortKey].repeatPurchaseRate++;
      }
    });

    return Object.values(cohorts).map(cohort => ({
      ...cohort,
      avgLtv: cohort.avgLtv / cohort.customerCount,
      repeatPurchaseRate: (cohort.repeatPurchaseRate / cohort.customerCount) * 100,
    }));
  }
}
