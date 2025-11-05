import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AudioAdsStudioService } from './audio-ads-studio.service';

@Controller('audio-ads-studio')
@UseGuards(JwtAuthGuard)
export class AudioAdsStudioController {
  constructor(private readonly service: AudioAdsStudioService) {}

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
