import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { IncrementalityTestService } from './incrementality.service';
import { IncrementalityTest } from '../database/entities/incrementality-test.entity';

@Controller('api/v1/incrementality')
export class IncrementalityTestController {
  constructor(private readonly service: IncrementalityTestService) {}

  @Post()
  async create(@Body() body: any): Promise<IncrementalityTest> {
    const workspaceId = body.workspaceId || 'default';
    return await this.service.create(workspaceId, body);
  }

  @Get()
  async findAll(@Body('workspaceId') workspaceId: string): Promise<IncrementalityTest[]> {
    return await this.service.findAll(workspaceId || 'default');
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Body('workspaceId') workspaceId: string): Promise<IncrementalityTest> {
    return await this.service.findOne(id, workspaceId || 'default');
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any): Promise<IncrementalityTest> {
    const workspaceId = body.workspaceId || 'default';
    return await this.service.update(id, workspaceId, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Body('workspaceId') workspaceId: string): Promise<void> {
    return await this.service.remove(id, workspaceId || 'default');
  }
}
