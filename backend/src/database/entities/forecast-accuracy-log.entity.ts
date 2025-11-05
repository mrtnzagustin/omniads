import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Forecast } from './forecast.entity';

@Entity('forecast_accuracy_logs')
@Index(['forecastId', 'evaluatedAt'])
@Index(['workspaceId', 'evaluatedAt'])
export class ForecastAccuracyLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  forecastId: string;

  @ManyToOne(() => Forecast, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'forecastId' })
  forecast: Forecast;

  @Column()
  workspaceId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  actualValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  predictedValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  absoluteError: number; // |actual - predicted|

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  percentageError: number; // |actual - predicted| / actual * 100

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  mape: number; // Mean Absolute Percentage Error

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  rmse: number; // Root Mean Squared Error

  @Column({ default: false })
  withinConfidenceInterval80: boolean;

  @Column({ default: false })
  withinConfidenceInterval95: boolean;

  @Column({ type: 'timestamp' })
  evaluatedAt: Date; // When this accuracy check was performed

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
