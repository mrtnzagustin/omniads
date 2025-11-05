import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('white_label_dashboard_main')
export class WhiteLabelDashboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('simple-json')
  configuration: {
    enabled: boolean;
    settings: Record<string, any>;
  };

  @Column('simple-json', { nullable: true })
  metrics: {
    totalProcessed: number;
    successRate: number;
    lastRun: Date;
  };

  @Column({
    type: 'enum',
    enum: ['active', 'paused', 'archived'],
    default: 'active'
  })
  status: 'active' | 'paused' | 'archived';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
