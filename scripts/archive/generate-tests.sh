#!/bin/bash

# Feature definitions: number|kebab-name|PascalName|Display Name
features=(
  "112|competitor-budget-mirror|CompetitorBudgetMirror|Competitor budget mirror"
  "113|dynamic-lookalike-generator|DynamicLookalikeGenerator|Dynamic lookalike generator"
  "114|smart-campaign-cloner|SmartCampaignCloner|Smart campaign cloner"
  "115|predictive-churn-retargeting|PredictiveChurnRetargeting|Predictive churn retargeting"
  "116|ai-seasonality-planner|AiSeasonalityPlanner|AI seasonality planner"
  "117|creative-element-mixer|CreativeElementMixer|Creative element mixer"
  "118|realtime-sentiment-optimizer|RealtimeSentimentOptimizer|Realtime sentiment optimizer"
  "119|multi-objective-balancer|MultiObjectiveBalancer|Multi-objective balancer"
  "120|intelligent-frequency-capper|IntelligentFrequencyCapper|Intelligent frequency capper"
  "121|platform-performance-allocator|PlatformPerformanceAllocator|Platform performance allocator"
  "122|ai-compliance-guardian|AiComplianceGuardian|AI compliance guardian"
  "123|predictive-lifetime-budget|PredictiveLifetimeBudget|Predictive lifetime budget manager"
  "124|cross-campaign-synthesizer|CrossCampaignSynthesizer|Cross campaign synthesizer"
  "125|dynamic-offer-optimizer|DynamicOfferOptimizer|Dynamic offer optimizer"
  "126|ai-test-designer|AiTestDesigner|AI test designer"
  "127|smart-campaign-pauser|SmartCampaignPauser|Smart campaign pauser"
)

backend_dir="/home/user/omniads/backend/src"

for feature in "${features[@]}"; do
  IFS='|' read -r number kebab pascal display <<< "$feature"

  echo "Generating tests for Feature $number: $kebab..."

  # Create service spec
  cat > "$backend_dir/$kebab/$kebab.service.spec.ts" << 'EOF'
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PASCALService } from './KEBAB.service';
import { PASCAL } from '../database/entities/KEBAB.entity';

