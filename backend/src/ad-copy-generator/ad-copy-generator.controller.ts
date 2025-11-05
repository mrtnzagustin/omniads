import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AdCopyGeneratorService } from './ad-copy-generator.service';

@Controller('api/v1/ad-copy')
export class AdCopyGeneratorController {
  constructor(private readonly copyService: AdCopyGeneratorService) {}

  @Post('generate')
  async generateCopy(
    @Body('workspaceId') workspaceId: string,
    @Body('inputs') inputs: Record<string, string>,
  ) {
    return this.copyService.generateAdCopy(workspaceId, inputs);
  }

  @Get('templates')
  async listTemplates(@Query('workspaceId') workspaceId: string) {
    return this.copyService.listTemplates(workspaceId);
  }

  @Post('templates')
  async createTemplate(@Body() dto: any) {
    return this.copyService.createTemplate(dto);
  }
}
