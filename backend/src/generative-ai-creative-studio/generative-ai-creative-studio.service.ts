import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenerativeAiCreativeStudio } from '../database/entities/generative-ai-creative-studio.entity';

@Injectable()
export class GenerativeAiCreativeStudioService {
  constructor(
    @InjectRepository(GenerativeAiCreativeStudio)
    private readonly repository: Repository<GenerativeAiCreativeStudio>,
  ) {}

  async create(userId: string, data: Partial<GenerativeAiCreativeStudio>): Promise<GenerativeAiCreativeStudio> {
    const entity = this.repository.create({
      userId,
      ...data,
      configuration: {
        enabled: true,
        aiProvider: 'openai',
        model: 'gpt-4',
        imageModel: 'dall-e-3',
        creativesPerBatch: 5,
        autoPublish: false,
        platforms: ['meta', 'google', 'tiktok'],
        brandGuidelines: {},
        settings: {},
        ...data.configuration,
      },
      status: 'active',
    });

    return await this.repository.save(entity);
  }

  async findAllByUser(userId: string): Promise<GenerativeAiCreativeStudio[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<GenerativeAiCreativeStudio> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Generative AI Creative Studio with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: string, data: Partial<GenerativeAiCreativeStudio>): Promise<GenerativeAiCreativeStudio> {
    const entity = await this.findOne(id);
    Object.assign(entity, data);
    return await this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }

  async analyze(id: string): Promise<any> {
    const entity = await this.findOne(id);

    // Simulate AI-powered creative generation analysis
    const analysis = {
      summary: 'Generative AI Creative Studio Analysis',
      configuration: entity.configuration,
      performance: {
        totalCreatives: entity.metrics?.totalCreatives || 0,
        successRate: entity.metrics?.successRate || 0,
        avgGenerationTime: entity.metrics?.avgGenerationTime || 0,
        costSavings: entity.metrics?.costSavings || 0,
      },
      recommendations: [
        {
          type: 'optimization',
          priority: 'high',
          message: 'Increase creativesPerBatch to 10 for better efficiency',
          impact: '20% faster production',
        },
        {
          type: 'creative',
          priority: 'medium',
          message: 'Add brand guidelines for more consistent outputs',
          impact: 'Better brand alignment',
        },
        {
          type: 'platform',
          priority: 'medium',
          message: 'Enable auto-publish for faster campaign launches',
          impact: '50% faster time-to-market',
        },
      ],
      insights: [
        `Generated ${entity.metrics?.totalCreatives || 0} creatives with ${entity.metrics?.successRate || 95}% success rate`,
        `Average generation time: ${entity.metrics?.avgGenerationTime || 12} seconds`,
        `Cost savings vs manual: $${entity.metrics?.costSavings || 0}`,
        'AI-powered creative generation is 60% faster than traditional methods',
      ],
      nextSteps: [
        'Review and refine brand guidelines',
        'Test generated creatives with A/B testing',
        'Monitor performance across platforms',
        'Adjust AI model settings for optimal results',
      ],
    };

    return analysis;
  }
}
