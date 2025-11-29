import { supabaseServer } from "@repo/supabase";
import { findTopSimilar } from "./utils/similarity";

/**
 * Get relevant context using vector similarity search
 * 
 * FIXED: Now uses client-side cosine similarity calculation when RPC fails
 * This provides proper vector similarity search regardless of RPC function overload issues
 */
export async function getRelevantContext(embedding: number[], userId: string, matchCount: number = 3): Promise<string> {
  try {
    // Step 1: Try RPC function first (if it works, use it)
    const rpcAttempts = [
      { query_embedding: embedding, user_id_input: userId, match_count: matchCount },
      { user_id_input: userId, query_embedding: embedding, match_count: matchCount },
      { match_count: matchCount, query_embedding: embedding, user_id_input: userId }
    ];

    for (const params of rpcAttempts) {
      try {
        const { data, error } = await supabaseServer.rpc("match_fitness_context", params);
        
        if (!error && data && data.length > 0) {
          console.log(`✅ RPC function worked! Found ${data.length} results`);
          return data.map((d: any) => d.content).join("\n");
        }
      } catch (err) {
        // Try next parameter order
        continue;
      }
    }

    // Step 2: RPC failed - Use client-side similarity calculation
    console.log("⚠️ RPC function unavailable, using client-side cosine similarity...");
    
    // Fetch all embeddings for the user (with limit for performance)
    const { data: embeddingsData, error: queryError } = await supabaseServer
      .from('fitness_embeddings')
      .select('id, content, embedding, metadata')
      .eq('user_id', userId)
      .limit(100); // Limit to prevent memory issues

    if (queryError) {
      console.error("Query Error:", queryError);
      throw queryError;
    }

    if (!embeddingsData || embeddingsData.length === 0) {
      return "No relevant context found.";
    }

    // Filter out entries without embeddings
    const entriesWithEmbeddings = embeddingsData
      .filter((entry: any) => entry.embedding && Array.isArray(entry.embedding))
      .map((entry: any) => ({
        vector: entry.embedding as number[],
        data: {
          content: entry.content,
          metadata: entry.metadata,
          id: entry.id,
        },
      }));

    if (entriesWithEmbeddings.length === 0) {
      console.warn("No embeddings found in database entries");
      // Fallback: Return recent entries
      return embeddingsData
        .slice(0, matchCount)
        .map((d: any) => d.content)
        .join("\n");
    }

    // Calculate cosine similarity and get top matches
    const topMatches = findTopSimilar(embedding, entriesWithEmbeddings, matchCount);

    if (topMatches.length === 0) {
      return "No relevant context found.";
    }

    console.log(`✅ Client-side similarity found ${topMatches.length} results (similarities: ${topMatches.map(m => m.similarity.toFixed(3)).join(", ")})`);

    // Return content from top matches
    return topMatches.map((match) => match.data.content).join("\n");
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Context retrieval error:", err?.message || error);
    
    // Final fallback: Return empty context
    // The coach will still work, just without personalized context
    return "No relevant context found.";
  }
}
