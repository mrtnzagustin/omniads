import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { MultiBrandOrchestratorService, CreateBrandPortfolioDto, OptimizeBrandAllocationDto } from './multi-brand-orchestrator.service';

@Controller('multi-brand-orchestrator')
export class MultiBrandOrchestratorController {
  constructor(private readonly service: MultiBrandOrchestratorService) {}

  @Post()
  async createPortfolio(@Body() dto: CreateBrandPortfolioDto) {
    return await this.service.createPortfolio(dto);
  }

  @Get('user/:userId')
  async getPortfoliosByUser(@Param('userId') userId: string) {
    return await this.service.findAllByUser(userId);
  }

  @Get(':id')
  async getPortfolio(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Post('optimize')
  async optimizeAllocation(@Body() dto: OptimizeBrandAllocationDto) {
    return await this.service.optimizeBrandAllocation(dto);
  }

  @Get(':id/report')
  async getUnifiedReport(@Param('id') id: string) {
    return await this.service.getUnifiedReport(id);
  }

  @Put(':id')
  async updatePortfolio(
    @Param('id') id: string,
    @Body() updates: Partial<any>
  ) {
    return await this.service.updatePortfolio(id, updates);
  }

  @Delete(':id')
  async deletePortfolio(@Param('id') id: string) {
    await this.service.deletePortfolio(id);
    return { message: 'Portfolio deleted successfully' };
  }
}
