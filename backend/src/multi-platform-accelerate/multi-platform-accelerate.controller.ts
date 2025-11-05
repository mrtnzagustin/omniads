import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MultiPlatformAccelerateService } from './multi-platform-accelerate.service';

@Controller('multi-platform-accelerate')
@UseGuards(JwtAuthGuard)
export class MultiPlatformAccelerateController {
  constructor(private readonly service: MultiPlatformAccelerateService) {}

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
