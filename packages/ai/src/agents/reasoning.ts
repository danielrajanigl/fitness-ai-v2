/**
 * LLM Reasoning Agent
 * 
 * Determines user intent and decides what context is needed.
 * Does NOT generate the final answer.
 * 
 * Based on: .cursor/agents/llm-reasoning.md
 */
import { runChat } from "../model";
import type { IntentType, ReasoningResult } from "./types";

const REASONING_PROMPT = `You are an intent detection agent for a fitness AI coach.
Your role is to understand the user's question and determine their intent.

Allowed intents:
- workout_plan_request: User wants a workout plan or exercise recommendations
- nutrition_question: User asks about nutrition, diet, or food
- progress_review: User wants to review their progress or get feedback
- log_workout: User wants to log a workout or training session
- motivation_support: User needs motivation or encouragement
- general_chat: General conversation or unclear intent

Output ONLY valid JSON in this exact format:
{
  "intent": "workout_plan_request",
  "requires_context": true,
  "context_fields": ["training_logs", "goals", "profile"],
  "action": "generate_workout_plan",
  "notes": "User wants a new workout plan based on their goals"
}

Context fields can include:
- profile: User profile data (age, gender, goals, etc.)
- goals: Fitness goals
- training_logs: Past workout history
- meal_logs: Nutrition history
- measurements: Body measurements
- health_data: Health information

If you cannot determine intent, use "general_chat".`;

export async function reasoningAgent(question: string): Promise<ReasoningResult> {
  const messages = [
    { role: "system" as const, content: REASONING_PROMPT },
    { role: "user" as const, content: `Question: ${question}` },
  ];

  const response = await runChat(messages);
  const text = response?.message?.content?.trim() || "";

  // Clean JSON if wrapped in code blocks
  let cleanedText = text;
  if (text.startsWith("```")) {
    cleanedText = text.replace(/```json|```/g, "").trim();
  }

  try {
    const result = JSON.parse(cleanedText) as ReasoningResult;

    // Validate intent
    const validIntents: IntentType[] = [
      "workout_plan_request",
      "nutrition_question",
      "progress_review",
      "log_workout",
      "motivation_support",
      "general_chat",
    ];

    if (!validIntents.includes(result.intent)) {
      console.warn(`Invalid intent "${result.intent}", defaulting to "general_chat"`);
      result.intent = "general_chat";
    }

    // Ensure required fields
    return {
      intent: result.intent,
      requires_context: result.requires_context ?? true,
      context_fields: result.context_fields ?? [],
      action: result.action ?? "respond",
      notes: result.notes ?? "",
    };
  } catch (error) {
    console.error("Failed to parse reasoning result:", error);
    console.error("Raw response:", text);

    // Fallback: Try to infer intent from keywords
    const lowerQuestion = question.toLowerCase();
    let inferredIntent: IntentType = "general_chat";

    if (lowerQuestion.includes("workout") || lowerQuestion.includes("exercise") || lowerQuestion.includes("training")) {
      inferredIntent = "workout_plan_request";
    } else if (lowerQuestion.includes("nutrition") || lowerQuestion.includes("diet") || lowerQuestion.includes("food") || lowerQuestion.includes("meal")) {
      inferredIntent = "nutrition_question";
    } else if (lowerQuestion.includes("progress") || lowerQuestion.includes("improve") || lowerQuestion.includes("better")) {
      inferredIntent = "progress_review";
    } else if (lowerQuestion.includes("log") || lowerQuestion.includes("record")) {
      inferredIntent = "log_workout";
    } else if (lowerQuestion.includes("motivation") || lowerQuestion.includes("encourage") || lowerQuestion.includes("support")) {
      inferredIntent = "motivation_support";
    }

    return {
      intent: inferredIntent,
      requires_context: true,
      context_fields: inferredIntent === "workout_plan_request" ? ["training_logs", "goals", "profile"] : ["profile", "goals"],
      action: "respond",
      notes: "Intent inferred from keywords due to parsing error",
    };
  }
}

