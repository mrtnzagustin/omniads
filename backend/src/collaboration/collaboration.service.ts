import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../database/entities/comment.entity';
import { Notification } from '../database/entities/notification.entity';

@Injectable()
export class CollaborationService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async createComment(dto: any): Promise<Comment> {
    const comment = this.commentRepository.create(dto);
    const saved = await this.commentRepository.save(comment);

    // Send notifications to mentioned users
    if (dto.mentions && dto.mentions.length > 0) {
      await this.sendMentionNotifications(saved);
    }

    return saved;
  }

  private async sendMentionNotifications(comment: Comment): Promise<void> {
    for (const userId of comment.mentions) {
      await this.notificationRepository.save({
        userId,
        type: 'MENTION',
        message: `You were mentioned in a comment`,
        relatedEntityType: comment.entityType,
        relatedEntityId: comment.entityId,
        read: false,
      });
    }
  }

  async listComments(entityType: string, entityId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { entityType, entityId },
      order: { createdAt: 'ASC' },
    });
  }

  async listNotifications(userId: string, unreadOnly?: boolean): Promise<Notification[]> {
    const where: any = { userId };
    if (unreadOnly) where.read = false;

    return this.notificationRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.notificationRepository.update(id, { read: true });
  }
}
