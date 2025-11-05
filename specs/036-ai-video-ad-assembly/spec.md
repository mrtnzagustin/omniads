# Feature Specification: AI Video Ad Assembly

**Feature Branch**: `[036-ai-video-ad-assembly]`
**Created**: 2025-11-05
**Status**: Implemented
**Implementation Date**: 2025-11-05
**Input**: User description: "Automatic video ad assembly from asset library using AI"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Auto-generate video ads from assets (Priority: P1)

As a creative manager, I can upload video clips, images, product shots, and text, and AI automatically assembles them into platform-optimized video ads (15s, 30s, 60s), so that I can scale video creative production without expensive editing.

**Why this priority**: Video ad production is time-consuming and expensive; automation enables scale.

**Independent Test**: Upload 10 assets (clips, images, logos), request 5 video ad variants, verify AI generates videos matching platform specs (Meta 15s, TikTok 30s, YouTube 60s).

**Acceptance Scenarios**:

1. **Given** I have asset library with clips, images, music, **When** I request video ad creation, **Then** AI analyzes assets and generates 3+ video variants with different hooks, messaging sequences, and CTAs.
2. **Given** I need platform-specific formats, **When** I select target platforms, **Then** AI outputs videos optimized for each platform (aspect ratios, lengths, safe zones, text limits).
3. **Given** videos are generated, **When** I preview, **Then** I can see all variants with performance predictions and edit before publishing.

---

### User Story 2 - Customize video templates and styles (Priority: P1)

As a brand manager, I can define video templates, brand guidelines (colors, fonts, logos), and preferred styles (fast-paced, elegant, UGC-style), so that AI-generated videos stay on-brand.

**Why this priority**: Brand consistency is non-negotiable for automated creative.

**Independent Test**: Configure brand guidelines with specific colors and fonts, verify all generated videos respect these constraints.

**Acceptance Scenarios**:

1. **Given** I want brand consistency, **When** I configure brand settings, **Then** I can upload logo, define color palette, set font preferences, and specify visual style.
2. **Given** brand guidelines are set, **When** AI generates videos, **Then** 100% of videos use approved colors, fonts, logo placement, and visual style.
3. **Given** I have successful video patterns, **When** I save as template, **Then** future video generations can use this template structure while varying content.

---

### User Story 3 - A/B test video variants automatically (Priority: P2)

As a performance marketer, I can deploy AI-generated video variants in automated A/B tests, so that the system identifies winning creative and allocates budget accordingly.

**Why this priority**: Testing enables optimization but requires video generation to work first.

**Independent Test**: Generate 5 video variants, deploy in A/B test, verify system allocates budget to top performers automatically.

**Acceptance Scenarios**:

1. **Given** I have multiple video variants, **When** I launch A/B test campaign, **Then** variants are deployed evenly initially and system measures CTR, conversion rate, and ROAS per variant.
2. **Given** test has sufficient data (1000+ impressions per variant), **When** a winner emerges, **Then** system automatically shifts budget to top-performing variants.
3. **Given** creative fatigue occurs, **When** performance declines, **Then** system automatically requests new video generation and initiates new test cycle.

---

### Edge Cases

- What if asset library lacks sufficient variety? AI should warn when assets are limited and suggest what's missing (more product angles, lifestyle shots, etc.).
- How to handle music licensing? Only use royalty-free music library or require users to upload licensed tracks.
- What if generated video violates platform policies? Implement policy checker that flags potential violations (excessive text, prohibited content) before publishing.
- How to ensure accessibility? Auto-generate captions for all videos and provide alt-text for visual elements.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept video clips, images, audio, text assets and assemble them into coherent video ads of specified lengths (6s, 15s, 30s, 60s, 90s).
- **FR-002**: System MUST generate multiple video variants per request (minimum 3) with different hooks, sequences, pacing, and messaging.
- **FR-003**: System MUST optimize videos for platform specifications: aspect ratios (1:1, 4:5, 9:16, 16:9), file sizes, safe zones, text limits.
- **FR-004**: System MUST respect brand guidelines: logos, colors, fonts, visual styles, music preferences.
- **FR-005**: System MUST provide video preview with playback controls, frame-by-frame review, and edit capabilities.
- **FR-006**: System MUST generate captions automatically using speech-to-text for accessibility.
- **FR-007**: System MUST predict video performance based on historical creative data and surface predictions to users.
- **FR-008**: System MUST integrate with creative testing framework to deploy and optimize video variants automatically.
- **FR-009**: System MUST track video generation costs (compute, storage, AI tokens) and video performance ROI.
- **FR-010**: System MUST provide royalty-free music library and allow custom uploads with licensing verification.

### Non-Functional Requirements

- **NFR-001**: Video generation MUST complete within 5 minutes for 15s videos and 15 minutes for 60s videos.
- **NFR-002**: Generated videos MUST be 1080p minimum resolution with 30fps.
- **NFR-003**: System MUST handle 100+ concurrent video generation requests without degradation.
- **NFR-004**: Asset library storage MUST be optimized with CDN delivery for fast preview loading.

### Key Entities

- **VideoAsset**: Asset library items (clips, images, audio)
- **VideoTemplate**: Reusable video structures and brand guidelines
- **VideoGenerationJob**: AI video assembly requests and status
- **GeneratedVideo**: Output videos with metadata and performance
- **VideoVariant**: Variants for A/B testing

## Success Criteria *(mandatory)*

