import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('contextual_moment_targeting_main')
export class ContextualMomentTargeting {
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
    momentTypes: string[];
    contextualSignals: {
      signal: string;
      weight: number;
      threshold: number;
    }[];
    timeWindows: {
      dayOfWeek: string[];
      hourRange: { start: number; end: number };
    };
    locationContext: {
      enabled: boolean;
      geofences: string[];
    };
    behaviorTriggers: {
      action: string;
      timing: string;
      priority: number;
    }[];
  };

  @Column('simple-json', { nullable: true })
  metrics: {
    totalMoments: number;
    momentsCaptured: number;
    captureRate: number;
    avgEngagementRate: number;
    conversionRate: number;
    topMoments: {
      momentType: string;
      count: number;
      engagementRate: number;
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
