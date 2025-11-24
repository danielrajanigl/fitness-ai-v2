import { NextResponse } from "next/server";
import { supabaseServer } from "@repo/supabase";
import { embed } from "@repo/ai";

export async function GET() {
  try {
    // Generate a test embedding
    const testEmbedding = await embed("test query");
    
    if (!testEmbedding) {
      return NextResponse.json({
        success: false,
        error: "Could not generate embedding"
      }, { status: 500 });
    }

    const userId = "69b81e79-0be4-477b-bf77-0e0fb39a02dd";
    
    // Try different parameter orders
    const attempts = [
      {
        name: "Order 1: query_embedding, match_count, user_id_input",
        params: {
          query_embedding: testEmbedding,
          match_count: 3,
          user_id_input: userId
        }
      },
      {
        name: "Order 2: query_embedding, user_id_input, match_count",
        params: {
          query_embedding: testEmbedding,
          user_id_input: userId,
          match_count: 3
        }
      },
      {
        name: "Order 3: match_count, query_embedding, user_id_input",
        params: {
          match_count: 3,
          query_embedding: testEmbedding,
          user_id_input: userId
        }
      }
    ];

    const results = [];

    for (const attempt of attempts) {
      try {
        const { data, error } = await supabaseServer.rpc("match_fitness_context", attempt.params);
        
        if (error) {
          results.push({
            ...attempt,
            success: false,
            error: error.message,
            code: error.code,
            details: error.details
          });
        } else {
          results.push({
            ...attempt,
            success: true,
            dataCount: data?.length || 0,
            data: data
          });
          // If one works, return it
          return NextResponse.json({
            success: true,
            workingOrder: attempt.name,
            embeddingDimension: testEmbedding.length,
            results: results
          });
        }
      } catch (err: any) {
        results.push({
          ...attempt,
          success: false,
          error: err?.message || "Unknown error"
        });
      }
    }

    return NextResponse.json({
      success: false,
      error: "All parameter orders failed",
      embeddingDimension: testEmbedding.length,
      results: results
    }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || "Unknown error",
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 });
  }
}

