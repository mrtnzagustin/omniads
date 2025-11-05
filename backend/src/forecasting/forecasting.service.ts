import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Forecast } from '../database/entities/forecast.entity';
import { ForecastScenario } from '../database/entities/forecast-scenario.entity';
import { ForecastAccuracyLog } from '../database/entities/forecast-accuracy-log.entity';
import { SeasonalEvent } from '../database/entities/seasonal-event.entity';

export interface CreateForecastDto {
  workspaceId: string;
  forecastDate: Date;
  targetDate: Date;
  metricType: 'ROAS' | 'REVENUE' | 'SPEND' | 'CONVERSIONS' | 'CPA';
  predictedValue: number;
  confidenceInterval80Lower: number;
  confidenceInterval80Upper: number;
  confidenceInterval95Lower: number;
  confidenceInterval95Upper: number;
  modelVersion?: string;
  modelMetadata?: Record<string, any>;
  campaignId?: string;
  channel?: string;
}

export interface CreateScenarioDto {
  workspaceId: string;
  name: string;
  description?: string;
  adjustments: Array<{
    type: 'BUDGET_INCREASE' | 'BUDGET_DECREASE' | 'CHANNEL_SHIFT' | 'CAMPAIGN_PAUSE' | 'CAMPAIGN_LAUNCH';
    targetId?: string;
    targetType: 'CAMPAIGN' | 'CHANNEL' | 'WORKSPACE';
    value: number;
    unit: 'ABSOLUTE' | 'PERCENTAGE';
    startDate: string;
    endDate?: string;
  }>;
  createdBy?: string;
}

export interface CreateSeasonalEventDto {
  workspaceId: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  eventType?: 'HOLIDAY' | 'SALE' | 'PRODUCT_LAUNCH' | 'SEASONAL' | 'CUSTOM';
  expectedImpactMultiplier?: number;
  applyToForecasting?: boolean;
  createdBy?: string;
}

@Injectable()
export class ForecastingService {
  private readonly logger = new Logger(ForecastingService.name);

  constructor(
    @InjectRepository(Forecast)
    private forecastRepository: Repository<Forecast>,
    @InjectRepository(ForecastScenario)
    private scenarioRepository: Repository<ForecastScenario>,
    @InjectRepository(ForecastAccuracyLog)
    private accuracyLogRepository: Repository<ForecastAccuracyLog>,
    @InjectRepository(SeasonalEvent)
    private seasonalEventRepository: Repository<SeasonalEvent>,
  ) {}

  // Forecast Management
  async generateForecasts(workspaceId: string, horizonDays: number = 30): Promise<Forecast[]> {
    this.logger.log(`Generating forecasts for workspace ${workspaceId} with ${horizonDays}-day horizon`);

    const forecastDate = new Date();
    const forecasts: Forecast[] = [];
    const metricTypes: Array<'ROAS' | 'REVENUE' | 'SPEND' | 'CONVERSIONS' | 'CPA'> = [
      'ROAS',
      'REVENUE',
      'SPEND',
      'CONVERSIONS',
      'CPA',
    ];

    // Get seasonal events that overlap with forecast period
    const seasonalEvents = await this.getSeasonalEventsForPeriod(
      workspaceId,
      forecastDate,
      new Date(forecastDate.getTime() + horizonDays * 24 * 60 * 60 * 1000),
    );

    // Generate forecasts for each day and metric
    for (let dayOffset = 1; dayOffset <= horizonDays; dayOffset++) {
      const targetDate = new Date(forecastDate);
      targetDate.setDate(targetDate.getDate() + dayOffset);

      for (const metricType of metricTypes) {
        // Simulate ML model prediction (in production, this would call actual ML model)
        const prediction = await this.predictMetric(
          workspaceId,
          metricType,
          targetDate,
          seasonalEvents,
        );

        const forecast = this.forecastRepository.create({
          workspaceId,
          forecastDate,
          targetDate,
          metricType,
          predictedValue: prediction.value,
          confidenceInterval80Lower: prediction.ci80Lower,
          confidenceInterval80Upper: prediction.ci80Upper,
          confidenceInterval95Lower: prediction.ci95Lower,
          confidenceInterval95Upper: prediction.ci95Upper,
          modelVersion: 'v1.0.0',
          modelMetadata: {
            features: prediction.features,
            confidence: prediction.confidence,
            seasonalFactors: prediction.seasonalFactors,
          },
          status: 'COMPLETED',
        });

        forecasts.push(forecast);
      }
    }

    return await this.forecastRepository.save(forecasts);
  }

