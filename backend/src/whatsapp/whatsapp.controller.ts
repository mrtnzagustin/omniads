import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Post('subscribe')
  async subscribe(@Body() body: { userId: string; phoneNumber: string }) {
    return this.whatsappService.subscribe(body.userId, body.phoneNumber);
  }

  @Post('unsubscribe')
  async unsubscribe(@Body() body: { userId: string }) {
    return this.whatsappService.unsubscribe(body.userId);
  }

  @Get('subscription/:userId')
  async getSubscription(@Param('userId') userId: string) {
    return this.whatsappService.getSubscription(userId);
  }

  @Post('digest/send')
  async sendDigest(@Body() body: { userId: string; digestData: any }) {
    return this.whatsappService.sendDailyDigest(body.userId, body.digestData);
  }

  @Post('action-token')
  async createActionToken(@Body() body: any) {
    return this.whatsappService.createActionToken(
      body.userId,
      body.actionType,
      body.entityType,
      body.entityId,
    );
  }

  @Post('action/execute')
  async executeAction(@Body() body: { token: string }) {
    return this.whatsappService.executeAction(body.token);
  }

  @Get('conversation/:userId')
  async getConversationHistory(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.whatsappService.getConversationHistory(
      userId,
      limit ? parseInt(limit.toString()) : undefined,
    );
  }

  @Post('conversation/log')
  async logConversation(@Body() body: any) {
    return this.whatsappService.logConversation(
      body.userId,
      body.direction,
      body.messageText,
      body.metadata,
    );
  }
}
