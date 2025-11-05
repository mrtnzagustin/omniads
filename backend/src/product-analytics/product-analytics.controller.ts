import { Controller, Get, Query } from '@nestjs/common';
import { ProductAnalyticsService } from './product-analytics.service';

@Controller('api/v1/product-analytics')
export class ProductAnalyticsController {
  constructor(private readonly productService: ProductAnalyticsService) {}

  @Get('performance')
  async getPerformance(
    @Query('workspaceId') workspaceId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.productService.getProductPerformance(workspaceId, new Date(startDate), new Date(endDate));
  }

  @Get('recommendations')
  async getRecommendations(@Query('workspaceId') workspaceId: string) {
    return this.productService.getProductRecommendations(workspaceId);
  }
}
