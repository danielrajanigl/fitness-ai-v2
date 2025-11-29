/**
 * LLM Context Agent
 * 
 * Fetches ONLY the relevant context based on reasoning agent's intent.
 * Does NOT generate the final answer.
 * 
 * Based on: .cursor/agents/llm-context.md
 */
import { supabaseServer } from "@repo/supabase";
import { embed } from "../model";
import type { ReasoningResult, ContextResult } from "./types";

/**
 * Get relevant context based on intent
 */
export async function contextAgent(
  reasoning: ReasoningResult,
  userId: string
): Promise<ContextResult> {
  const result: ContextResult = {
    context_available: false,
    requested_context: reasoning.context_fields,
    profile: {},
    goals: [],
    training_summary: [],
    measurements: [],
    nutrition_summary: [],
    readiness: {},
    embedding_notes: "",
    insights: [],
  };

  try {
    // Fetch profile data
    if (reasoning.context_fields.includes("profile")) {
      const { data: profileData } = await supabaseServer
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileData) {
        result.profile = {
          age: profileData.age,
          gender: profileData.gender,
          height: profileData.height,
          weight: profileData.weight,
          activity_level: profileData.activity_level,
          goals: profileData.goals || [],
          preferences: profileData.preferences || [],
          restrictions: profileData.restrictions || [],
          medical_conditions: profileData.medical_conditions || [],
        };
      }
    }

    // Fetch fitness goals
    if (reasoning.context_fields.includes("goals")) {
      const { data: goalsData } = await supabaseServer
        .from("fitness_goals")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (goalsData) {
        result.goals = goalsData.map((g) => ({
          type: g.type,
          target: g.target,
          deadline: g.deadline,
          current_progress: g.current_progress,
          description: g.description,
        }));
      }
    }

    // Fetch training logs
    if (reasoning.context_fields.includes("training_logs")) {
      const { data: trainingData } = await supabaseServer
        .from("training_logs")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(10);

      if (trainingData) {
        result.training_summary = trainingData.map((t) => ({
          exercise_name: t.exercise_name,
          sets: t.sets,
          reps: t.reps,
          weight: t.weight,
          date: t.date,
        }));
      }
    }

    // Fetch meal logs
    if (reasoning.context_fields.includes("meal_logs")) {
      const { data: mealData } = await supabaseServer
        .from("meal_logs")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(10);

      if (mealData) {
        result.nutrition_summary = mealData.map((m) => ({
          meal_type: m.meal_type,
          foods: m.foods || [],
          date: m.date,
        }));
      }
    }

    // Fetch measurements
    if (reasoning.context_fields.includes("measurements")) {
      const { data: measurementsData } = await supabaseServer
        .from("measurements")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(10);

      if (measurementsData) {
        result.measurements = measurementsData.map((m) => ({
          type: m.type,
          value: m.value || "",
          unit: m.unit,
          date: m.date,
        }));
      }
    }

    // Fetch relevant embeddings based on intent using improved retriever
    if (reasoning.requires_context) {
      const queryText = getQueryTextForIntent(reasoning.intent);
      const queryEmbedding = await embed(queryText);

      if (queryEmbedding) {
        // Use the improved getRelevantContext function which handles RPC and client-side similarity
        const { getRelevantContext } = await import("../retriever");
        const relevantContext = await getRelevantContext(queryEmbedding, userId, 5);

        if (relevantContext && relevantContext !== "No relevant context found.") {
          const contextLines = relevantContext.split("\n").filter((line) => line.trim());
          result.embedding_notes = `Found ${contextLines.length} relevant context entries via vector similarity search`;
          result.insights = contextLines.slice(0, 3).map((line) => line.substring(0, 200));
        } else {
          result.embedding_notes = "No relevant embeddings found";
        }
      }
    }

    result.context_available =
      Object.keys(result.profile).length > 0 ||
      result.goals.length > 0 ||
      result.training_summary.length > 0 ||
      result.measurements.length > 0 ||
      result.nutrition_summary.length > 0 ||
      result.insights.length > 0;

    return result;
  } catch (error) {
    console.error("Context agent error:", error);
    result.embedding_notes = `Error fetching context: ${error instanceof Error ? error.message : "Unknown error"}`;
    return result;
  }
}

/**
 * Generate query text for embedding based on intent
 */
function getQueryTextForIntent(intent: string): string {
  const intentQueries: Record<string, string> = {
    workout_plan_request: "workout plan exercise training routine",
    nutrition_question: "nutrition diet food meal calories protein",
    progress_review: "progress improvement results achievements",
    log_workout: "workout log training session exercise",
    motivation_support: "motivation encouragement support fitness goals",
    general_chat: "fitness health wellness",
  };

  return intentQueries[intent] || "fitness health";
}

