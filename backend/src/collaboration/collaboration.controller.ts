import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';

@Controller('api/v1/collaboration')
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @Post('comments')
  async createComment(@Body() dto: any) {
    return this.collaborationService.createComment(dto);
  }

  @Get('comments')
  async listComments(
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
  ) {
    return this.collaborationService.listComments(entityType, entityId);
  }

  @Get('notifications')
  async listNotifications(
    @Query('userId') userId: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.collaborationService.listNotifications(userId, unreadOnly === 'true');
  }

  @Put('notifications/:id/read')
  async markRead(@Param('id') id: string) {
    await this.collaborationService.markNotificationRead(id);
    return { success: true };
  }
}
