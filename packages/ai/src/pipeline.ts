/**
 * Main coach pipeline using LLM Agent Architecture
 * 
 * Flow: Reasoning Agent → Context Agent → Output Agent
 * 
 * This follows the agent architecture defined in .cursor/agents/
 */
import { reasoningAgent } from "./agents/reasoning";
import { contextAgent } from "./agents/context";
import { coachOutputAgent } from "./agents/output";
import type { CoachResult, CoachErrorResponse } from "./types";
import type { CoachOutputResult } from "./agents/types";

/**
 * Ask the coach a question using the agent architecture
 * 
 * @param question - User's question
 * @param userId - Authenticated user ID
 * @param useCache - Whether to use response caching (default: true)
 */
export async function askCoach(
  question: string, 
  userId: string,
  useCache: boolean = true
): Promise<CoachResult> {
  try {
    // Check cache first (simple question-based caching)
    if (useCache) {
      const cacheKey = `coach:${userId}:${question.trim().toLowerCase()}`;
      // Note: Cache implementation would go here if needed
      // For now, we skip caching as responses should be personalized
    }

    // Step 1: Reasoning Agent - Determine intent
    const reasoning = await reasoningAgent(question);
    console.log("Reasoning result:", reasoning);

    // Step 2: Context Agent - Fetch relevant context based on intent
    const context = await contextAgent(reasoning, userId);
    console.log("Context available:", context.context_available);

    // Step 3: Coach Output Agent - Generate final response
    const output = await coachOutputAgent(question, reasoning, context);

    // Return new agent format with legacy compatibility
    // This allows frontend to use new fields while maintaining backward compatibility
    return {
      // New agent format (primary)
      message: output.message,
      plan: output.plan,
      insights: output.insights,
      next_action: output.next_action,
      track_metric: output.track_metric,
      
      // Legacy format (for backward compatibility)
      summary: output.message,
      training_advice: output.insights.join(" ") || output.message,
      progression_plan: {
        exercise: output.plan.exercise || "",
        next_load: output.plan.next_load || "",
        sets: output.plan.sets || "",
        reps: output.plan.reps || "",
      },
    } as CoachResult;
  } catch (error) {
    const err = error as { message?: string; name?: string };
    console.error("Coach pipeline error:", {
      name: err?.name,
      message: err?.message,
      error,
    });
    return {
      error: "REQUEST_ERROR",
      details: err?.message || "An error occurred in the coach pipeline",
    } as CoachErrorResponse;
  }
}
