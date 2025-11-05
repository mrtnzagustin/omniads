import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('bidding_recommendations')
@Index(['workspaceId', 'status'])
@Index(['campaignId', 'status'])
export class BiddingRecommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column({ nullable: true })
  campaignId: string;

  @Column()
  keyword: string;

  @Column({
    type: 'enum',
    enum: ['INCREASE_BID', 'DECREASE_BID', 'PAUSE_KEYWORD', 'ADD_NEGATIVE_KEYWORD', 'ADD_NEW_KEYWORD'],
  })
  recommendationType: 'INCREASE_BID' | 'DECREASE_BID' | 'PAUSE_KEYWORD' | 'ADD_NEGATIVE_KEYWORD' | 'ADD_NEW_KEYWORD';

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentBid: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  suggestedBid: number;

  @Column({ type: 'text' })
  rationale: string;

  @Column({ type: 'jsonb', nullable: true })
  predictedImpact: {
    impressions?: number;
    clicks?: number;
    conversions?: number;
    cost?: number;
    revenue?: number;
    roas?: number;
  };

  @Column({ type: 'integer', default: 0 })
  confidenceScore: number; // 0-100

  @Column({
    type: 'enum',
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

  @Column({ type: 'timestamp', nullable: true })
  appliedAt: Date;

  @Column({ nullable: true })
  appliedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
