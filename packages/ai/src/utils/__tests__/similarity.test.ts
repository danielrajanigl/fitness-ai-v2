/**
 * Unit tests for similarity utilities
 * Run with: npm test -- similarity
 */

import { describe, it, expect } from "vitest";
import { cosineSimilarity, findTopSimilar, l2Distance } from "../similarity";

describe("cosineSimilarity", () => {
  it("should return 1 for identical vectors", () => {
    const vec = [1, 2, 3];
    expect(cosineSimilarity(vec, vec)).toBeCloseTo(1, 5);
  });

  it("should return 0 for orthogonal vectors", () => {
    const vec1 = [1, 0, 0];
    const vec2 = [0, 1, 0];
    expect(cosineSimilarity(vec1, vec2)).toBeCloseTo(0, 5);
  });

  it("should return -1 for opposite vectors", () => {
    const vec1 = [1, 0, 0];
    const vec2 = [-1, 0, 0];
    expect(cosineSimilarity(vec1, vec2)).toBeCloseTo(-1, 5);
  });

  it("should throw error for mismatched dimensions", () => {
    const vec1 = [1, 2];
    const vec2 = [1, 2, 3];
    expect(() => cosineSimilarity(vec1, vec2)).toThrow();
  });
});

describe("findTopSimilar", () => {
  const queryVector = [1, 0, 0];

  it("should return top K most similar vectors", () => {
    const candidates = [
      { vector: [1, 0, 0], data: { id: 1, content: "exact match" } },
      { vector: [0.9, 0.1, 0], data: { id: 2, content: "very similar" } },
      { vector: [0.5, 0.5, 0], data: { id: 3, content: "somewhat similar" } },
      { vector: [0, 1, 0], data: { id: 4, content: "orthogonal" } },
    ];

    const results = findTopSimilar(queryVector, candidates, 2);

    expect(results).toHaveLength(2);
    expect(results[0].data.id).toBe(1); // Most similar
    expect(results[1].data.id).toBe(2); // Second most similar
    expect(results[0].similarity).toBeGreaterThan(results[1].similarity);
  });

  it("should handle empty candidates", () => {
    const results = findTopSimilar(queryVector, [], 3);
    expect(results).toHaveLength(0);
  });

  it("should return all if K > candidates.length", () => {
    const candidates = [
      { vector: [1, 0, 0], data: { id: 1 } },
      { vector: [0.9, 0, 0], data: { id: 2 } },
    ];

    const results = findTopSimilar(queryVector, candidates, 10);
    expect(results).toHaveLength(2);
  });
});

describe("l2Distance", () => {
  it("should return 0 for identical vectors", () => {
    const vec = [1, 2, 3];
    expect(l2Distance(vec, vec)).toBe(0);
  });

  it("should calculate correct distance", () => {
    const vec1 = [0, 0, 0];
    const vec2 = [3, 4, 0];
    expect(l2Distance(vec1, vec2)).toBe(5); // 3-4-5 triangle
  });
});

