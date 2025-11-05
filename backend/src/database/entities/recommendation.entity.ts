import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum RecommendationType {
  PAUSE_CAMPAIGN = 'PAUSE_CAMPAIGN',
  SCALE_CAMPAIGN = 'SCALE_CAMPAIGN',
  BUDGET_SHIFT = 'BUDGET_SHIFT',
  COMPETITOR_PRICE = 'COMPETITOR_PRICE',
  PROMOTE_ORGANIC = 'PROMOTE_ORGANIC',
  CREATE_BUNDLE = 'CREATE_BUNDLE',
}

export enum RecommendationStatus {
  NEW = 'NEW',
  VIEWED = 'VIEWED',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED',
}

export enum RecommendationPriority {
  P1 = 'P1', // Critical
  P2 = 'P2', // High
  P3 = 'P3', // Medium
  P4 = 'P4', // Low
}

@Entity('recommendations')
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RecommendationType,
  })
  type: RecommendationType;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('jsonb')
  data: any; // Store relevant data, e.g., { campaignId: "...", currentRoas: 0.8 }

  @Column({
    type: 'enum',
    enum: RecommendationStatus,
    default: RecommendationStatus.NEW,
  })
  status: RecommendationStatus;

  // Workflow fields (Feature 004)
  @Column('uuid', { nullable: true })
  ownerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: RecommendationPriority,
    nullable: true,
  })
  priority: RecommendationPriority;

  @Column('text', { nullable: true })
  outcomeSummary: string;

  @Column('simple-array', { nullable: true })
  linkedTaskIds: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
