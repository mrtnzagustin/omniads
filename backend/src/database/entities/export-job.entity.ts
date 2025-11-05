import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('export_jobs')
@Index(['workspaceId', 'status'])
export class ExportJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  userId: string;

  @Column()
  format: string; // 'PDF', 'EXCEL', 'CSV', 'GOOGLE_SHEETS'

  @Column({ type: 'jsonb' })
  configuration: Record<string, any>;

  @Column({ default: 'PENDING' })
  status: string; // 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'

  @Column({ type: 'text', nullable: true })
  downloadUrl: string;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
