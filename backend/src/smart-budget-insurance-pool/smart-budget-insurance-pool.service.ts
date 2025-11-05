import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartBudgetInsurancePool } from './smart-budget-insurance-pool.entity';

@Injectable()
export class SmartBudgetInsurancePoolService {
  private readonly logger = new Logger(SmartBudgetInsurancePoolService.name);

  constructor(
    @InjectRepository(SmartBudgetInsurancePool)
    private repository: Repository<SmartBudgetInsurancePool>,
  ) {}

  async findAll(): Promise<SmartBudgetInsurancePool[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<SmartBudgetInsurancePool | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<SmartBudgetInsurancePool>): Promise<SmartBudgetInsurancePool> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<SmartBudgetInsurancePool>): Promise<SmartBudgetInsurancePool> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`SmartBudgetInsurancePool ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing SmartBudgetInsurancePool ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`SmartBudgetInsurancePool ${id} not found`);
    }
    // Feature-specific processing logic
    const results = {
      processed: true,
      timestamp: new Date(),
      data: entity.config,
    };
    await this.update(id, { results });
    return results;
  }
}
