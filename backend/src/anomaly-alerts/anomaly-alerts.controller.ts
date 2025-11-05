import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { AnomalyAlertsService } from './anomaly-alerts.service';
import { AlertStatus } from '../database/entities/anomaly-alert.entity';

@Controller('anomaly-alerts')
export class AnomalyAlertsController {
  constructor(private readonly anomalyAlertsService: AnomalyAlertsService) {}

  @Get('alerts')
  async getAlerts(@Query('status') status?: AlertStatus) {
    return this.anomalyAlertsService.getAlerts(status);
  }

  @Post('alerts/:id/acknowledge')
  async acknowledgeAlert(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    return this.anomalyAlertsService.acknowledgeAlert(id, body.userId);
  }

  @Post('alerts/:id/resolve')
  async resolveAlert(
    @Param('id') id: string,
    @Body() body: { userId: string; resolutionSummary: string },
  ) {
    return this.anomalyAlertsService.resolveAlert(
      id,
      body.userId,
      body.resolutionSummary,
    );
  }

  @Get('routing-rules')
  async getRoutingRules(@Query('workspaceId') workspaceId: string) {
    return this.anomalyAlertsService.getRoutingRules(workspaceId || 'default');
  }

  @Post('routing-rules')
  async createRoutingRule(@Body() data: any) {
    return this.anomalyAlertsService.createRoutingRule(data);
  }

  @Post('alerts/:id/notify')
  async sendNotification(@Param('id') id: string) {
    return this.anomalyAlertsService.sendNotification(id);
  }

  @Get('alerts/:id/notifications')
  async getNotificationLogs(@Param('id') id: string) {
    return this.anomalyAlertsService.getNotificationLogs(id);
  }
}
