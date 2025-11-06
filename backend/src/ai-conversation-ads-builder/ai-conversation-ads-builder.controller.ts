import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiConversationAdsBuilderService } from './ai-conversation-ads-builder.service';

@Controller('ai-conversation-ads-builder')
@UseGuards(JwtAuthGuard)
export class AiConversationAdsBuilderController {
  constructor(private readonly service: AiConversationAdsBuilderService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.service.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/process')
  async process(@Param('id') id: string, @Body() options: any) {
    return this.service.process(id, options);
  }
}