  private async predictMetric(
    workspaceId: string,
    metricType: string,
    targetDate: Date,
    seasonalEvents: SeasonalEvent[],
  ): Promise<any> {
    // Simulated prediction logic - in production, this would call ML model
    // This is a placeholder that generates realistic-looking forecasts

    const baseValues = {
      ROAS: 3.2,
      REVENUE: 50000,
      SPEND: 15000,
      CONVERSIONS: 150,
      CPA: 100,
    };

    const baseValue = baseValues[metricType] || 1000;

    // Add some randomness and trend
    const dayOfWeek = targetDate.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.85 : 1.0;
    const trendFactor = 1 + Math.random() * 0.1 - 0.05; // -5% to +5%

    // Apply seasonal event impact
    let seasonalFactor = 1.0;
    for (const event of seasonalEvents) {
      if (
        targetDate >= event.startDate &&
        targetDate <= event.endDate &&
        event.applyToForecasting
      ) {
        seasonalFactor *= event.expectedImpactMultiplier || 1.0;
      }
    }

    const predictedValue = baseValue * weekendFactor * trendFactor * seasonalFactor;

    // Calculate confidence intervals
    const variance = predictedValue * 0.15; // 15% variance
    const ci80Lower = predictedValue - variance * 1.28;
    const ci80Upper = predictedValue + variance * 1.28;
    const ci95Lower = predictedValue - variance * 1.96;
    const ci95Upper = predictedValue + variance * 1.96;

    return {
      value: Math.round(predictedValue * 100) / 100,
      ci80Lower: Math.round(ci80Lower * 100) / 100,
      ci80Upper: Math.round(ci80Upper * 100) / 100,
      ci95Lower: Math.round(ci95Lower * 100) / 100,
      ci95Upper: Math.round(ci95Upper * 100) / 100,
      confidence: 0.85,
      features: ['historical_trend', 'day_of_week', 'seasonal_events'],
      seasonalFactors: seasonalEvents.map((e) => e.name),
    };
  }

  async getForecasts(
    workspaceId: string,
    startDate: Date,
    endDate: Date,
    metricType?: string,
  ): Promise<Forecast[]> {
    const query = this.forecastRepository
      .createQueryBuilder('forecast')
      .where('forecast.workspaceId = :workspaceId', { workspaceId })
      .andWhere('forecast.targetDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('forecast.targetDate', 'ASC');

    if (metricType) {
      query.andWhere('forecast.metricType = :metricType', { metricType });
    }

    return await query.getMany();
  }

  async getLatestForecasts(workspaceId: string, horizonDays: number = 30): Promise<Forecast[]> {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + horizonDays);

    // Get the most recent forecast date
    const latestForecast = await this.forecastRepository
      .createQueryBuilder('forecast')
      .where('forecast.workspaceId = :workspaceId', { workspaceId })
      .orderBy('forecast.forecastDate', 'DESC')
      .getOne();

    if (!latestForecast) {
      return [];
    }

    return this.forecastRepository.find({
      where: {
        workspaceId,
        forecastDate: latestForecast.forecastDate,
        targetDate: Between(today, endDate),
      },
      order: { targetDate: 'ASC', metricType: 'ASC' },
    });
  }

  // Scenario Management
  async createScenario(dto: CreateScenarioDto): Promise<ForecastScenario> {
    const scenario = this.scenarioRepository.create({
      ...dto,
      status: 'DRAFT',
    });

    return await this.scenarioRepository.save(scenario);
  }

