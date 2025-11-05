#!/bin/bash

# Array of features
declare -a features=(
  "129:incremental-lift-measurement:IncrementalLiftMeasurement:IncrementalLiftMeasurement"
  "130:profit-analytics-dashboard:ProfitAnalyticsDashboard:ProfitAnalyticsDashboard"
  "131:realtime-bid-optimizer:RealtimeBidOptimizer:RealtimeBidOptimizer"
  "132:multi-platform-creative-generator:MultiPlatformCreativeGenerator:MultiPlatformCreativeGenerator"
  "133:customer-journey-mapper:CustomerJourneyMapper:CustomerJourneyMapper"
  "134:predictive-ltv-segments:PredictiveLtvSegments:PredictiveLtvSegments"
  "135:social-commerce-hub:SocialCommerceHub:SocialCommerceHub"
  "136:influencer-campaign-manager:InfluencerCampaignManager:InfluencerCampaignManager"
  "137:sms-marketing-integration:SmsMarketingIntegration:SmsMarketingIntegration"
  "138:email-ad-sync-engine:EmailAdSyncEngine:EmailAdSyncEngine"
  "139:advanced-ab-test-framework:AdvancedAbTestFramework:AdvancedAbTestFramework"
  "140:white-label-dashboard:WhiteLabelDashboard:WhiteLabelDashboard"
  "141:multi-currency-manager:MultiCurrencyManager:MultiCurrencyManager"
  "142:data-warehouse-connector:DataWarehouseConnector:DataWarehouseConnector"
  "143:server-side-tracking:ServerSideTracking:ServerSideTracking"
  "144:creative-performance-ai:CreativePerformanceAi:CreativePerformanceAi"
  "145:budget-pacing-controller:BudgetPacingController:BudgetPacingController"
  "146:audience-overlap-analyzer:AudienceOverlapAnalyzer:AudienceOverlapAnalyzer"
  "147:cross-device-attribution:CrossDeviceAttribution:CrossDeviceAttribution"
)

BACKEND_SRC="/home/user/omniads/backend/src"

for feature_data in "${features[@]}"; do
  IFS=':' read -r number folder class_name entity_name <<< "$feature_data"

  echo "📝 Creating tests for feature ${number}: ${entity_name}..."

  feature_dir="${BACKEND_SRC}/${folder}"

  # Create Service Test
  cat > "${feature_dir}/${folder}.service.spec.ts" << 'SERVICETEST'
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SERVICE_NAME } from './FOLDER_NAME.service';
import { ENTITY_NAME } from '../database/entities/FOLDER_NAME.entity';

describe('SERVICE_NAME', () => {
  let service: SERVICE_NAME;
  let repository: Repository<ENTITY_NAME>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockEntity: Partial<ENTITY_NAME> = {
    id: '123',
    userId: 'user1',
    name: 'Test Entity',
    description: 'Test Description',
    configuration: {
      enabled: true,
      settings: {},
    },
    metrics: {
      totalProcessed: 100,
      successRate: 95,
      lastRun: new Date(),
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SERVICE_NAME,
        {
          provide: getRepositoryToken(ENTITY_NAME),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SERVICE_NAME>(SERVICE_NAME);
    repository = module.get<Repository<ENTITY_NAME>>(getRepositoryToken(ENTITY_NAME));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new entity', async () => {
      mockRepository.create.mockReturnValue(mockEntity);
      mockRepository.save.mockResolvedValue(mockEntity);

      const result = await service.create('user1', {
        name: 'Test Entity',
        description: 'Test Description',
      });

      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(mockEntity);
      expect(result).toEqual(mockEntity);
    });
  });

  describe('findAllByUser', () => {
    it('should return all entities for a user', async () => {
      mockRepository.find.mockResolvedValue([mockEntity]);

      const result = await service.findAllByUser('user1');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockEntity]);
    });

    it('should return empty array if no entities found', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAllByUser('user1');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single entity', async () => {
      mockRepository.findOne.mockResolvedValue(mockEntity);

      const result = await service.findOne('123');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(result).toEqual(mockEntity);
    });

    it('should throw NotFoundException if entity not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an entity', async () => {
      const updatedEntity = { ...mockEntity, name: 'Updated Name' };
      mockRepository.findOne.mockResolvedValue(mockEntity);
      mockRepository.save.mockResolvedValue(updatedEntity);

      const result = await service.update('123', { name: 'Updated Name' });

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException if entity not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('999', { name: 'Updated' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an entity', async () => {
      mockRepository.findOne.mockResolvedValue(mockEntity);
      mockRepository.remove.mockResolvedValue(mockEntity);

      await service.delete('123');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockEntity);
    });

    it('should throw NotFoundException if entity not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('analyze', () => {
    it('should return analysis for an entity', async () => {
      mockRepository.findOne.mockResolvedValue(mockEntity);

      const result = await service.analyze('123');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('insights');
      expect(result).toHaveProperty('nextSteps');
      expect(result.recommendations).toBeInstanceOf(Array);
      expect(result.insights).toBeInstanceOf(Array);
    });

    it('should throw NotFoundException if entity not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.analyze('999')).rejects.toThrow(NotFoundException);
    });
  });
});
SERVICETEST

  # Replace placeholders in service test
  sed -i "s/SERVICE_NAME/${class_name}Service/g" "${feature_dir}/${folder}.service.spec.ts"
  sed -i "s/ENTITY_NAME/${entity_name}/g" "${feature_dir}/${folder}.service.spec.ts"
  sed -i "s/FOLDER_NAME/${folder}/g" "${feature_dir}/${folder}.service.spec.ts"

  # Create Controller Test
  cat > "${feature_dir}/${folder}.controller.spec.ts" << 'CONTROLLERTEST'
