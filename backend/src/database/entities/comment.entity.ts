import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('comments')
@Index(['entityType', 'entityId'])
@Index(['workspaceId', 'createdAt'])
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  entityType: string; // 'CAMPAIGN', 'RECOMMENDATION', 'CREATIVE', 'DASHBOARD'

  @Column()
  entityId: string;

  @Column()
  userId: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'simple-array', nullable: true })
  mentions: string[]; // User IDs mentioned

  @Column({ nullable: true })
  parentCommentId: string;

  @Column({ default: false })
  isEdited: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
