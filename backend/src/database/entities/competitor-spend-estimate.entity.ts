import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Competitor } from './competitor.entity';

@Entity('competitor_spend_estimates')
@Index(['competitorId', 'month', 'platform'], { unique: true })
@Index(['competitorId', 'month'])
export class CompetitorSpendEstimate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  competitorId: string;

  @ManyToOne(() => Competitor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'competitorId' })
  competitor: Competitor;

  @Column()
  platform: string; // 'META', 'GOOGLE', 'TIKTOK', 'TOTAL'

  @Column({ type: 'date' })
  month: Date; // First day of the month

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimatedSpendMin: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimatedSpendMax: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimatedSpendMid: number; // Average of min and max

  @Column({ nullable: true })
  dataSource: string; // 'META_AD_LIBRARY', 'EXTRAPOLATED', 'MANUAL'

  @Column({ type: 'integer', nullable: true })
  adsCount: number; // Number of ads counted in this estimate

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
