import { supabaseServer } from "@repo/supabase/server";

export async function getRelevantContext(embedding, userId) {
  const { data, error } = await supabaseServer.rpc("match_fitness_context", {
    match_count: 3,
    query_embedding: embedding,
    user_id_input: userId
  });

  if (error) throw error;
  return data.map(d => d.content).join("\\n");
}
