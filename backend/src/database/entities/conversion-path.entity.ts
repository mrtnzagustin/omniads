import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('conversion_paths')
export class ConversionPath {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'workspace_id' })
  workspaceId: string;

  @Column({ type: 'jsonb' })
  touchpoints: Array<{
    channel: string;
    campaignId: string;
    timestamp: string;
    eventType: string;
  }>;

  @Column({ name: 'total_revenue', type: 'decimal', precision: 10, scale: 2 })
  totalRevenue: number;

  @CreateDateColumn({ name: 'conversion_timestamp' })
  conversionTimestamp: Date;

  @Column({ name: 'path_hash', nullable: true })
  pathHash: string; // For grouping similar paths
}
