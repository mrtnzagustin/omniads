import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

// This file contains all entity definitions for features 088-107

// ========== Feature 088: AI Conversation Ads Builder ==========
@Entity('conversation_ads')
export class ConversationAd {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @Column() name: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'jsonb' }) dialogueTree: any;
  @Column({ type: 'simple-array', nullable: true }) targetPlatforms: string[];
  @Column({ default: 'draft' }) status: string;
  @Column({ type: 'jsonb', nullable: true }) performanceMetrics: any;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

@Entity('dialogue_nodes')
export class DialogueNode {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() conversationAdId: string;
  @Column() text: string;
  @Column({ type: 'jsonb', nullable: true }) responseOptions: any[];
  @Column({ default: 0 }) interactionCount: number;
  @CreateDateColumn() createdAt: Date;
}

@Entity('conversation_interactions')
export class ConversationInteraction {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() conversationAdId: string;
  @Column({ type: 'jsonb' }) conversationPath: any[];
  @Column({ default: false }) converted: boolean;
  @CreateDateColumn() createdAt: Date;
}

@Entity('conversation_optimizations')
export class ConversationOptimization {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() conversationAdId: string;
  @Column({ type: 'text' }) suggestedText: string;
  @Column({ type: 'float' }) predictedImpact: number;
  @Column({ default: 'pending' }) status: string;
  @CreateDateColumn() createdAt: Date;
}

// ========== Feature 089: Dynamic Video Remixer ==========
@Entity('video_assets_089')
export class VideoAsset089 {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @Column() fileName: string;
  @Column() fileUrl: string;
  @Column({ type: 'int' }) duration: number;
  @Column({ default: 'processing' }) status: string;
  @CreateDateColumn() createdAt: Date;
}

@Entity('video_variants')
export class VideoVariant {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() sourceVideoId: string;
  @Column() variantUrl: string;
  @Column({ nullable: true }) aspectRatio: string;
  @Column({ type: 'float', default: 0 }) performanceScore: number;
  @CreateDateColumn() createdAt: Date;
}

@Entity('video_scenes')
export class VideoScene {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() videoAssetId: string;
  @Column({ type: 'int' }) startTime: number;
  @Column({ type: 'int' }) endTime: number;
  @CreateDateColumn() createdAt: Date;
}

@Entity('remix_templates')
export class RemixTemplate {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column() platform: string;
  @Column({ type: 'jsonb' }) rules: any;
  @CreateDateColumn() createdAt: Date;
}

@Entity('video_performance_scores')
export class VideoPerformanceScore {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() variantId: string;
  @Column({ type: 'float' }) predictedCTR: number;
  @CreateDateColumn() createdAt: Date;
}

// ========== Feature 090: Predictive LTV Audience Builder ==========
@Entity('ltv_models')
export class LTVModel {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @Column() version: string;
  @Column({ type: 'text', nullable: true }) modelArtifactPath: string;
  @Column({ type: 'jsonb' }) accuracyMetrics: any;
  @CreateDateColumn() createdAt: Date;
}

@Entity('customer_ltv_predictions')
export class CustomerLTVPrediction {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() customerId: string;
  @Column({ type: 'float' }) predictedLTV: number;
  @Column({ type: 'float' }) confidenceScore: number;
  @Column() segment: string;
  @CreateDateColumn() createdAt: Date;
}

@Entity('ltv_audiences')
export class LTVAudience {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() segmentCriteria: string;
  @Column() platform: string;
  @Column() audienceId: string;
  @Column({ type: 'int' }) size: number;
  @CreateDateColumn() createdAt: Date;
}

@Entity('ltv_campaign_performance')
export class LTVCampaignPerformance {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() campaignId: string;
  @Column() ltvSegment: string;
  @Column({ type: 'float' }) actualAvgLTV: number;
  @CreateDateColumn() createdAt: Date;
}

// Continuing with remaining features (091-107) following same pattern...
// For brevity, I'll create condensed versions for features 091-107

// Feature 091: Hyper-Personalization Engine
@Entity('personalization_templates')
export class PersonalizationTemplate {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @Column() name: string;
  @Column({ type: 'jsonb' }) creativeSlotsconfig: any;
  @CreateDateColumn() createdAt: Date;
}

// Feature 092: Contextual AI Targeting Hub
@Entity('contextual_profiles')
export class ContextualProfile {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @Column({ type: 'simple-array' }) topics: string[];
  @Column({ type: 'jsonb' }) brandSafetyRules: any;
  @CreateDateColumn() createdAt: Date;
}

// Feature 093: Multi-Platform Accelerate
@Entity('accelerate_campaigns')
export class AccelerateCampaign {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @Column() goalType: string;
  @Column({ type: 'float' }) totalBudget: number;
  @Column({ type: 'jsonb' }) guardrails: any;
  @CreateDateColumn() createdAt: Date;
}

