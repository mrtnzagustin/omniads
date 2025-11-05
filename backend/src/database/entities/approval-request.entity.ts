import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('approval_requests')
@Index(['workflowId', 'status'])
@Index(['workspaceId', 'status'])
export class ApprovalRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  workflowId: string;

  @Column()
  requestedBy: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  amount: number;

  @Column({ type: 'jsonb' })
  details: Record<string, any>;

  @Column({ default: 'PENDING' })
  status: string; // 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'

  @Column({ type: 'integer', default: 1 })
  currentLevel: number;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
