import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { supabaseServer } from "@repo/supabase";

/**
 * Metrics endpoint (protected)
 * Returns user-specific metrics and statistics
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser();
    const supabase = await supabaseServer();

    // Get metrics from database
    const [embeddingsCount, trainingLogsCount, mealLogsCount] = await Promise.all([
      supabase
        .from("fitness_embeddings")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("training_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("meal_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

    const metrics = {
      user_id: user.id,
      timestamp: new Date().toISOString(),
      data: {
        embeddings: embeddingsCount.count || 0,
        training_logs: trainingLogsCount.count || 0,
        meal_logs: mealLogsCount.count || 0,
      },
    };

    logger.info("Metrics retrieved", { userId: user.id, metrics });

    return NextResponse.json(metrics, { status: 200 });
  } catch (error) {
    logger.error("Metrics retrieval failed", error instanceof Error ? error : undefined);
    return NextResponse.json(
      {
        error: "Failed to retrieve metrics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

