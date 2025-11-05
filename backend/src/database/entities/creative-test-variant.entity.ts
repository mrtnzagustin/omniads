import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CreativeTest } from './creative-test.entity';

@Entity('creative_test_variants')
@Index(['testId', 'status'])
export class CreativeTestVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  testId: string;

  @ManyToOne(() => CreativeTest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'testId' })
  test: CreativeTest;

  @Column()
  name: string;

  @Column({ nullable: true })
  creativeAssetId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 33.33 })
  currentAllocation: number; // Percentage

  @Column({ type: 'integer', default: 0 })
  impressions: number;

  @Column({ type: 'integer', default: 0 })
  clicks: number;

  @Column({ type: 'integer', default: 0 })
  conversions: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  cost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  revenue: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  ctr: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  roas: number;

  @Column({ type: 'integer', default: 50 })
  confidenceScore: number; // 0-100

  @Column({ default: 'ACTIVE' })
  status: string; // 'ACTIVE', 'PAUSED', 'WINNER', 'LOSER'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
