import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { AIAnalysis } from './ai-analysis.entity';
import { User } from './user.entity';

@Entity('ai_analysis_feedback')
@Index(['analysisId'])
export class AIAnalysisFeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  analysisId: string;

  @ManyToOne(() => AIAnalysis, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analysisId' })
  analysis: AIAnalysis;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true, type: 'int' })
  rating: number; // 1-5 stars

  @Column({ nullable: true, type: 'boolean' })
  helpful: boolean;

  @Column({ nullable: true, type: 'text' })
  comment: string;

  @Column({ nullable: true })
  feedbackType: string; // 'ACCURACY' | 'RELEVANCE' | 'CLARITY'

  @CreateDateColumn()
  createdAt: Date;
}
