import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { AIAnalysis } from './ai-analysis.entity';
import { Recommendation } from './recommendation.entity';

@Entity('ai_analysis_outcomes')
@Index(['analysisId'])
@Index(['measurementDate'])
export class AIAnalysisOutcome {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  analysisId: string;

  @ManyToOne(() => AIAnalysis, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analysisId' })
  analysis: AIAnalysis;

  @Column({ nullable: true })
  recommendationId: string;

  @ManyToOne(() => Recommendation, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'recommendationId' })
  recommendation: Recommendation;

  @Column()
  predictedMetric: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  predictedValue: number;

  @Column({ nullable: true })
  actualMetric: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualValue: number;

  @Column({ type: 'timestamp' })
  measurementDate: Date;

  @Column()
  measurementPeriod: number; // 7, 14, or 30 days

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  accuracyScore: number; // Percentage accuracy

  @CreateDateColumn()
  createdAt: Date;
}
