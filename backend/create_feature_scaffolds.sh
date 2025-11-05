#!/bin/bash

# Script to generate scaffold for features 069-087

FEATURES=(
  "069:ai-creative-testing-arena:AICreativeTestingArena"
  "070:sentiment-driven-budget-allocator:SentimentDrivenBudgetAllocator"
  "071:competitive-ad-intelligence-cloner:CompetitiveAdIntelligenceCloner"
  "072:roas-guarantee-engine:ROASGuaranteeEngine"
  "073:influencer-performance-predictor:InfluencerPerformancePredictor"
  "074:dynamic-landing-page-generator:DynamicLandingPageGenerator"
  "075:smart-creative-auto-refresh:SmartCreativeAutoRefresh"
  "076:voice-search-ad-optimizer:VoiceSearchAdOptimizer"
  "077:retail-media-network-hub:RetailMediaNetworkHub"
  "078:ai-copywriter-multivariate:AICopywriterMultivariate"
  "079:cross-platform-symphony-integration:CrossPlatformSymphonyIntegration"
  "080:smart-budget-insurance-pool:SmartBudgetInsurancePool"
  "081:realtime-competitor-bid-monitor:RealtimeCompetitorBidMonitor"
  "082:unified-social-inbox:UnifiedSocialInbox"
  "083:ai-max-campaign-replicator:AIMaxCampaignReplicator"
  "084:customer-lifecycle-journey-mapper:CustomerLifecycleJourneyMapper"
  "085:cross-platform-broad-match-optimizer:CrossPlatformBroadMatchOptimizer"
  "086:sustainability-ad-impact-scorer:SustainabilityAdImpactScorer"
  "087:first-party-data-enrichment-hub:FirstPartyDataEnrichmentHub"
)

for feature in "${FEATURES[@]}"; do
  IFS=':' read -r number slug className <<< "$feature"

  DIR="/home/user/omniads/backend/src/${slug}"
  mkdir -p "$DIR"

  # Create Entity
  cat > "$DIR/${slug}.entity.ts" << EOF
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('${slug//-/_}')
export class ${className} {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  config: any;

  @Column({ type: 'jsonb', nullable: true })
  results: any;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
EOF

  # Create Service
  cat > "$DIR/${slug}.service.ts" << EOF
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${className} } from './${slug}.entity';

@Injectable()
export class ${className}Service {
  private readonly logger = new Logger(${className}Service.name);

  constructor(
    @InjectRepository(${className})
    private repository: Repository<${className}>,
  ) {}

  async findAll(): Promise<${className}[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<${className} | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<${className}>): Promise<${className}> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<${className}>): Promise<${className}> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(\`${className} \${id} not found\`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(\`Processing ${className} \${id}\`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(\`${className} \${id} not found\`);
    }
    // Feature-specific processing logic
    const results = {
      processed: true,
      timestamp: new Date(),
      data: entity.config,
    };
    await this.update(id, { results });
    return results;
  }
}
EOF

  # Create Controller
  cat > "$DIR/${slug}.controller.ts" << EOF
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ${className}Service } from './${slug}.service';

@Controller('api/v1/${slug}')
@UseGuards(JwtAuthGuard)
export class ${className}Controller {
  constructor(private readonly service: ${className}Service) {}

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(id);
    return { success: true, data };
  }

  @Post()
  async create(@Body() body: any) {
    const data = await this.service.create(body);
    return { success: true, data };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const data = await this.service.update(id, body);
    return { success: true, data };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return { success: true };
  }

  @Post(':id/process')
  async process(@Param('id') id: string) {
    const data = await this.service.process(id);
    return { success: true, data };
  }
}
EOF

  # Create Module
  cat > "$DIR/${slug}.module.ts" << EOF
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${className}Service } from './${slug}.service';
import { ${className}Controller } from './${slug}.controller';
import { ${className} } from './${slug}.entity';

@Module({
  imports: [TypeOrmModule.forFeature([${className}])],
  providers: [${className}Service],
  controllers: [${className}Controller],
  exports: [${className}Service],
})
export class ${className}Module {}
EOF

  # Create Test
  cat > "$DIR/${slug}.service.spec.ts" << EOF
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${className}Service } from './${slug}.service';
import { ${className} } from './${slug}.entity';

describe('${className}Service', () => {
  let service: ${className}Service;
  let repository: jest.Mocked<Repository<${className}>>;

  const mockEntity: Partial<${className}> = {
    id: '1',
    name: 'Test Entity',
    config: { test: true },
    results: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ${className}Service,
        {
          provide: getRepositoryToken(${className}),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<${className}Service>(${className}Service);
    repository = module.get(getRepositoryToken(${className}));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all entities', async () => {
    repository.find.mockResolvedValue([mockEntity as ${className}]);
    const result = await service.findAll();
    expect(result).toEqual([mockEntity]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should find one entity', async () => {
    repository.findOne.mockResolvedValue(mockEntity as ${className});
    const result = await service.findOne('1');
    expect(result).toEqual(mockEntity);
  });

  it('should create entity', async () => {
    repository.create.mockReturnValue(mockEntity as ${className});
    repository.save.mockResolvedValue(mockEntity as ${className});
    const result = await service.create(mockEntity);
    expect(result).toEqual(mockEntity);
  });

  it('should process entity', async () => {
    repository.findOne.mockResolvedValue(mockEntity as ${className});
    repository.update.mockResolvedValue(undefined);
    const result = await service.process('1');
    expect(result.processed).toBe(true);
    expect(result.data).toEqual(mockEntity.config);
  });

  it('should throw error when processing non-existent entity', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.process('999')).rejects.toThrow();
  });
});
EOF

  echo "✓ Created scaffold for Feature $number: ${className}"
done

echo ""
echo "All 19 feature scaffolds created successfully!"
echo "Run 'npm test' to verify all tests pass."
