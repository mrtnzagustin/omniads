import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('ad_copy_templates')
@Index(['workspaceId', 'category'])
export class AdCopyTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  category: string; // 'HEADLINE', 'DESCRIPTION', 'CTA', 'FULL_AD'

  @Column({ type: 'text' })
  template: string;

  @Column({ type: 'simple-array', nullable: true })
  variables: string[]; // e.g., ['product_name', 'discount', 'benefit']

  @Column({ type: 'text', nullable: true })
  example: string;

  @Column({ type: 'integer', default: 0 })
  usageCount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  averagePerformanceScore: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