  async calculateScenario(scenarioId: string): Promise<ForecastScenario> {
    const scenario = await this.scenarioRepository.findOne({ where: { id: scenarioId } });

    if (!scenario) {
      throw new Error(`Scenario ${scenarioId} not found`);
    }

    // Get baseline forecasts
    const baselineForecasts = await this.getLatestForecasts(scenario.workspaceId, 30);

    // Calculate predicted outcomes based on adjustments
    const predictedOutcomes = await this.calculateScenarioOutcomes(
      scenario.workspaceId,
      scenario.adjustments,
      baselineForecasts,
    );

    scenario.predictedOutcomes = predictedOutcomes;
    scenario.calculatedAt = new Date();
    scenario.status = 'CALCULATED';

    return await this.scenarioRepository.save(scenario);
  }

  private async calculateScenarioOutcomes(
    workspaceId: string,
    adjustments: any[],
    baselineForecasts: Forecast[],
  ): Promise<any[]> {
    // Group forecasts by metric type
    const forecastsByMetric = baselineForecasts.reduce((acc, forecast) => {
      if (!acc[forecast.metricType]) {
        acc[forecast.metricType] = [];
      }
      acc[forecast.metricType].push(forecast);
      return acc;
    }, {} as Record<string, Forecast[]>);

    const outcomes = [];

    // Calculate impact for each metric
    for (const [metricType, forecasts] of Object.entries(forecastsByMetric)) {
      const baselineValue = forecasts.reduce((sum, f) => sum + Number(f.predictedValue), 0);

      // Apply adjustments to calculate new predicted value
      let adjustmentFactor = 1.0;

      for (const adjustment of adjustments) {
        if (adjustment.type === 'BUDGET_INCREASE') {
          adjustmentFactor *= adjustment.unit === 'PERCENTAGE' ? 1 + adjustment.value / 100 : 1.2;
        } else if (adjustment.type === 'BUDGET_DECREASE') {
          adjustmentFactor *= adjustment.unit === 'PERCENTAGE' ? 1 - adjustment.value / 100 : 0.8;
        }
      }

      const predictedValue = baselineValue * adjustmentFactor;
      const change = predictedValue - baselineValue;
      const changePercentage = (change / baselineValue) * 100;

      // Calculate new confidence intervals with increased uncertainty
      const avgForecast = forecasts[0];
      const variance = predictedValue * 0.2; // 20% variance for scenarios

      outcomes.push({
        metricType,
        baselineValue: Math.round(baselineValue * 100) / 100,
        predictedValue: Math.round(predictedValue * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercentage: Math.round(changePercentage * 100) / 100,
        confidenceInterval80Lower: Math.round((predictedValue - variance * 1.28) * 100) / 100,
        confidenceInterval80Upper: Math.round((predictedValue + variance * 1.28) * 100) / 100,
        confidenceInterval95Lower: Math.round((predictedValue - variance * 1.96) * 100) / 100,
        confidenceInterval95Upper: Math.round((predictedValue + variance * 1.96) * 100) / 100,
      });
    }

    return outcomes;
  }

  async listScenarios(workspaceId: string): Promise<ForecastScenario[]> {
    return await this.scenarioRepository.find({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
    });
  }

  async getScenario(id: string): Promise<ForecastScenario> {
    const scenario = await this.scenarioRepository.findOne({ where: { id } });
    if (!scenario) {
      throw new Error(`Scenario ${id} not found`);
    }
    return scenario;
  }

  async deleteScenario(id: string): Promise<void> {
    await this.scenarioRepository.delete(id);
  }

  // Accuracy Tracking
  async evaluateForecastAccuracy(workspaceId: string, targetDate: Date): Promise<void> {
    this.logger.log(`Evaluating forecast accuracy for ${workspaceId} on ${targetDate}`);

    // Get forecasts for this target date
    const forecasts = await this.forecastRepository.find({
      where: {
        workspaceId,
        targetDate,
      },
    });

    for (const forecast of forecasts) {
      // In production, fetch actual values from campaign data
      // For now, simulate actual values
      const actualValue = Number(forecast.predictedValue) * (0.9 + Math.random() * 0.2);

      const absoluteError = Math.abs(actualValue - Number(forecast.predictedValue));
      const percentageError = (absoluteError / actualValue) * 100;

      const withinCI80 =
        actualValue >= Number(forecast.confidenceInterval80Lower) &&
        actualValue <= Number(forecast.confidenceInterval80Upper);
      const withinCI95 =
        actualValue >= Number(forecast.confidenceInterval95Lower) &&
        actualValue <= Number(forecast.confidenceInterval95Upper);

      const accuracyLog = this.accuracyLogRepository.create({
        forecastId: forecast.id,
        workspaceId,
        actualValue,
        predictedValue: Number(forecast.predictedValue),
        absoluteError,
        percentageError,
        mape: percentageError,
        rmse: Math.sqrt(Math.pow(absoluteError, 2)),
        withinConfidenceInterval80: withinCI80,
        withinConfidenceInterval95: withinCI95,
        evaluatedAt: new Date(),
      });

      await this.accuracyLogRepository.save(accuracyLog);
    }
  }

  async getForecastAccuracy(
    workspaceId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    overallMAPE: number;
    overallRMSE: number;
    ci80Coverage: number;
    ci95Coverage: number;
    byMetric: Record<string, any>;
  }> {
    const logs = await this.accuracyLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.forecast', 'forecast')
      .where('log.workspaceId = :workspaceId', { workspaceId })
      .andWhere('log.evaluatedAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();

    if (logs.length === 0) {
      return {
        overallMAPE: 0,
        overallRMSE: 0,
        ci80Coverage: 0,
        ci95Coverage: 0,
        byMetric: {},
      };
    }

    const totalMAPE = logs.reduce((sum, log) => sum + Number(log.mape), 0);
    const totalRMSE = logs.reduce((sum, log) => sum + Number(log.rmse), 0);
    const ci80Count = logs.filter((log) => log.withinConfidenceInterval80).length;
    const ci95Count = logs.filter((log) => log.withinConfidenceInterval95).length;

    // Group by metric type
    const byMetric = logs.reduce((acc, log) => {
      const metricType = log.forecast.metricType;
      if (!acc[metricType]) {
        acc[metricType] = {
          count: 0,
          mape: 0,
          rmse: 0,
          ci80Coverage: 0,
          ci95Coverage: 0,
        };
      }
      acc[metricType].count++;
      acc[metricType].mape += Number(log.mape);
      acc[metricType].rmse += Number(log.rmse);
      if (log.withinConfidenceInterval80) acc[metricType].ci80Coverage++;
      if (log.withinConfidenceInterval95) acc[metricType].ci95Coverage++;
      return acc;
    }, {} as Record<string, any>);

    // Calculate averages
    for (const metric of Object.values(byMetric)) {
      metric.mape /= metric.count;
      metric.rmse /= metric.count;
      metric.ci80Coverage = (metric.ci80Coverage / metric.count) * 100;
      metric.ci95Coverage = (metric.ci95Coverage / metric.count) * 100;
    }

    return {
      overallMAPE: totalMAPE / logs.length,
      overallRMSE: totalRMSE / logs.length,
      ci80Coverage: (ci80Count / logs.length) * 100,
      ci95Coverage: (ci95Count / logs.length) * 100,
      byMetric,
    };
  }

  // Seasonal Events
  async createSeasonalEvent(dto: CreateSeasonalEventDto): Promise<SeasonalEvent> {
    const event = this.seasonalEventRepository.create(dto);
    return await this.seasonalEventRepository.save(event);
  }

  async listSeasonalEvents(workspaceId: string): Promise<SeasonalEvent[]> {
    return await this.seasonalEventRepository.find({
      where: { workspaceId },
      order: { startDate: 'ASC' },
    });
  }

  async getSeasonalEventsForPeriod(
    workspaceId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<SeasonalEvent[]> {
    return await this.seasonalEventRepository
      .createQueryBuilder('event')
      .where('event.workspaceId = :workspaceId', { workspaceId })
      .andWhere('event.startDate <= :endDate', { endDate })
      .andWhere('event.endDate >= :startDate', { startDate })
      .getMany();
  }

  async updateSeasonalEvent(
    id: string,
    updates: Partial<CreateSeasonalEventDto>,
  ): Promise<SeasonalEvent> {
    await this.seasonalEventRepository.update(id, updates);
    const event = await this.seasonalEventRepository.findOne({ where: { id } });
    if (!event) {
      throw new Error(`Seasonal event ${id} not found`);
    }
    return event;
  }

  async deleteSeasonalEvent(id: string): Promise<void> {
    await this.seasonalEventRepository.delete(id);
  }
}
