import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetScenario } from '../database/entities/budget-scenario.entity';

@Injectable()
export class BudgetScenariosService {
  constructor(
    @InjectRepository(BudgetScenario)
    private scenarioRepository: Repository<BudgetScenario>,
  ) {}

  async createScenario(dto: any): Promise<BudgetScenario> {
    const scenario = this.scenarioRepository.create(dto);

    // Calculate predicted outcomes
    scenario.predictedOutcomes = await this.calculatePredictions(scenario.allocations);

    return this.scenarioRepository.save(scenario);
  }

  private async calculatePredictions(allocations: any[]): Promise<any> {
    let totalRevenue = 0;
    let totalSpend = 0;

    for (const allocation of allocations) {
      // Simulate ROAS predictions (in production, use ML models)
      const baseROAS = 3.0 + Math.random() * 2;
      const revenue = allocation.allocatedBudget * baseROAS;

      totalRevenue += revenue;
      totalSpend += allocation.allocatedBudget;

      allocation.predictedROAS = baseROAS;
      allocation.predictedRevenue = revenue;
    }

    return {
      revenue: totalRevenue,
      roas: totalRevenue / totalSpend,
      conversions: Math.floor(totalRevenue / 50),
      newCustomers: Math.floor(totalRevenue / 150),
    };
  }

  async listScenarios(workspaceId: string): Promise<BudgetScenario[]> {
    return this.scenarioRepository.find({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
    });
  }

  async compareScenarios(scenarioIds: string[]): Promise<any> {
    const scenarios = await this.scenarioRepository.findByIds(scenarioIds);

    return scenarios.map(s => ({
      id: s.id,
      name: s.name,
      totalBudget: s.totalBudget,
      predictedOutcomes: s.predictedOutcomes,
    }));
  }

  async updateScenario(id: string, updates: any): Promise<BudgetScenario> {
    const scenario = await this.scenarioRepository.findOne({ where: { id } });

    if (updates.allocations) {
      updates.predictedOutcomes = await this.calculatePredictions(updates.allocations);
    }

    await this.scenarioRepository.update(id, updates);
    return this.scenarioRepository.findOne({ where: { id } });
  }
}
