import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CreativeWorkbenchService } from './creative-workbench.service';

@Controller('creative-workbench')
export class CreativeWorkbenchController {
  constructor(private readonly creativeService: CreativeWorkbenchService) {}

  @Get('creatives')
  async getCreatives(@Query() filters: any) {
    return this.creativeService.getCreatives(filters);
  }

  @Get('creatives/:id')
  async getCreativeById(@Param('id') id: string) {
    return this.creativeService.getCreativeById(id);
  }

  @Get('creatives/:id/metrics')
  async getCreativeMetrics(@Param('id') id: string) {
    return this.creativeService.getCreativeMetrics(id);
  }

  @Get('collections')
  async getCollections(@Query('ownerId') ownerId?: string) {
    return this.creativeService.getCollections(ownerId);
  }

  @Post('collections')
  async createCollection(@Body() data: any) {
    return this.creativeService.createCollection(data);
  }

  @Post('collections/:id/creatives')
  async addCreativeToCollection(
    @Param('id') collectionId: string,
    @Body() body: { creativeId: string; role?: string },
  ) {
    return this.creativeService.addCreativeToCollection(
      collectionId,
      body.creativeId,
      body.role,
    );
  }

  @Get('collections/:id/items')
  async getCollectionItems(@Param('id') collectionId: string) {
    return this.creativeService.getCollectionItems(collectionId);
  }
}
