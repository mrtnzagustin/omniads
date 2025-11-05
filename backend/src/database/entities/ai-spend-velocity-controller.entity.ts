import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ai_spend_velocity_controller_main')
export class AiSpendVelocityController {
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
    targetSpendRate: number;
    timeframe: string;
    velocityThresholds: {
      slowdown: number;
      optimal: number;
      accelerate: number;
    };
    budgetConstraints: {
      minDailySpend: number;
      maxDailySpend: number;
      totalBudget: number;
    };
    performanceGates: {
      metric: string;
      threshold: number;
      action: string;
    }[];
    adjustmentRules: {
      condition: string;
      adjustment: number;
      cooldownPeriod: number;
    }[];
  };

  @Column('simple-json', { nullable: true })
  metrics: {
    currentVelocity: number;
    targetVelocity: number;
    spendToDate: number;
    projectedSpend: number;
    adjustmentsCount: number;
    performanceScore: number;
    velocityHistory: {
      date: Date;
      actualVelocity: number;
      targetVelocity: number;
      adjustment: number;
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
