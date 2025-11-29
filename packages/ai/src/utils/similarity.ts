/**
 * Vector similarity utilities
 * Implements cosine similarity for vector search when RPC function is unavailable
 */

/**
 * Calculate cosine similarity between two vectors
 * Returns a value between -1 and 1, where 1 is identical
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector dimensions must match: ${a.length} !== ${b.length}`);
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) {
    return 0;
  }

  return dotProduct / denominator;
}

/**
 * Find top K most similar vectors using cosine similarity
 */
export function findTopSimilar(
  queryVector: number[],
  candidates: Array<{ vector: number[]; data: any }>,
  topK: number = 3
): Array<{ similarity: number; data: any }> {
  const similarities = candidates.map((candidate) => ({
    similarity: cosineSimilarity(queryVector, candidate.vector),
    data: candidate.data,
  }));

  // Sort by similarity (descending)
  similarities.sort((a, b) => b.similarity - a.similarity);

  // Return top K
  return similarities.slice(0, topK);
}

/**
 * Calculate L2 distance (Euclidean distance)
 * Used as alternative similarity metric
 */
export function l2Distance(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector dimensions must match: ${a.length} !== ${b.length}`);
  }

  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
}

