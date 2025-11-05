import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CreativeCollection } from './creative-collection.entity';
import { CreativeAsset } from './creative-asset.entity';

export enum CreativeRole {
  CONTROL = 'CONTROL',
  VARIANT_A = 'VARIANT_A',
  VARIANT_B = 'VARIANT_B',
  VARIANT_C = 'VARIANT_C',
}

@Entity('creative_collection_items')
@Index(['collectionId', 'creativeId'], { unique: true })
export class CreativeCollectionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  collectionId: string;

  @ManyToOne(() => CreativeCollection)
  @JoinColumn({ name: 'collectionId' })
  collection: CreativeCollection;

  @Column('uuid')
  creativeId: string;

  @ManyToOne(() => CreativeAsset)
  @JoinColumn({ name: 'creativeId' })
  creative: CreativeAsset;

  @Column({
    type: 'enum',
    enum: CreativeRole,
    nullable: true,
  })
  role: CreativeRole;

  @Column('text', { nullable: true })
  expectedOutcome: string;

  @Column('text', { nullable: true })
  actualOutcome: string;

  @Column('jsonb', { nullable: true })
  performanceData: any;

  @CreateDateColumn()
  createdAt: Date;
}
