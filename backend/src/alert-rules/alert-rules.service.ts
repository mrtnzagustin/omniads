import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertRule } from '../database/entities/alert-rule.entity';

@Injectable()
export class AlertRulesService {
  private readonly logger = new Logger(AlertRulesService.name);

  constructor(
    @InjectRepository(AlertRule)
    private alertRuleRepository: Repository<AlertRule>,
  ) {}

  async createRule(dto: any): Promise<AlertRule> {
    return this.alertRuleRepository.save(this.alertRuleRepository.create(dto));
  }

  async listRules(workspaceId: string): Promise<AlertRule[]> {
    return this.alertRuleRepository.find({
      where: { workspaceId },
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
  }

  async evaluateRules(workspaceId: string, data: any): Promise<void> {
    const rules = await this.alertRuleRepository.find({
      where: { workspaceId, enabled: true },
    });

    for (const rule of rules) {
      if (await this.evaluateConditions(rule, data)) {
        await this.fireAlert(rule);
      }
    }
  }

  private async evaluateConditions(rule: AlertRule, data: any): Promise<boolean> {
    let result = true;
    let currentOperator = 'AND';

    for (const condition of rule.conditions) {
      const value = data[condition.field];
      let conditionMet = false;

      switch (condition.operator) {
        case '<':
          conditionMet = value < condition.value;
          break;
        case '>':
          conditionMet = value > condition.value;
          break;
        case '=':
          conditionMet = value === condition.value;
          break;
        case '!=':
          conditionMet = value !== condition.value;
          break;
      }

      if (currentOperator === 'AND') {
        result = result && conditionMet;
      } else {
        result = result || conditionMet;
      }

      currentOperator = condition.logicalOperator || 'AND';
    }

    return result;
  }

  private async fireAlert(rule: AlertRule): Promise<void> {
    this.logger.log(`Alert fired: ${rule.name}`);

    await this.alertRuleRepository.update(rule.id, {
      fireCount: rule.fireCount + 1,
      lastFiredAt: new Date(),
    });

    // Send notifications via configured channels
    if (rule.channels.email) {
      this.logger.log(`Sending email alert for rule ${rule.name}`);
    }
    if (rule.channels.whatsapp) {
      this.logger.log(`Sending WhatsApp alert for rule ${rule.name}`);
    }
  }

  async updateRule(id: string, updates: any): Promise<AlertRule> {
    await this.alertRuleRepository.update(id, updates);
    return this.alertRuleRepository.findOne({ where: { id } });
  }
}
