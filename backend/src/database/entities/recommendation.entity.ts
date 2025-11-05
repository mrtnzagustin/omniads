import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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
  ARCHIVED = 'ARCHIVED',
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

  @CreateDateColumn()
  createdAt: Date;
}