- **SC-001**: Video generation completes successfully 95%+ of requests within SLA (5min for 15s, 15min for 60s).
- **SC-002**: AI-generated videos match brand guidelines 100% of the time (validated via manual review sample).
- **SC-003**: Generated videos perform within 15% of hand-crafted professional videos on CTR and conversion rate.
- **SC-004**: Video generation costs 90% less than outsourcing to creative agency (time + money savings).
- **SC-005**: Users create 5x more video variants vs manual process (measured over 30 days).
- **SC-006**: 80%+ of generated videos are published without manual editing (indicates quality).
- **SC-007**: Auto-generated captions achieve 95%+ accuracy (measured via sample validation).

## Implementation Notes

### Database Schema

```sql
CREATE TABLE video_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR(255) NOT NULL,
  asset_type VARCHAR(50) NOT NULL, -- 'VIDEO_CLIP' | 'IMAGE' | 'AUDIO' | 'TEXT'
  file_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  duration_seconds DECIMAL(10,2), -- For video/audio
  dimensions JSONB, -- {width: 1920, height: 1080}
  tags TEXT[],
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_video_assets_workspace ON video_assets(workspace_id);
CREATE INDEX idx_video_assets_type ON video_assets(asset_type);

CREATE TABLE video_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  brand_guidelines JSONB NOT NULL, -- {logo, colors, fonts, style}
  structure JSONB NOT NULL, -- Video assembly instructions
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE video_generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR(255) NOT NULL,
  template_id UUID REFERENCES video_templates(id),
  requested_by UUID REFERENCES users(id),
  input_assets JSONB NOT NULL, -- Array of asset IDs
  platform_targets TEXT[], -- ['meta', 'tiktok', 'youtube']
  parameters JSONB, -- {length: 15, variants: 3, style: 'fast-paced'}
  status VARCHAR(50) NOT NULL DEFAULT 'QUEUED',
  progress_percent INTEGER DEFAULT 0,
  error_message TEXT,
  cost_usd DECIMAL(10,4),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_video_generation_jobs_workspace ON video_generation_jobs(workspace_id);
CREATE INDEX idx_video_generation_jobs_status ON video_generation_jobs(status);

CREATE TABLE generated_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES video_generation_jobs(id) ON DELETE CASCADE,
  workspace_id VARCHAR(255) NOT NULL,
  variant_number INTEGER NOT NULL,
  video_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  platform VARCHAR(50), -- Platform this variant is optimized for
  duration_seconds DECIMAL(10,2),
  dimensions JSONB,
  captions_url VARCHAR(500),
  predicted_ctr DECIMAL(5,4), -- AI prediction
  predicted_conversion_rate DECIMAL(5,4),
  actual_ctr DECIMAL(5,4), -- Measured performance
  actual_conversion_rate DECIMAL(5,4),
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_generated_videos_job ON generated_videos(job_id);
CREATE INDEX idx_generated_videos_workspace ON generated_videos(workspace_id);
```

### API Endpoints

```
# Asset Management
POST   /api/v1/video-assets                    - Upload asset to library
GET    /api/v1/video-assets                    - List assets in library
DELETE /api/v1/video-assets/:id                - Delete asset

# Templates & Brand Guidelines
POST   /api/v1/video-templates                 - Create template with brand guidelines
GET    /api/v1/video-templates                 - List templates
PATCH  /api/v1/video-templates/:id             - Update template

# Video Generation
POST   /api/v1/video-generation                - Request video generation
GET    /api/v1/video-generation/:id            - Check generation status
GET    /api/v1/video-generation/:id/videos     - Get generated videos
POST   /api/v1/video-generation/:id/regenerate - Regenerate with different parameters

# Generated Videos
GET    /api/v1/generated-videos/:id            - Get video details
POST   /api/v1/generated-videos/:id/publish    - Mark as published
GET    /api/v1/generated-videos/:id/performance - Get performance metrics
```

### Video Assembly Algorithm

```typescript
async assembleVideo(job: VideoGenerationJob): Promise<GeneratedVideo[]> {
  const assets = await this.loadAssets(job.inputAssets);
  const template = await this.loadTemplate(job.templateId);
  const variants = [];

  for (let i = 0; i < job.parameters.variants; i++) {
    // Generate different hook/sequence for each variant
    const structure = this.createVariantStructure(template, i);
    
    // Assemble scenes
    const scenes = [];
    for (const sceneSpec of structure.scenes) {
      const scene = await this.createScene({
        assets: this.selectAssets(assets, sceneSpec.requirements),
        duration: sceneSpec.duration,
        transitions: sceneSpec.transitions,
        text: this.generateText(sceneSpec.textType, template),
        audio: sceneSpec.audioType
      });
      scenes.push(scene);
    }

    // Render video
    const video = await this.renderVideo({
      scenes,
      platform: job.platformTargets[0],
      brandGuidelines: template.brandGuidelines,
      outputFormat: this.getPlatformFormat(job.platformTargets[0])
    });

    // Generate captions
    const captions = await this.generateCaptions(video);

    // Predict performance
    const prediction = await this.predictPerformance(video, assets);

    variants.push({
      jobId: job.id,
      variantNumber: i + 1,
      videoUrl: video.url,
      captionsUrl: captions.url,
      predictedCtr: prediction.ctr,
      predictedConversionRate: prediction.conversionRate
    });
  }

  return variants;
}
```

### Testing Strategy

1. **Unit Tests**: Asset selection, scene creation, brand guideline validation
2. **Integration Tests**: End-to-end video generation from assets to rendered video
3. **Quality Tests**: Validate video quality, caption accuracy, brand compliance
4. **Performance Tests**: 100 concurrent generation jobs, verify completion within SLA
5. **Manual Tests**: Review sample generated videos for coherence, brand fit, engagement
6. **A/B Tests**: Compare AI-generated vs professional videos on 50 campaigns
