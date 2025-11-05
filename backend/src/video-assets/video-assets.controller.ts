import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { VideoAssetService } from './video-assets.service';
import { VideoAsset } from '../database/entities/video-asset.entity';

@Controller('api/v1/video-assets')
export class VideoAssetController {
  constructor(private readonly service: VideoAssetService) {}

  @Post()
  async create(@Body() body: any): Promise<VideoAsset> {
    const workspaceId = body.workspaceId || 'default';
    return await this.service.create(workspaceId, body);
  }

  @Get()
  async findAll(@Body('workspaceId') workspaceId: string): Promise<VideoAsset[]> {
    return await this.service.findAll(workspaceId || 'default');
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Body('workspaceId') workspaceId: string): Promise<VideoAsset> {
    return await this.service.findOne(id, workspaceId || 'default');
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any): Promise<VideoAsset> {
    const workspaceId = body.workspaceId || 'default';
    return await this.service.update(id, workspaceId, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Body('workspaceId') workspaceId: string): Promise<void> {
    return await this.service.remove(id, workspaceId || 'default');
  }
}
