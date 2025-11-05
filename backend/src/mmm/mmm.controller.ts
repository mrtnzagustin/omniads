import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MMMModelService } from './mmm.service';
import { MMMModel } from '../database/entities/mmm-model.entity';

@Controller('api/v1/mmm')
export class MMMModelController {
  constructor(private readonly service: MMMModelService) {}

  @Post()
  async create(@Body() body: any): Promise<MMMModel> {
    const workspaceId = body.workspaceId || 'default';
    return await this.service.create(workspaceId, body);
  }

  @Get()
  async findAll(@Body('workspaceId') workspaceId: string): Promise<MMMModel[]> {
    return await this.service.findAll(workspaceId || 'default');
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Body('workspaceId') workspaceId: string): Promise<MMMModel> {
    return await this.service.findOne(id, workspaceId || 'default');
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any): Promise<MMMModel> {
    const workspaceId = body.workspaceId || 'default';
    return await this.service.update(id, workspaceId, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Body('workspaceId') workspaceId: string): Promise<void> {
    return await this.service.remove(id, workspaceId || 'default');
  }
}
