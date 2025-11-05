import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SmartBudgetInsurancePoolService } from './smart-budget-insurance-pool.service';

@Controller('api/v1/smart-budget-insurance-pool')
@UseGuards(JwtAuthGuard)
export class SmartBudgetInsurancePoolController {
  constructor(private readonly service: SmartBudgetInsurancePoolService) {}

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(id);
    return { success: true, data };
  }

  @Post()
  async create(@Body() body: any) {
    const data = await this.service.create(body);
    return { success: true, data };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const data = await this.service.update(id, body);
    return { success: true, data };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return { success: true };
  }

  @Post(':id/process')
  async process(@Param('id') id: string) {
    const data = await this.service.process(id);
    return { success: true, data };
  }
}
