/**
 * Simple in-memory cache for API responses
 * For production, consider using Redis or similar
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set value in cache with TTL (time to live in milliseconds)
   */
  set<T>(key: string, value: T, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data: value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Delete value from cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
export const cache = new SimpleCache();

// Clean expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    cache.cleanExpired();
  }, 5 * 60 * 1000);
}

/**
 * Generate cache key for coach requests
 */
export function getCoachCacheKey(question: string, userId: string): string {
  // Normalize question for cache key
  const normalized = question.trim().toLowerCase().replace(/\s+/g, " ");
  return `coach:${userId}:${normalized}`;
}

/**
 * Generate cache key for embeddings
 */
export function getEmbeddingCacheKey(text: string): string {
  const normalized = text.trim().toLowerCase().replace(/\s+/g, " ");
  // Use hash for long texts
  if (normalized.length > 100) {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `embedding:${Math.abs(hash)}`;
  }
  return `embedding:${normalized}`;
}

