import { supabaseServer } from "@repo/supabase";

export async function getRelevantContext(embedding, userId) {
  // PostgreSQL can't resolve function overloads with named parameters from Supabase RPC
  // Workaround: Query the table directly and return recent entries
  // TODO: Fix RPC function overload issue in database or implement similarity calculation client-side
  
  try {
    // Try RPC first with different parameter orders
    const rpcAttempts = [
      { query_embedding: embedding, user_id_input: userId, match_count: 3 },
      { user_id_input: userId, query_embedding: embedding, match_count: 3 },
      { match_count: 3, query_embedding: embedding, user_id_input: userId }
    ];

    for (const params of rpcAttempts) {
      try {
        const { data, error } = await supabaseServer.rpc("match_fitness_context", params);
        
        if (!error && data && data.length > 0) {
          return data.map(d => d.content).join("\n");
        }
      } catch (err) {
        // Try next parameter order
        continue;
      }
    }

    // If all RPC attempts fail, use direct table query as fallback
    console.log("RPC failed, using direct table query as fallback...");
    
    const { data: embeddingsData, error: queryError } = await supabaseServer
      .from('fitness_embeddings')
      .select('content')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);

    if (queryError) {
      console.error("Query Error:", queryError);
      throw queryError;
    }

    if (!embeddingsData || embeddingsData.length === 0) {
      return "No relevant context found.";
    }

    // Return content without similarity ranking (fallback mode)
    return embeddingsData.map(d => d.content).join("\n");
  } catch (error: any) {
    console.error("Context retrieval error:", error);
    
    // Final fallback: Return empty context
    // The coach will still work, just without personalized context
    return "No relevant context found.";
  }
}
