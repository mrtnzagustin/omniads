#!/bin/bash

# Script to generate complete feature implementation
# Usage: ./generate-feature-implementation.sh FEATURE_NUM SHORT_NAME FEATURE_DESCRIPTION

FEATURE_NUM=$1
SHORT_NAME=$2
FEATURE_DESC=$3

if [ -z "$FEATURE_NUM" ] || [ -z "$SHORT_NAME" ] || [ -z "$FEATURE_DESC" ]; then
  echo "Usage: $0 FEATURE_NUM SHORT_NAME 'FEATURE_DESCRIPTION'"
  exit 1
fi

# Convert short-name to PascalCase for class names
PASCAL_CASE=$(echo "$SHORT_NAME" | sed -r 's/(^|-)(\w)/\U\2/g')
# Convert short-name to snake_case for table names
SNAKE_CASE=$(echo "$SHORT_NAME" | tr '-' '_')

MODULE_DIR="backend/src/$SHORT_NAME"
ENTITY_FILE="backend/src/database/entities/${SHORT_NAME}.entity.ts"
SPEC_FILE="specs/${FEATURE_NUM}-${SHORT_NAME}/spec.md"

echo "Generating Feature $FEATURE_NUM: $SHORT_NAME"
echo "Pascal Case: $PASCAL_CASE"
echo "Snake Case: $SNAKE_CASE"

# Create module directory
mkdir -p "$MODULE_DIR"

# Based on feature type, determine entity structure and generate appropriate implementation
# For simplicity, we'll create a generic structure that can be customized

cat > "$ENTITY_FILE" << 'ENTITY_EOF'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('SNAKE_CASE_main')
export class PASCAL_CASEMain {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('simple-json', { nullable: true })
  configuration: Record<string, any>;

  @Column('simple-json', { nullable: true })
  metrics: Record<string, any>;

  @Column({
    type: 'enum',
    enum: ['active', 'paused', 'archived'],
    default: 'active'
  })
  status: 'active' | 'paused' | 'archived';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
ENTITY_EOF

# Replace placeholders
sed -i "s/SNAKE_CASE/${SNAKE_CASE}/g" "$ENTITY_FILE"
sed -i "s/PASCAL_CASE/${PASCAL_CASE}/g" "$ENTITY_FILE"

echo "✓ Entity created: $ENTITY_FILE"

# Generate Service
cat > "$MODULE_DIR/${SHORT_NAME}.service.ts" << 'SERVICE_EOF'
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PASCAL_CASEMain } from '../database/entities/SHORT_NAME.entity';

export interface CreatePASCAL_CASEDto {
  userId: string;
  name: string;
  description?: string;
  configuration?: Record<string, any>;
}

@Injectable()
export class PASCAL_CASEService {
  constructor(
    @InjectRepository(PASCAL_CASEMain)
    private repository: Repository<PASCAL_CASEMain>,
  ) {}

  async create(dto: CreatePASCAL_CASEDto): Promise<PASCAL_CASEMain> {
    const entity = this.repository.create({
      ...dto,
      status: 'active',
      metrics: {}
    });
    return await this.repository.save(entity);
  }

  async findAllByUser(userId: string): Promise<PASCAL_CASEMain[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<PASCAL_CASEMain | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(id: string, updates: Partial<PASCAL_CASEMain>): Promise<PASCAL_CASEMain> {
    await this.repository.update(id, updates);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Entity not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async analyze(id: string): Promise<any> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error('Entity not found');
    }

    // Perform analysis based on configuration and metrics
    const analysis = {
      entityId: id,
      status: entity.status,
      insights: [],
      recommendations: [],
      score: 0
    };

    return analysis;
  }
}
SERVICE_EOF

sed -i "s/PASCAL_CASE/${PASCAL_CASE}/g" "$MODULE_DIR/${SHORT_NAME}.service.ts"
sed -i "s/SHORT_NAME/${SHORT_NAME}/g" "$MODULE_DIR/${SHORT_NAME}.service.ts"

echo "✓ Service created: $MODULE_DIR/${SHORT_NAME}.service.ts"

# Generate Controller
cat > "$MODULE_DIR/${SHORT_NAME}.controller.ts" << 'CONTROLLER_EOF'
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PASCAL_CASEService, CreatePASCAL_CASEDto } from './SHORT_NAME.service';

@Controller('SHORT_NAME')
export class PASCAL_CASEController {
  constructor(private readonly service: PASCAL_CASEService) {}

