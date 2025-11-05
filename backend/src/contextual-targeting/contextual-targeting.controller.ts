import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ContextualTargetingConfigService } from './contextual-targeting.service';
import { ContextualTargetingConfig } from '../database/entities/contextual-targeting-config.entity';

@Controller('api/v1/contextual-targeting')
export class ContextualTargetingConfigController {
  constructor(private readonly service: ContextualTargetingConfigService) {}

  @Post()
  async create(@Body() body: any): Promise<ContextualTargetingConfig> {
    const workspaceId = body.workspaceId || 'default';
    return await this.service.create(workspaceId, body);
  }

  @Get()
  async findAll(@Body('workspaceId') workspaceId: string): Promise<ContextualTargetingConfig[]> {
    return await this.service.findAll(workspaceId || 'default');
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Body('workspaceId') workspaceId: string): Promise<ContextualTargetingConfig> {
    return await this.service.findOne(id, workspaceId || 'default');
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any): Promise<ContextualTargetingConfig> {
    const workspaceId = body.workspaceId || 'default';
    return await this.service.update(id, workspaceId, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Body('workspaceId') workspaceId: string): Promise<void> {
    return await this.service.remove(id, workspaceId || 'default');
  }
}
