import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('geo_performance')
@Index(['workspaceId', 'level', 'region'])
export class GeoPerformance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  region: string; // Country, state, or city name

  @Column()
  level: string; // 'COUNTRY', 'STATE', 'CITY'

  @Column({ nullable: true })
  parentRegion: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'integer', default: 0 })
  impressions: number;

  @Column({ type: 'integer', default: 0 })
  clicks: number;

  @Column({ type: 'integer', default: 0 })
  conversions: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  revenue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  spend: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  roas: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cpa: number;

  @CreateDateColumn()
  createdAt: Date;
}
