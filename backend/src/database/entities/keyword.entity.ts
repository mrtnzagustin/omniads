import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('keywords')
@Index(['workspaceId', 'keyword'])
export class Keyword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  @Index()
  keyword: string;

  @Column({ type: 'bigint', nullable: true })
  searchVolume: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cpc: number;

  @Column({ nullable: true })
  competition: string; // 'LOW', 'MEDIUM', 'HIGH'

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  roasPotential: number;

  @Column({ type: 'jsonb', nullable: true })
  seasonalityData: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  trendData: number[]; // 12-month trend

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'simple-array', nullable: true })
  relatedKeywords: string[];

  @Column({ type: 'timestamp', nullable: true })
  lastUpdated: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
