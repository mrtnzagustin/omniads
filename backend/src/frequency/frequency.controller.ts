import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FrequencyConfigService } from './frequency.service';
import { FrequencyConfig } from '../database/entities/frequency-config.entity';

@Controller('api/v1/frequency')
export class FrequencyConfigController {
  constructor(private readonly service: FrequencyConfigService) {}

  @Post()
  async create(@Body() body: any): Promise<FrequencyConfig> {
    const workspaceId = body.workspaceId || 'default';
    return await this.service.create(workspaceId, body);
  }

  @Get()
  async findAll(@Body('workspaceId') workspaceId: string): Promise<FrequencyConfig[]> {
    return await this.service.findAll(workspaceId || 'default');
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Body('workspaceId') workspaceId: string): Promise<FrequencyConfig> {
    return await this.service.findOne(id, workspaceId || 'default');
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any): Promise<FrequencyConfig> {
    const workspaceId = body.workspaceId || 'default';
    return await this.service.update(id, workspaceId, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Body('workspaceId') workspaceId: string): Promise<void> {
    return await this.service.remove(id, workspaceId || 'default');
  }
}