import { Test, TestingModule } from '@nestjs/testing';
import { CONTROLLER_NAME } from './FOLDER_NAME.controller';
import { SERVICE_NAME } from './FOLDER_NAME.service';
import { ENTITY_NAME } from '../database/entities/FOLDER_NAME.entity';

describe('CONTROLLER_NAME', () => {
  let controller: CONTROLLER_NAME;
  let service: SERVICE_NAME;

  const mockService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    analyze: jest.fn(),
  };

  const mockEntity: Partial<ENTITY_NAME> = {
    id: '123',
    userId: 'user1',
    name: 'Test Entity',
    description: 'Test Description',
    configuration: {
      enabled: true,
      settings: {},
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CONTROLLER_NAME],
      providers: [
        {
          provide: SERVICE_NAME,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CONTROLLER_NAME>(CONTROLLER_NAME);
    service = module.get<SERVICE_NAME>(SERVICE_NAME);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new entity', async () => {
      mockService.create.mockResolvedValue(mockEntity);

      const result = await controller.create({
        userId: 'user1',
        data: { name: 'Test Entity', description: 'Test Description' },
      });

      expect(service.create).toHaveBeenCalledWith('user1', {
        name: 'Test Entity',
        description: 'Test Description',
      });
      expect(result).toEqual(mockEntity);
    });
  });

  describe('findAllByUser', () => {
    it('should return all entities for a user', async () => {
      mockService.findAllByUser.mockResolvedValue([mockEntity]);

      const result = await controller.findAllByUser('user1');

      expect(service.findAllByUser).toHaveBeenCalledWith('user1');
      expect(result).toEqual([mockEntity]);
    });
  });

  describe('findOne', () => {
    it('should return a single entity', async () => {
      mockService.findOne.mockResolvedValue(mockEntity);

      const result = await controller.findOne('123');

      expect(service.findOne).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockEntity);
    });
  });

  describe('analyze', () => {
    it('should return analysis for an entity', async () => {
      const mockAnalysis = {
        summary: 'Test Analysis',
        recommendations: [],
        insights: [],
      };
      mockService.analyze.mockResolvedValue(mockAnalysis);

      const result = await controller.analyze('123');

      expect(service.analyze).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockAnalysis);
    });
  });

  describe('update', () => {
    it('should update an entity', async () => {
      const updatedEntity = { ...mockEntity, name: 'Updated Name' };
      mockService.update.mockResolvedValue(updatedEntity);

      const result = await controller.update('123', { name: 'Updated Name' });

      expect(service.update).toHaveBeenCalledWith('123', { name: 'Updated Name' });
      expect(result).toEqual(updatedEntity);
    });
  });

  describe('delete', () => {
    it('should delete an entity', async () => {
      mockService.delete.mockResolvedValue(undefined);

      const result = await controller.delete('123');

      expect(service.delete).toHaveBeenCalledWith('123');
      expect(result).toEqual({ message: 'Deleted successfully' });
    });
  });
});
CONTROLLERTEST

  # Replace placeholders in controller test
  sed -i "s/CONTROLLER_NAME/${class_name}Controller/g" "${feature_dir}/${folder}.controller.spec.ts"
  sed -i "s/SERVICE_NAME/${class_name}Service/g" "${feature_dir}/${folder}.controller.spec.ts"
  sed -i "s/ENTITY_NAME/${entity_name}/g" "${feature_dir}/${folder}.controller.spec.ts"
  sed -i "s/FOLDER_NAME/${folder}/g" "${feature_dir}/${folder}.controller.spec.ts"

  echo "✅ Created tests for feature ${number}"
done

echo ""
echo "🎉 All test files created successfully!"
