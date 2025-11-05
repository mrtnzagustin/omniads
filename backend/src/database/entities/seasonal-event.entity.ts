import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('seasonal_events')
@Index(['workspaceId', 'startDate'])
export class SeasonalEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ['HOLIDAY', 'SALE', 'PRODUCT_LAUNCH', 'SEASONAL', 'CUSTOM'],
    default: 'CUSTOM',
  })
  eventType: 'HOLIDAY' | 'SALE' | 'PRODUCT_LAUNCH' | 'SEASONAL' | 'CUSTOM';

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  expectedImpactMultiplier: number; // e.g., 1.5 means 50% increase

  @Column({ default: true })
  applyToForecasting: boolean;

  @Column({ nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
