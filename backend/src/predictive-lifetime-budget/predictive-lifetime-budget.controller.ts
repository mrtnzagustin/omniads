import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PredictiveLifetimeBudgetService, CreatePredictiveLifetimeBudgetDto } from './predictive-lifetime-budget.service';

@Controller('predictive-lifetime-budget')
export class PredictiveLifetimeBudgetController {
  constructor(private readonly service: PredictiveLifetimeBudgetService) {}

  @Post()
  async create(@Body() dto: CreatePredictiveLifetimeBudgetDto) {
    return await this.service.create(dto);
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
  async update(@Param('id') id: string, @Body() updates: Partial<any>) {
    return await this.service.update(id, updates);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return { message: 'Predictive lifetime budget manager deleted successfully' };
  }
}
