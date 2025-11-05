import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { AlertRulesService } from './alert-rules.service';

@Controller('api/v1/alert-rules')
export class AlertRulesController {
  constructor(private readonly alertService: AlertRulesService) {}

  @Post()
  async createRule(@Body() dto: any) {
    return this.alertService.createRule(dto);
  }

  @Get()
  async listRules(@Query('workspaceId') workspaceId: string) {
    return this.alertService.listRules(workspaceId);
  }

  @Put(':id')
  async updateRule(@Param('id') id: string, @Body() updates: any) {
    return this.alertService.updateRule(id, updates);
  }

  @Post('evaluate')
  async evaluateRules(
    @Body('workspaceId') workspaceId: string,
    @Body('data') data: any,
  ) {
    await this.alertService.evaluateRules(workspaceId, data);
    return { success: true };
  }
}
