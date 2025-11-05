import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('attribution_results')
@Index(['workspaceId', 'model', 'channel'])
export class AttributionResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'workspace_id' })
  workspaceId: string;

  @Column()
  channel: string;

  @Column()
  model: 'LAST_CLICK' | 'FIRST_CLICK' | 'LINEAR' | 'TIME_DECAY' | 'POSITION_BASED' | 'CUSTOM';

  @Column({ name: 'attributed_revenue', type: 'decimal', precision: 10, scale: 2 })
  attributedRevenue: number;

  @Column({ name: 'attributed_conversions', type: 'decimal', precision: 10, scale: 2 })
  attributedConversions: number;

  @Column({ name: 'attributed_roas', type: 'decimal', precision: 10, scale: 2 })
  attributedROAS: number;

  @Column({ name: 'assist_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  assistRate: number;

  @Column({ name: 'date_start', type: 'date' })
  dateStart: Date;

  @Column({ name: 'date_end', type: 'date' })
  dateEnd: Date;

  @CreateDateColumn({ name: 'calculated_at' })
  calculatedAt: Date;
}
