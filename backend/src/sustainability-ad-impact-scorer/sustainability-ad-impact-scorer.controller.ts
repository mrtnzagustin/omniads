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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SustainabilityAdImpactScorerService } from './sustainability-ad-impact-scorer.service';

@Controller('api/v1/sustainability-ad-impact-scorer')
@UseGuards(JwtAuthGuard)
export class SustainabilityAdImpactScorerController {
  constructor(private readonly service: SustainabilityAdImpactScorerService) {}

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