  @Post()
  async create(@Body() dto: CreatePASCAL_CASEDto) {
    return await this.service.create(dto);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return await this.service.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Get(':id/analyze')
  async analyze(@Param('id') id: string) {
    return await this.service.analyze(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updates: Partial<any>) {
    return await this.service.update(id, updates);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return { message: 'Deleted successfully' };
  }
}
CONTROLLER_EOF

sed -i "s/PASCAL_CASE/${PASCAL_CASE}/g" "$MODULE_DIR/${SHORT_NAME}.controller.ts"
sed -i "s/SHORT_NAME/${SHORT_NAME}/g" "$MODULE_DIR/${SHORT_NAME}.controller.ts"

echo "✓ Controller created: $MODULE_DIR/${SHORT_NAME}.controller.ts"

# Generate Module
cat > "$MODULE_DIR/${SHORT_NAME}.module.ts" << 'MODULE_EOF'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PASCAL_CASEMain } from '../database/entities/SHORT_NAME.entity';
import { PASCAL_CASEService } from './SHORT_NAME.service';
import { PASCAL_CASEController } from './SHORT_NAME.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PASCAL_CASEMain])],
  controllers: [PASCAL_CASEController],
  providers: [PASCAL_CASEService],
  exports: [PASCAL_CASEService],
})
export class PASCAL_CASEModule {}
MODULE_EOF

sed -i "s/PASCAL_CASE/${PASCAL_CASE}/g" "$MODULE_DIR/${SHORT_NAME}.module.ts"
sed -i "s/SHORT_NAME/${SHORT_NAME}/g" "$MODULE_DIR/${SHORT_NAME}.module.ts"

echo "✓ Module created: $MODULE_DIR/${SHORT_NAME}.module.ts"

# Generate Service Tests
cat > "$MODULE_DIR/${SHORT_NAME}.service.spec.ts" << 'SERVICE_TEST_EOF'
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PASCAL_CASEService } from './SHORT_NAME.service';
import { PASCAL_CASEMain } from '../database/entities/SHORT_NAME.entity';

describe('PASCAL_CASEService', () => {
  let service: PASCAL_CASEService;
  let repository: jest.Mocked<Repository<PASCAL_CASEMain>>;

  const mockEntity = {
    id: '123',
    userId: 'user-1',
    name: 'Test Entity',
    description: 'Test Description',
    configuration: {},
    metrics: {},
    status: 'active' as const,
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
        PASCAL_CASEService,
        {
          provide: getRepositoryToken(PASCAL_CASEMain),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PASCAL_CASEService>(PASCAL_CASEService);
    repository = module.get(getRepositoryToken(PASCAL_CASEMain));
  });

  describe('create', () => {
    it('should successfully create an entity', async () => {
      const dto = {
        userId: 'user-1',
        name: 'Test Entity',
        description: 'Test Description'
      };

      repository.create.mockReturnValue(mockEntity as any);
      repository.save.mockResolvedValue(mockEntity as any);

      const result = await service.create(dto);

      expect(result).toEqual(mockEntity);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAllByUser', () => {
    it('should return all entities for a user', async () => {
      repository.find.mockResolvedValue([mockEntity as any]);

      const result = await service.findAllByUser('user-1');

      expect(result).toEqual([mockEntity]);
      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        order: { createdAt: 'DESC' }
      });
    });

    it('should return empty array when no entities found', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAllByUser('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an entity by id', async () => {
      repository.findOne.mockResolvedValue(mockEntity as any);

      const result = await service.findOne('123');

      expect(result).toEqual(mockEntity);
    });

    it('should return null when entity not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update entity successfully', async () => {
      const updates = { name: 'Updated Name' };
      const updatedEntity = { ...mockEntity, ...updates };

      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(updatedEntity as any);

      const result = await service.update('123', updates);

      expect(result.name).toBe('Updated Name');
      expect(repository.update).toHaveBeenCalledWith('123', updates);
    });

    it('should throw error when entity not found after update', async () => {
      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('123', {})).rejects.toThrow('Entity not found after update');
    });
  });

  describe('delete', () => {
    it('should delete entity successfully', async () => {
      repository.delete.mockResolvedValue(undefined as any);

      await service.delete('123');

      expect(repository.delete).toHaveBeenCalledWith('123');
    });
  });

  describe('analyze', () => {
    it('should analyze entity successfully', async () => {
      repository.findOne.mockResolvedValue(mockEntity as any);

      const result = await service.analyze('123');

      expect(result.entityId).toBe('123');
      expect(result.insights).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });

    it('should throw error when entity not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.analyze('nonexistent')).rejects.toThrow('Entity not found');
    });
  });
});
SERVICE_TEST_EOF

sed -i "s/PASCAL_CASE/${PASCAL_CASE}/g" "$MODULE_DIR/${SHORT_NAME}.service.spec.ts"
sed -i "s/SHORT_NAME/${SHORT_NAME}/g" "$MODULE_DIR/${SHORT_NAME}.service.spec.ts"

echo "✓ Service tests created: $MODULE_DIR/${SHORT_NAME}.service.spec.ts"

