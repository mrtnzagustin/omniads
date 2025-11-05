import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('product_performance')
@Index(['workspaceId', 'productId', 'date'])
export class ProductPerformance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  @Index()
  productId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  adRevenue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  organicRevenue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  adSpend: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  roas: number;

  @Column({ type: 'integer', default: 0 })
  conversions: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  aov: number; // Average Order Value

  @CreateDateColumn()
  createdAt: Date;
}
