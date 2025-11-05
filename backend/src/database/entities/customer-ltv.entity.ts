import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('customer_ltv')
@Index(['workspaceId', 'acquisitionChannel'])
export class CustomerLTV {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  @Index()
  customerId: string;

  @Column()
  acquisitionChannel: string;

  @Column({ nullable: true })
  acquisitionCampaignId: string;

  @Column({ type: 'date' })
  acquisitionDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  ltv30: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  ltv90: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  ltv180: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  ltv365: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  predictedLTV: number;

  @Column({ type: 'integer', default: 0 })
  purchaseCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
