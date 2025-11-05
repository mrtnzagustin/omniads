import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BudgetRecommendation } from './budget-recommendation.entity';
import { User } from './user.entity';

export enum BudgetAdjustmentStatus {
  APPROVED = 'APPROVED',
  DISPATCHED = 'DISPATCHED',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
}

@Entity('budget_adjustments')
export class BudgetAdjustment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  recommendationId: string;

  @ManyToOne(() => BudgetRecommendation)
  @JoinColumn({ name: 'recommendationId' })
  recommendation: BudgetRecommendation;

  @Column('uuid', { nullable: true })
  approvedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approvedBy' })
  approver: User;

  @Column({ default: false })
  autoApproved: boolean;

  @Column({
    type: 'enum',
    enum: BudgetAdjustmentStatus,
    default: BudgetAdjustmentStatus.APPROVED,
  })
  status: BudgetAdjustmentStatus;

  @Column({ type: 'timestamp', nullable: true })
  dispatchedAt: Date;

  @Column({ nullable: true })
  platformExecutionId: string;

  @Column('text', { nullable: true })
  failureReason: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  actualDelta: number; // May differ from suggested if manually edited

  @Column('jsonb', { nullable: true })
  executionMetadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
