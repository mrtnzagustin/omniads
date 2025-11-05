import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TouchpointEvent } from '../database/entities/touchpoint-event.entity';
import { ConversionPath } from '../database/entities/conversion-path.entity';
import { AttributionResult } from '../database/entities/attribution-result.entity';
import * as crypto from 'crypto';

type AttributionModel = 'LAST_CLICK' | 'FIRST_CLICK' | 'LINEAR' | 'TIME_DECAY' | 'POSITION_BASED' | 'CUSTOM';

@Injectable()
export class AttributionService {
  private readonly logger = new Logger(AttributionService.name);

  constructor(
    @InjectRepository(TouchpointEvent)
    private touchpointRepository: Repository<TouchpointEvent>,
    @InjectRepository(ConversionPath)
    private conversionPathRepository: Repository<ConversionPath>,
    @InjectRepository(AttributionResult)
    private attributionResultRepository: Repository<AttributionResult>,
  ) {}

  /**
   * Track a new touchpoint event
   */
  async trackTouchpoint(data: {
    userId: string;
    channel: string;
    campaignId?: string;
    adId?: string;
    sessionId: string;
    eventType: 'IMPRESSION' | 'CLICK' | 'VIEW';
    metadata?: Record<string, any>;
  }): Promise<TouchpointEvent> {
    const touchpoint = this.touchpointRepository.create(data);
    return this.touchpointRepository.save(touchpoint);
  }

  /**
   * Record a conversion and build the conversion path
   */
  async recordConversion(
    userId: string,
    workspaceId: string,
    revenue: number,
    lookbackDays: number = 30
  ): Promise<ConversionPath> {
    const lookbackDate = new Date();
    lookbackDate.setDate(lookbackDate.getDate() - lookbackDays);

    // Get all touchpoints for this user in lookback window
    const touchpoints = await this.touchpointRepository.find({
      where: {
        userId,
        timestamp: Between(lookbackDate, new Date()),
      },
      order: { timestamp: 'ASC' },
    });

    const touchpointData = touchpoints.map(t => ({
      channel: t.channel,
      campaignId: t.campaignId,
      timestamp: t.timestamp.toISOString(),
      eventType: t.eventType,
    }));

    // Create path hash for grouping
    const pathHash = this.createPathHash(touchpointData.map(t => t.channel));

    const conversionPath = this.conversionPathRepository.create({
      userId,
      workspaceId,
      touchpoints: touchpointData,
      totalRevenue: revenue,
      pathHash,
    });

    return this.conversionPathRepository.save(conversionPath);
  }

