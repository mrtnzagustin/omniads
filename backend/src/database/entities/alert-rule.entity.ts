import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('alert_rules')
@Index(['workspaceId', 'enabled'])
export class AlertRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  conditions: Array<{
    field: string;
    operator: string;
    value: any;
    logicalOperator?: 'AND' | 'OR';
  }>;

  @Column()
  priority: string; // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'

  @Column({ type: 'jsonb' })
  channels: {
    email?: boolean;
    whatsapp?: boolean;
    slack?: boolean;
    inApp?: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  escalationConfig: {
    enabled: boolean;
    delayMinutes: number;
    escalateTo: string[];
  };

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'integer', default: 0 })
  fireCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastFiredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
