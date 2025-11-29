import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * Health check endpoint
 * Returns system status and metrics
 */
export async function GET() {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "0.0.1",
      environment: process.env.NODE_ENV || "development",
      services: {
        ollama: {
          available: !!process.env.OLLAMA_HOST,
          host: process.env.OLLAMA_HOST || "not configured",
        },
        supabase: {
          available: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "not configured",
        },
      },
    };

    logger.info("Health check", { health });

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    logger.error("Health check failed", error instanceof Error ? error : undefined);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 500 }
    );
  }
}

