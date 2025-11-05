import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WhiteLabelDashboardService } from './white-label-dashboard.service';
import { WhiteLabelDashboard } from '../database/entities/white-label-dashboard.entity';

@Controller('white-label-dashboard')
@UseGuards(JwtAuthGuard)
export class WhiteLabelDashboardController {
  constructor(private readonly service: WhiteLabelDashboardService) {}

  @Post()
  async create(@Body() body: { userId: string; data: Partial<WhiteLabelDashboard> }) {
    return await this.service.create(body.userId, body.data);
  }

  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string) {
    return await this.service.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Get(':id/analyze')
  async analyze(@Param('id') id: string) {
    return await this.service.analyze(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<WhiteLabelDashboard>) {
    return await this.service.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return { message: 'Deleted successfully' };
  }
}
