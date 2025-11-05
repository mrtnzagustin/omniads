import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrivacyFirstAnalyticsService } from './privacy-first-analytics.service';
import { Workspace } from '../decorators/workspace.decorator';

@Controller('api/v1/privacy-first-analytics')
@UseGuards(JwtAuthGuard)
export class PrivacyFirstAnalyticsController {
  constructor(private readonly service: PrivacyFirstAnalyticsService) {}

  @Post()
  create(@Workspace() workspaceId: string, @Body() data: any) {
    return this.service.create(workspaceId, data);
  }

  @Get()
  findAll(@Workspace() workspaceId: string) {
    return this.service.findAll(workspaceId);
  }

  @Get(':id')
  findOne(@Workspace() workspaceId: string, @Param('id') id: string) {
    return this.service.findOne(workspaceId, id);
  }

  @Put(':id')
  update(@Workspace() workspaceId: string, @Param('id') id: string, @Body() data: any) {
    return this.service.update(workspaceId, id, data);
  }

  @Delete(':id')
  delete(@Workspace() workspaceId: string, @Param('id') id: string) {
    return this.service.delete(workspaceId, id);
  }
}
