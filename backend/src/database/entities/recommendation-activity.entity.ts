import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Recommendation, RecommendationStatus } from './recommendation.entity';
import { User } from './user.entity';

@Entity('recommendation_activities')
@Index(['recommendationId', 'createdAt'])
export class RecommendationActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  recommendationId: string;

  @ManyToOne(() => Recommendation)
  @JoinColumn({ name: 'recommendationId' })
  recommendation: Recommendation;

  @Column('uuid', { nullable: true })
  actorId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'actorId' })
  actor: User;

  @Column({
    type: 'enum',
    enum: RecommendationStatus,
    nullable: true,
  })
  fromStatus: RecommendationStatus;

  @Column({
    type: 'enum',
    enum: RecommendationStatus,
  })
  toStatus: RecommendationStatus;

  @Column('text', { nullable: true })
  notes: string;

  @Column('jsonb', { nullable: true })
  changes: any; // Track what changed (owner, dueDate, priority, etc.)

  @CreateDateColumn()
  createdAt: Date;
}
