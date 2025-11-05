import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhatsAppSubscription } from '../database/entities/whatsapp-subscription.entity';
import {
  WhatsAppDigest,
  DigestStatus,
} from '../database/entities/whatsapp-digest.entity';
import {
  WhatsAppActionToken,
  ActionTokenType,
} from '../database/entities/whatsapp-action-token.entity';
import {
  WhatsAppConversationLog,
  MessageDirection,
} from '../database/entities/whatsapp-conversation-log.entity';
import { TwilioApiMock } from '../services/mocks/twilioApi';

@Injectable()
export class WhatsAppService {
  private twilioApi = new TwilioApiMock();

  constructor(
    @InjectRepository(WhatsAppSubscription)
    private subscriptionRepo: Repository<WhatsAppSubscription>,
    @InjectRepository(WhatsAppDigest)
    private digestRepo: Repository<WhatsAppDigest>,
    @InjectRepository(WhatsAppActionToken)
    private tokenRepo: Repository<WhatsAppActionToken>,
    @InjectRepository(WhatsAppConversationLog)
    private conversationRepo: Repository<WhatsAppConversationLog>,
  ) {}

  async subscribe(userId: string, phoneNumber: string) {
    const existing = await this.subscriptionRepo.findOne({
      where: { userId },
    });

    if (existing) {
      existing.phoneNumber = phoneNumber;
      existing.optedIn = true;
      return this.subscriptionRepo.save(existing);
    }

    const subscription = this.subscriptionRepo.create({
      userId,
      phoneNumber,
      optedIn: true,
    });

    return this.subscriptionRepo.save(subscription);
  }

  async unsubscribe(userId: string) {
    await this.subscriptionRepo.update({ userId }, { optedIn: false });
  }

  async getSubscription(userId: string) {
    return this.subscriptionRepo.findOne({ where: { userId } });
  }

  async sendDailyDigest(userId: string, digestData: any) {
    const subscription = await this.subscriptionRepo.findOne({
      where: { userId, optedIn: true },
    });

    if (!subscription) {
      throw new Error('User not subscribed to WhatsApp');
    }

    const digest = this.digestRepo.create({
      userId,
      payload: digestData,
      metricsIncluded: {
        spend: digestData.kpis?.spend,
        revenue: digestData.kpis?.revenue,
        roas: digestData.kpis?.roas,
      },
      status: DigestStatus.PENDING,
    });

    await this.digestRepo.save(digest);

    // Send via Twilio
    try {
      const message = this.formatDigestMessage(digestData);
      await this.twilioApi.sendWhatsAppMessage(
        subscription.phoneNumber,
        message,
      );

      digest.status = DigestStatus.SENT;
      digest.sentAt = new Date();
    } catch (error) {
      digest.status = DigestStatus.FAILED;
      digest.failureReason = error.message;
    }

    return this.digestRepo.save(digest);
  }

  async createActionToken(
    userId: string,
    actionType: ActionTokenType,
    entityType: string,
    entityId: string,
  ) {
    const token = this.tokenRepo.create({
      token: this.generateToken(),
      userId,
      actionType,
      entityType,
      entityId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    return this.tokenRepo.save(token);
  }

  async executeAction(token: string) {
    const actionToken = await this.tokenRepo.findOne({ where: { token } });

    if (!actionToken) {
      throw new Error('Invalid token');
    }

    if (actionToken.used) {
      throw new Error('Token already used');
    }

    if (new Date() > actionToken.expiresAt) {
      throw new Error('Token expired');
    }

    actionToken.used = true;
    actionToken.usedAt = new Date();
    await this.tokenRepo.save(actionToken);

    return {
      actionType: actionToken.actionType,
      entityType: actionToken.entityType,
      entityId: actionToken.entityId,
    };
  }

  async logConversation(
    userId: string,
    direction: MessageDirection,
    messageText: string,
    metadata?: any,
  ) {
    const log = this.conversationRepo.create({
      userId,
      direction,
      messageText,
      metadata,
    });

    return this.conversationRepo.save(log);
  }

  async getConversationHistory(userId: string, limit = 50) {
    return this.conversationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  private formatDigestMessage(data: any): string {
    let message = '📊 *Daily Digest*\n\n';
    message += `*KPIs*\n`;
    message += `Spend: $${data.kpis?.spend || 0}\n`;
    message += `Revenue: $${data.kpis?.revenue || 0}\n`;
    message += `ROAS: ${data.kpis?.roas || 0}x\n\n`;

    if (data.alerts?.length > 0) {
      message += `🚨 *Alerts* (${data.alerts.length})\n`;
      data.alerts.slice(0, 3).forEach((alert: any) => {
        message += `- ${alert.title}\n`;
      });
      message += '\n';
    }

    if (data.recommendations?.length > 0) {
      message += `💡 *Top Recommendations* (${data.recommendations.length})\n`;
      data.recommendations.slice(0, 3).forEach((rec: any) => {
        message += `- ${rec.title}\n`;
      });
    }

    return message;
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }
}