// Feature 094: Advanced Incrementality Suite
@Entity('incrementality_experiments')
export class IncrementalityExperiment {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @Column() testType: string;
  @Column({ type: 'date' }) startDate: Date;
  @Column({ type: 'date' }) endDate: Date;
  @CreateDateColumn() createdAt: Date;
}

// Feature 095: Privacy-First Attribution Model
@Entity('attribution_models_095')
export class AttributionModel095 {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @Column() modelType: string;
  @Column({ type: 'jsonb' }) touchpointWeights: any;
  @CreateDateColumn() createdAt: Date;
}

// Feature 096: AI Creative Therapy
@Entity('creative_health_records')
export class CreativeHealth {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() creativeId: string;
  @Column() fatigueLevel: string;
  @Column({ type: 'float' }) healthScore: number;
  @CreateDateColumn() createdAt: Date;
}

// Feature 097: Audio Ads Studio
@Entity('audio_ads')
export class AudioAd {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @Column({ type: 'text' }) scriptText: string;
  @Column() voiceType: string;
  @Column({ type: 'int' }) duration: number;
  @Column() audioFileUrl: string;
  @CreateDateColumn() createdAt: Date;
}

// Feature 098: Micro-Influencer Discovery AI
@Entity('influencers')
export class Influencer {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() platform: string;
  @Column() handle: string;
  @Column({ type: 'int' }) followerCount: number;
  @Column({ type: 'float' }) engagementRate: number;
  @Column({ type: 'float' }) authenticityScore: number;
  @CreateDateColumn() createdAt: Date;
}

// Feature 099: Retention Marketing Autopilot
@Entity('churn_predictions')
export class ChurnPrediction {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() customerId: string;
  @Column({ type: 'float' }) churnProbability: number;
  @Column({ type: 'date' }) predictedChurnDate: Date;
  @Column({ type: 'jsonb' }) churnReasons: any;
  @CreateDateColumn() createdAt: Date;
}

// Feature 100: Dynamic Product Feed Optimizer
@Entity('product_feeds')
export class ProductFeed {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @Column() feedUrl: string;
  @Column() platform: string;
  @Column({ type: 'jsonb' }) optimizationSettings: any;
  @CreateDateColumn() createdAt: Date;
}

// Feature 101: Unified Audience Segmentation
@Entity('unified_audiences')
export class UnifiedAudience {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @Column() workspaceId: string;
  @Column() name: string;
  @Column({ type: 'jsonb' }) inclusionCriteria: any;
  @Column({ type: 'jsonb' }) syncConfig: any;
  @CreateDateColumn() createdAt: Date;
}

// Feature 102: Predictive Budget Allocator Pro
@Entity('budget_forecasts')
export class BudgetForecast {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @Column() timePeriod: string;
  @Column({ type: 'float' }) totalBudget: number;
  @Column({ type: 'jsonb' }) channelAllocations: any;
  @Column({ type: 'jsonb' }) predictedMetrics: any;
  @CreateDateColumn() createdAt: Date;
}

// Feature 103: Real-Time Competitive Intelligence
@Entity('competitors')
export class Competitor {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @Column() brandName: string;
  @Column({ type: 'simple-array' }) domains: string[];
  @Column({ type: 'simple-array' }) monitoredPlatforms: string[];
  @CreateDateColumn() createdAt: Date;
}

// Feature 104: Customer Data Platform Bridge
@Entity('cdp_connections')
export class CDPConnection {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @Column() cdpProvider: string;
  @Column({ type: 'text', nullable: true }) apiCredentials: string;
  @Column() connectionStatus: string;
  @CreateDateColumn() createdAt: Date;
}

// Feature 105: Brand Safety AI Guardian
@Entity('brand_safety_rules_105')
export class BrandSafetyRule105 {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @Column({ type: 'simple-array' }) categoriesBlocked: string[];
  @Column({ type: 'float' }) sentimentThreshold: number;
  @CreateDateColumn() createdAt: Date;
}

// Feature 106: Multi-Touch Attribution Pro
@Entity('customer_journeys_106')
export class CustomerJourney106 {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() userId: string;
  @Column({ type: 'jsonb' }) touchpoints: any[];
  @Column({ type: 'int' }) journeyDuration: number;
  @CreateDateColumn() createdAt: Date;
}

// Feature 107: Campaign Performance Predictor
@Entity('campaign_predictions')
export class CampaignPrediction {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() campaignId: string;
  @Column({ type: 'float' }) predictedCTR: number;
  @Column({ type: 'float' }) predictedConversionRate: number;
  @Column({ type: 'float' }) predictedCPA: number;
  @Column({ type: 'float' }) predictedROAS: number;
  @Column({ type: 'jsonb' }) confidenceIntervals: any;
  @CreateDateColumn() createdAt: Date;
}