describe('PASCALService', () => {
  let service: PASCALService;
  let repository: jest.Mocked<Repository<PASCAL>>;

  const mockEntity: Partial<PASCAL> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: 'user-1',
    name: 'Test DISPLAY',
    description: 'Test description',
    configuration: { enabled: true, settings: {} },
    metrics: { totalProcessed: 100, successRate: 0.95, lastRun: new Date() },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PASCALService,
        {
          provide: getRepositoryToken(PASCAL),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PASCALService>(PASCALService);
    repository = module.get(getRepositoryToken(PASCAL));
  });

  describe('create', () => {
    it('should successfully create entity', async () => {
      const dto = {
        userId: 'user-1',
        name: 'Test DISPLAY',
        description: 'Test description',
        configuration: { enabled: true, settings: {} }
      };

      repository.create.mockReturnValue(mockEntity as PASCAL);
      repository.save.mockResolvedValue(mockEntity as PASCAL);

      const result = await service.create(dto);

      expect(result).toEqual(mockEntity);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAllByUser', () => {
    it('should return all entities for a user', async () => {
      repository.find.mockResolvedValue([mockEntity as PASCAL]);

      const result = await service.findAllByUser('user-1');

      expect(result).toEqual([mockEntity]);
    });

    it('should return empty array when no entities found', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAllByUser('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an entity by id', async () => {
      repository.findOne.mockResolvedValue(mockEntity as PASCAL);

      const result = await service.findOne('123');

      expect(result).toEqual(mockEntity);
    });

    it('should return null when entity not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('analyze', () => {
    it('should analyze entity', async () => {
      repository.findOne.mockResolvedValue(mockEntity as PASCAL);

      const result = await service.analyze('123');

      expect(result).toBeDefined();
      expect(result.analysis).toBeDefined();
    });

    it('should throw error when entity not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.analyze('nonexistent')).rejects.toThrow('DISPLAY not found');
    });
  });

  describe('update', () => {
    it('should update entity successfully', async () => {
      const updates = { name: 'Updated Name' };
      const updatedEntity = { ...mockEntity, ...updates };

      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(updatedEntity as PASCAL);

      const result = await service.update('123', updates);

      expect(result.name).toBe('Updated Name');
    });

    it('should throw error when entity not found after update', async () => {
      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('123', {})).rejects.toThrow('DISPLAY not found after update');
    });
  });

  describe('delete', () => {
    it('should delete entity successfully', async () => {
      repository.delete.mockResolvedValue(undefined as any);

      await service.delete('123');

      expect(repository.delete).toHaveBeenCalledWith('123');
    });
  });
});
EOF

  sed -i "s/KEBAB/$kebab/g" "$backend_dir/$kebab/$kebab.service.spec.ts"
  sed -i "s/PASCAL/$pascal/g" "$backend_dir/$kebab/$kebab.service.spec.ts"
  sed -i "s/DISPLAY/$display/g" "$backend_dir/$kebab/$kebab.service.spec.ts"

  # Create controller spec
  cat > "$backend_dir/$kebab/$kebab.controller.spec.ts" << 'EOF'
import { Test, TestingModule } from '@nestjs/testing';
import { PASCALController } from './KEBAB.controller';
import { PASCALService } from './KEBAB.service';

describe('PASCALController', () => {
  let controller: PASCALController;
  let service: jest.Mocked<PASCALService>;

  const mockEntity = {
    id: '123',
    userId: 'user-1',
    name: 'Test DISPLAY',
    description: 'Test description',
    configuration: { enabled: true, settings: {} },
    metrics: null,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAllByUser: jest.fn(),
      findOne: jest.fn(),
      analyze: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PASCALController],
      providers: [
        {
          provide: PASCALService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PASCALController>(PASCALController);
    service = module.get(PASCALService);
  });

  describe('create', () => {
    it('should call service and return created entity', async () => {
      const dto = {
        userId: 'user-1',
        name: 'Test DISPLAY',
        description: 'Test description',
        configuration: { enabled: true, settings: {} }
      };

      service.create.mockResolvedValue(mockEntity as any);

      const result = await controller.create(dto);

      expect(result).toEqual(mockEntity);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should propagate service errors', async () => {
      const dto = {
        userId: 'user-1',
        name: 'Test',
        description: 'Test',
        configuration: { enabled: true, settings: {} }
      };

      service.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(dto)).rejects.toThrow('Database error');
    });
  });

  describe('findAllByUser', () => {
    it('should return all entities for a user', async () => {
      service.findAllByUser.mockResolvedValue([mockEntity as any]);

      const result = await controller.findAllByUser('user-1');

      expect(result).toEqual([mockEntity]);
    });
  });

  describe('findOne', () => {
    it('should return an entity by id', async () => {
      service.findOne.mockResolvedValue(mockEntity as any);

      const result = await controller.findOne('123');

      expect(result).toEqual(mockEntity);
    });

    it('should return null when entity not found', async () => {
      service.findOne.mockResolvedValue(null);

      const result = await controller.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('analyze', () => {
    it('should call service and return analysis', async () => {
      const analysis = { id: '123', analysis: {}, recommendations: [] };

      service.analyze.mockResolvedValue(analysis);

      const result = await controller.analyze('123');

      expect(result).toEqual(analysis);
    });

    it('should propagate service errors', async () => {
      service.analyze.mockRejectedValue(new Error('Not found'));

      await expect(controller.analyze('nonexistent')).rejects.toThrow('Not found');
    });
  });

  describe('update', () => {
    it('should call service and return updated entity', async () => {
      const updates = { name: 'Updated Name' };
      const updatedEntity = { ...mockEntity, ...updates };

      service.update.mockResolvedValue(updatedEntity as any);

      const result = await controller.update('123', updates);

      expect(result).toEqual(updatedEntity);
    });
  });

  describe('delete', () => {
    it('should call service and return success message', async () => {
      service.delete.mockResolvedValue(undefined);

      const result = await controller.delete('123');

      expect(result).toEqual({ message: 'DISPLAY deleted successfully' });
    });
  });
});
EOF

  sed -i "s/KEBAB/$kebab/g" "$backend_dir/$kebab/$kebab.controller.spec.ts"
  sed -i "s/PASCAL/$pascal/g" "$backend_dir/$kebab/$kebab.controller.spec.ts"
  sed -i "s/DISPLAY/$display/g" "$backend_dir/$kebab/$kebab.controller.spec.ts"

  echo "Generated tests for Feature $number: $kebab"
done

echo "All test files generated successfully!"
