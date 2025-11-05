import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum CollectionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

@Entity('creative_collections')
export class CreativeCollection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  hypothesis: string;

  @Column({ nullable: true })
  goalMetric: string; // e.g., 'ROAS', 'CTR', 'CPA'

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  goalValue: number;

  @Column('uuid', { nullable: true })
  ownerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: CollectionStatus,
    default: CollectionStatus.DRAFT,
  })
  status: CollectionStatus;

  @Column('text', { nullable: true })
  notes: string;

  @Column('jsonb', { nullable: true })
  results: any; // Store experiment results

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
