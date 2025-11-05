import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('creative_tests')
@Index(['workspaceId', 'status'])
@Index(['campaignId', 'status'])
export class CreativeTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  campaignId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  testBudget: number;

  @Column()
  successMetric: string; // 'CTR', 'CONVERSIONS', 'ROAS', 'CPA'

  @Column({ type: 'integer', default: 14 })
  maxDurationDays: number;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'RUNNING', 'COMPLETED', 'PAUSED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'PAUSED';

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  winnerId: string; // ID of winning variant

  @Column({ type: 'integer', nullable: true })
  confidenceLevel: number; // 0-100

  @Column({ nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
