import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RetailMediaNetworkService } from './retail-media-network.service';
import { Workspace } from '../decorators/workspace.decorator';

@Controller('api/v1/retail-media-network')
@UseGuards(JwtAuthGuard)
export class RetailMediaNetworkController {
  constructor(private readonly service: RetailMediaNetworkService) {}

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