  /**
   * Calculate attribution for all models
   */
  async calculateAttribution(
    workspaceId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AttributionResult[]> {
    this.logger.log(`Calculating attribution for workspace ${workspaceId} from ${startDate} to ${endDate}`);

    const conversions = await this.conversionPathRepository.find({
      where: {
        workspaceId,
        conversionTimestamp: Between(startDate, endDate),
      },
    });

    const models: AttributionModel[] = [
      'LAST_CLICK',
      'FIRST_CLICK',
      'LINEAR',
      'TIME_DECAY',
      'POSITION_BASED',
    ];

    const results: AttributionResult[] = [];

    for (const model of models) {
      const channelAttribution = this.calculateModelAttribution(conversions, model);

      for (const [channel, data] of Object.entries(channelAttribution)) {
        const result = this.attributionResultRepository.create({
          workspaceId,
          channel,
          model,
          attributedRevenue: data.revenue,
          attributedConversions: data.conversions,
          attributedROAS: data.roas,
          assistRate: data.assistRate,
          dateStart: startDate,
          dateEnd: endDate,
        });

        results.push(await this.attributionResultRepository.save(result));
      }
    }

    return results;
  }

  /**
   * Calculate attribution for a specific model
   */
  private calculateModelAttribution(
    conversions: ConversionPath[],
    model: AttributionModel
  ): Record<string, { revenue: number; conversions: number; roas: number; assistRate: number }> {
    const channelData: Record<string, { revenue: number; conversions: number; assists: number; total: number }> = {};

    for (const conversion of conversions) {
      if (conversion.touchpoints.length === 0) continue;

      const weights = this.calculateWeights(conversion.touchpoints.length, model);

      conversion.touchpoints.forEach((touchpoint, index) => {
        const channel = touchpoint.channel;

        if (!channelData[channel]) {
          channelData[channel] = { revenue: 0, conversions: 0, assists: 0, total: 0 };
        }

        const weight = weights[index];
        channelData[channel].revenue += conversion.totalRevenue * weight;
        channelData[channel].conversions += weight;

        // Track assists (touchpoints that aren't last click)
        if (index < conversion.touchpoints.length - 1) {
          channelData[channel].assists += 1;
        }

        channelData[channel].total += 1;
      });
    }

    // Calculate final metrics
    const result: Record<string, any> = {};
    for (const [channel, data] of Object.entries(channelData)) {
      result[channel] = {
        revenue: Math.round(data.revenue * 100) / 100,
        conversions: Math.round(data.conversions * 100) / 100,
        roas: Math.round((data.revenue / 1000) * 100) / 100, // Simplified ROAS calc
        assistRate: data.total > 0 ? Math.round((data.assists / data.total) * 10000) / 100 : 0,
      };
    }

    return result;
  }

  /**
   * Calculate weights for touchpoints based on attribution model
   */
  private calculateWeights(touchpointCount: number, model: AttributionModel): number[] {
    const weights = new Array(touchpointCount).fill(0);

    switch (model) {
      case 'LAST_CLICK':
        weights[touchpointCount - 1] = 1;
        break;

      case 'FIRST_CLICK':
        weights[0] = 1;
        break;

      case 'LINEAR':
        weights.fill(1 / touchpointCount);
        break;

      case 'TIME_DECAY':
        // 7-day half-life time decay
        for (let i = 0; i < touchpointCount; i++) {
          weights[i] = Math.pow(2, -(touchpointCount - 1 - i) / 7);
        }
        const sum = weights.reduce((a, b) => a + b, 0);
        for (let i = 0; i < touchpointCount; i++) {
          weights[i] /= sum;
        }
        break;

      case 'POSITION_BASED':
        // 40% first, 40% last, 20% distributed to middle
        if (touchpointCount === 1) {
          weights[0] = 1;
        } else if (touchpointCount === 2) {
          weights[0] = 0.5;
          weights[1] = 0.5;
        } else {
          weights[0] = 0.4;
          weights[touchpointCount - 1] = 0.4;
          const middleWeight = 0.2 / (touchpointCount - 2);
          for (let i = 1; i < touchpointCount - 1; i++) {
            weights[i] = middleWeight;
          }
        }
        break;
    }

    return weights;
  }

  /**
   * Get attribution results for a workspace
   */
  async getAttributionResults(
    workspaceId: string,
    model: AttributionModel,
    startDate: Date,
    endDate: Date
  ): Promise<AttributionResult[]> {
    return this.attributionResultRepository.find({
      where: {
        workspaceId,
        model,
        dateStart: startDate,
        dateEnd: endDate,
      },
    });
  }

  /**
   * Get top customer journey paths
   */
  async getTopJourneyPaths(
    workspaceId: string,
    startDate: Date,
    endDate: Date,
    limit: number = 20
  ): Promise<any[]> {
    const conversions = await this.conversionPathRepository.find({
      where: {
        workspaceId,
        conversionTimestamp: Between(startDate, endDate),
      },
    });

    // Group by path hash
    const pathGroups: Record<string, { count: number; revenue: number; paths: string[] }> = {};

    for (const conversion of conversions) {
      const hash = conversion.pathHash;
      if (!pathGroups[hash]) {
        pathGroups[hash] = {
          count: 0,
          revenue: 0,
          paths: conversion.touchpoints.map(t => t.channel),
        };
      }
      pathGroups[hash].count += 1;
      pathGroups[hash].revenue += Number(conversion.totalRevenue);
    }

    // Convert to array and sort by frequency
    const sortedPaths = Object.entries(pathGroups)
      .map(([hash, data]) => ({
        path: data.paths.join(' → '),
        frequency: data.count,
        totalRevenue: data.revenue,
        avgRevenue: data.revenue / data.count,
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);

    return sortedPaths;
  }

  /**
   * Create a hash for a conversion path
   */
  private createPathHash(channels: string[]): string {
    return crypto.createHash('md5').update(channels.join('→')).digest('hex');
  }
}