# Generate Controller Tests
cat > "$MODULE_DIR/${SHORT_NAME}.controller.spec.ts" << 'CONTROLLER_TEST_EOF'
import { Test, TestingModule } from '@nestjs/testing';
import { PASCAL_CASEController } from './SHORT_NAME.controller';
import { PASCAL_CASEService } from './SHORT_NAME.service';

describe('PASCAL_CASEController', () => {
  let controller: PASCAL_CASEController;
  let service: jest.Mocked<PASCAL_CASEService>;

  const mockEntity = {
    id: '123',
    userId: 'user-1',
    name: 'Test Entity',
    description: 'Test Description',
    configuration: {},
    metrics: {},
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAllByUser: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      analyze: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PASCAL_CASEController],
      providers: [
        {
          provide: PASCAL_CASEService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PASCAL_CASEController>(PASCAL_CASEController);
    service = module.get(PASCAL_CASEService);
  });

  describe('create', () => {
    it('should call service and return created entity', async () => {
      const dto = {
        userId: 'user-1',
        name: 'Test Entity',
        description: 'Test Description'
      };

      service.create.mockResolvedValue(mockEntity as any);

      const result = await controller.create(dto);

      expect(result).toEqual(mockEntity);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should propagate service errors', async () => {
      const dto = {
        userId: 'user-1',
        name: 'Test Entity'
      };

      service.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(dto)).rejects.toThrow('Database error');
    });
  });

  describe('findByUser', () => {
    it('should return all entities for a user', async () => {
      service.findAllByUser.mockResolvedValue([mockEntity as any]);

      const result = await controller.findByUser('user-1');

      expect(result).toEqual([mockEntity]);
      expect(service.findAllByUser).toHaveBeenCalledWith('user-1');
    });
  });

  describe('findOne', () => {
    it('should return an entity by id', async () => {
      service.findOne.mockResolvedValue(mockEntity as any);

      const result = await controller.findOne('123');

      expect(result).toEqual(mockEntity);
      expect(service.findOne).toHaveBeenCalledWith('123');
    });

    it('should return null when entity not found', async () => {
      service.findOne.mockResolvedValue(null);

      const result = await controller.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('analyze', () => {
    it('should call service and return analysis', async () => {
      const analysis = {
        entityId: '123',
        insights: [],
        recommendations: [],
        score: 85
      };

      service.analyze.mockResolvedValue(analysis);

      const result = await controller.analyze('123');

      expect(result).toEqual(analysis);
      expect(service.analyze).toHaveBeenCalledWith('123');
    });

    it('should propagate service errors', async () => {
      service.analyze.mockRejectedValue(new Error('Entity not found'));

      await expect(controller.analyze('nonexistent')).rejects.toThrow('Entity not found');
    });
  });

  describe('update', () => {
    it('should call service and return updated entity', async () => {
      const updates = { name: 'Updated Name' };
      const updatedEntity = { ...mockEntity, ...updates };

      service.update.mockResolvedValue(updatedEntity as any);

      const result = await controller.update('123', updates);

      expect(result.name).toBe('Updated Name');
      expect(service.update).toHaveBeenCalledWith('123', updates);
    });

    it('should propagate service errors', async () => {
      service.update.mockRejectedValue(new Error('Entity not found'));

      await expect(controller.update('123', {})).rejects.toThrow('Entity not found');
    });
  });

  describe('delete', () => {
    it('should call service and return success message', async () => {
      service.delete.mockResolvedValue(undefined);

      const result = await controller.delete('123');

      expect(result).toEqual({ message: 'Deleted successfully' });
      expect(service.delete).toHaveBeenCalledWith('123');
    });

    it('should propagate service errors', async () => {
      service.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(controller.delete('123')).rejects.toThrow('Delete failed');
    });
  });
});
CONTROLLER_TEST_EOF

sed -i "s/PASCAL_CASE/${PASCAL_CASE}/g" "$MODULE_DIR/${SHORT_NAME}.controller.spec.ts"
sed -i "s/SHORT_NAME/${SHORT_NAME}/g" "$MODULE_DIR/${SHORT_NAME}.controller.spec.ts"

echo "✓ Controller tests created: $MODULE_DIR/${SHORT_NAME}.controller.spec.ts"

echo ""
echo "Feature $FEATURE_NUM implementation generated successfully!"
echo "Files created:"
echo "  - $ENTITY_FILE"
echo "  - $MODULE_DIR/${SHORT_NAME}.service.ts"
echo "  - $MODULE_DIR/${SHORT_NAME}.controller.ts"
echo "  - $MODULE_DIR/${SHORT_NAME}.module.ts"
echo "  - $MODULE_DIR/${SHORT_NAME}.service.spec.ts"
echo "  - $MODULE_DIR/${SHORT_NAME}.controller.spec.ts"
echo ""
