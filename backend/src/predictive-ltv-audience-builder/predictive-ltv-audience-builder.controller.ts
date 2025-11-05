import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PredictiveLtvAudienceBuilderService } from './predictive-ltv-audience-builder.service';

@Controller('predictive-ltv-audience-builder')
@UseGuards(JwtAuthGuard)
export class PredictiveLtvAudienceBuilderController {
  constructor(private readonly service: PredictiveLtvAudienceBuilderService) {}

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
