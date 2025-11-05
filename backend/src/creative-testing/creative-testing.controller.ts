import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { CreativeTestingService } from './creative-testing.service';

@Controller('api/v1/creative-tests')
export class CreativeTestingController {
  constructor(private readonly testingService: CreativeTestingService) {}

  @Get()
  async listTests(@Query('workspaceId') workspaceId: string) {
    return this.testingService.listTests(workspaceId);
  }

  @Post()
  async createTest(@Body() dto: any) {
    return this.testingService.createTest(dto);
  }

  @Get(':id')
  async getTest(@Param('id') id: string) {
    return this.testingService.getTestWithVariants(id);
  }

  @Post(':id/start')
  async startTest(@Param('id') id: string) {
    return this.testingService.startTest(id);
  }

  @Put('variants/:variantId/performance')
  async updatePerformance(
    @Param('variantId') variantId: string,
    @Body() metrics: any,
  ) {
    await this.testingService.updateVariantPerformance(variantId, metrics);
    return { success: true };
  }
}
