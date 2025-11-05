import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cross_platform_creative_syncer_main')
export class CrossPlatformCreativeSyncer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('simple-json')
  configuration: {
    platforms: string[];
    creativeAssets: {
      assetId: string;
      assetType: string;
      originalPlatform: string;
      adaptations: {
        platform: string;
        format: string;
        dimensions: string;
        status: string;
      }[];
    }[];
    syncSettings: {
      autoSync: boolean;
      syncFrequency: string;
      conflictResolution: string;
    };
    transformationRules: {
      rule: string;
      fromPlatform: string;
      toPlatform: string;
      adjustments: Record<string, any>;
    }[];
  };

  @Column('simple-json', { nullable: true })
  metrics: {
    totalAssets: number;
    syncedAssets: number;
    pendingSync: number;
    failedSync: number;
    platformCoverage: {
      platform: string;
      assetCount: number;
      lastSync: Date;
    }[];
    syncHistory: {
      timestamp: Date;
      assetsProcessed: number;
      successRate: number;
    }[];
  };

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
