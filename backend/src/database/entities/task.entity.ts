import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Recommendation } from './recommendation.entity';
import { User } from './user.entity';

export enum TaskType {
  QA_CHECK = 'QA_CHECK',
  BUDGET_VERIFICATION = 'BUDGET_VERIFICATION',
  CREATIVE_REVIEW = 'CREATIVE_REVIEW',
  PERFORMANCE_ANALYSIS = 'PERFORMANCE_ANALYSIS',
  MANUAL_ACTION = 'MANUAL_ACTION',
  OTHER = 'OTHER',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TaskType,
  })
  type: TaskType;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column('uuid', { nullable: true })
  ownerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column('int', { nullable: true })
  slaMinutes: number;

  @Column('uuid', { nullable: true })
  relatedRecommendationId: string;

  @ManyToOne(() => Recommendation, { nullable: true })
  @JoinColumn({ name: 'relatedRecommendationId' })
  relatedRecommendation: Recommendation;

  @Column('jsonb', { nullable: true })
  metadata: any;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
