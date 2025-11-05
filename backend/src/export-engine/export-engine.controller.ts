import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ExportEngineService } from './export-engine.service';

@Controller('api/v1/exports')
export class ExportEngineController {
  constructor(private readonly exportService: ExportEngineService) {}

  @Post()
  async createExport(
    @Body('workspaceId') workspaceId: string,
    @Body('userId') userId: string,
    @Body('format') format: string,
    @Body('configuration') config: any,
  ) {
    return this.exportService.createExportJob(workspaceId, userId, format, config);
  }

  @Get()
  async listExports(@Query('workspaceId') workspaceId: string) {
    return this.exportService.listExports(workspaceId);
  }
}
