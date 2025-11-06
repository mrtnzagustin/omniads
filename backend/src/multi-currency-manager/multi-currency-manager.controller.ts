import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MultiCurrencyManagerService } from './multi-currency-manager.service';
import { MultiCurrencyManager } from '../database/entities/multi-currency-manager.entity';

@Controller('multi-currency-manager')
@UseGuards(JwtAuthGuard)
export class MultiCurrencyManagerController {
  constructor(private readonly service: MultiCurrencyManagerService) {}

  @Post()
  async create(@Body() body: { userId: string; data: Partial<MultiCurrencyManager> }) {
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
  async update(@Param('id') id: string, @Body() data: Partial<MultiCurrencyManager>) {
    return await this.service.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return { message: 'Deleted successfully' };
  }
}
