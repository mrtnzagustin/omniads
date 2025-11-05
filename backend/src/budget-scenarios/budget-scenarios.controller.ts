import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { BudgetScenariosService } from './budget-scenarios.service';

@Controller('api/v1/budget-scenarios')
export class BudgetScenariosController {
  constructor(private readonly scenarioService: BudgetScenariosService) {}

  @Post()
  async createScenario(@Body() dto: any) {
    return this.scenarioService.createScenario(dto);
  }

  @Get()
  async listScenarios(@Query('workspaceId') workspaceId: string) {
    return this.scenarioService.listScenarios(workspaceId);
  }

  @Post('compare')
  async compareScenarios(@Body('scenarioIds') scenarioIds: string[]) {
    return this.scenarioService.compareScenarios(scenarioIds);
  }

  @Put(':id')
  async updateScenario(@Param('id') id: string, @Body() updates: any) {
    return this.scenarioService.updateScenario(id, updates);
  }
}
