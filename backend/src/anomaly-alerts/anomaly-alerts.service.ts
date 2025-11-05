import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AnomalyAlert,
  AlertSeverity,
  AlertStatus,
} from '../database/entities/anomaly-alert.entity';
import {
  AnomalyBaseline,
  MetricType,
} from '../database/entities/anomaly-baseline.entity';
import {
  AlertRoutingRule,
  NotificationChannel,
} from '../database/entities/alert-routing-rule.entity';
import {
  AlertNotificationLog,
  NotificationStatus,
} from '../database/entities/alert-notification-log.entity';

@Injectable()
export class AnomalyAlertsService {
  constructor(
    @InjectRepository(AnomalyAlert)
    private alertRepo: Repository<AnomalyAlert>,
    @InjectRepository(AnomalyBaseline)
    private baselineRepo: Repository<AnomalyBaseline>,
    @InjectRepository(AlertRoutingRule)
    private routingRuleRepo: Repository<AlertRoutingRule>,
    @InjectRepository(AlertNotificationLog)
    private notificationLogRepo: Repository<AlertNotificationLog>,
  ) {}

  async getAlerts(status?: AlertStatus) {
    const query = this.alertRepo
      .createQueryBuilder('alert')
      .leftJoinAndSelect('alert.campaign', 'campaign')
      .orderBy('alert.detectedAt', 'DESC');

    if (status) {
      query.where('alert.status = :status', { status });
    }

    return query.getMany();
  }

  async acknowledgeAlert(alertId: string, userId: string) {
    const alert = await this.alertRepo.findOne({ where: { id: alertId } });
    if (!alert) {
      throw new Error('Alert not found');
    }

    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = userId;

    return this.alertRepo.save(alert);
  }

  async resolveAlert(
    alertId: string,
    userId: string,
    resolutionSummary: string,
  ) {
    const alert = await this.alertRepo.findOne({ where: { id: alertId } });
    if (!alert) {
      throw new Error('Alert not found');
    }

    alert.status = AlertStatus.RESOLVED;
    alert.resolvedAt = new Date();
    alert.resolvedBy = userId;
    alert.resolutionSummary = resolutionSummary;

    return this.alertRepo.save(alert);
  }

  async getRoutingRules(workspaceId: string) {
    return this.routingRuleRepo.find({
      where: { workspaceId },
      order: { priority: 'DESC' },
    });
  }

  async createRoutingRule(data: {
    workspaceId: string;
    name: string;
    severity: AlertSeverity;
    channels: NotificationChannel[];
    recipients: string[];
  }) {
    const rule = this.routingRuleRepo.create(data);
    return this.routingRuleRepo.save(rule);
  }

  async sendNotification(alertId: string) {
    const alert = await this.alertRepo.findOne({ where: { id: alertId } });
    if (!alert) {
      throw new Error('Alert not found');
    }

    const rules = await this.routingRuleRepo.find({
      where: { severity: alert.severity, enabled: true },
    });

    const logs = [];
    for (const rule of rules) {
      for (const channel of rule.channels) {
        for (const recipient of rule.recipients) {
          const log = this.notificationLogRepo.create({
            alertId,
            channel,
            recipient,
            status: NotificationStatus.SENT,
            sentAt: new Date(),
          });
          logs.push(await this.notificationLogRepo.save(log));
        }
      }
    }

    return logs;
  }

  async getNotificationLogs(alertId: string) {
    return this.notificationLogRepo.find({
      where: { alertId },
      order: { createdAt: 'DESC' },
    });
  }
}
