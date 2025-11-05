import { Injectable } from '@nestjs/common';
import { AIRecommendation } from '../ai-core.client';

interface CacheEntry {
  recommendations: AIRecommendation[];
  expiresAt: Date;
}

/**
 * Service for caching AI recommendations
 * Uses in-memory Map with TTL expiration
 * TODO: Replace with Redis for production multi-instance deployments
 */
@Injectable()
export class AICacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private ttlSeconds: number;

  constructor() {
    this.ttlSeconds = parseInt(process.env.AI_CACHE_TTL_SECONDS || '3600', 10);
    console.log(`[AICacheService] Initialized with TTL: ${this.ttlSeconds}s`);

    // Cleanup expired entries every 5 minutes
    setInterval(() => this.cleanupExpired(), 5 * 60 * 1000);
  }

  /**
   * Generate cache key for a workspace
   */
  private getCacheKey(workspaceId: string): string {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `workspace:${workspaceId}:recommendations:${today}`;
  }

  /**
   * Get cached recommendations for a workspace
   */
  get(workspaceId: string): AIRecommendation[] | null {
    const key = this.getCacheKey(workspaceId);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (new Date() > entry.expiresAt) {
      this.cache.delete(key);
      console.log(`[AICacheService] Cache expired for ${key}`);
      return null;
    }

    console.log(`[AICacheService] Cache hit for ${key}`);
    return entry.recommendations;
  }

  /**
   * Store recommendations in cache
   */
  set(workspaceId: string, recommendations: AIRecommendation[]): void {
    const key = this.getCacheKey(workspaceId);
    const expiresAt = new Date(Date.now() + this.ttlSeconds * 1000);

    this.cache.set(key, {
      recommendations,
      expiresAt,
    });

    console.log(`[AICacheService] Cached ${recommendations.length} recommendations for ${key}, expires at ${expiresAt.toISOString()}`);
  }

  /**
   * Invalidate cache for a workspace
   */
  invalidate(workspaceId: string): void {
    const key = this.getCacheKey(workspaceId);
    const deleted = this.cache.delete(key);

    if (deleted) {
      console.log(`[AICacheService] Invalidated cache for ${key}`);
    }
  }

  /**
   * Clear all cached entries
   */
  clearAll(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`[AICacheService] Cleared ${size} cache entries`);
  }

  /**
   * Remove expired entries from cache
   */
  private cleanupExpired(): void {
    const now = new Date();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      console.log(`[AICacheService] Cleaned up ${removed} expired cache entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
