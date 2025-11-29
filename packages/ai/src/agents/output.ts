/**
 * LLM Coaching Output Agent
 * 
 * Produces the final user-visible response.
 * Formats response according to business logic and domain compliance.
 * 
 * Based on: .cursor/agents/llm-coach-output.md
 */
import { runChat } from "../model";
import type { ReasoningResult, ContextResult, CoachOutputResult } from "./types";

const COACH_OUTPUT_PROMPT = `You are an expert certified strength and conditioning coach.
You provide personalized fitness advice based on user context.

You must output ONLY valid JSON in this exact format:
{
  "message": "Your coaching message to the user (friendly, encouraging, professional)",
  "plan": {
    "exercise": "Exercise name (if applicable)",
    "next_load": "Recommended weight/load",
    "sets": "Number of sets",
    "reps": "Number of reps",
    "duration": "Duration in minutes (if applicable)",
    "frequency": "How often (if applicable)"
  },
  "insights": ["Insight 1", "Insight 2", "Insight 3"],
  "next_action": "What the user should do next",
  "track_metric": ["Metric 1 to track", "Metric 2 to track"]
}

Rules:
- Be encouraging and supportive
- Provide actionable advice
- Reference user's goals and progress when available
- Use professional but friendly tone
- If no specific plan is needed, leave plan fields empty
- Always provide at least one insight
- Always suggest a next action
- Suggest 1-3 metrics to track

If you cannot provide a valid response, return:
{
  "message": "I apologize, but I need more information to help you effectively.",
  "plan": {},
  "insights": ["Please provide more details about your question"],
  "next_action": "Try rephrasing your question with more specifics",
  "track_metric": []
}`;

export async function coachOutputAgent(
  question: string,
  reasoning: ReasoningResult,
  context: ContextResult
): Promise<CoachOutputResult> {
  // Build context summary for the prompt
  const contextSummary = buildContextSummary(context);

  const messages = [
    { role: "system" as const, content: COACH_OUTPUT_PROMPT },
    {
      role: "user" as const,
      content: `User Intent: ${reasoning.intent}
Action Required: ${reasoning.action}

User Context:
${contextSummary}

User Question: ${question}

Provide a personalized coaching response based on the intent, context, and question.`,
    },
  ];

  const response = await runChat(messages);
  const text = response?.message?.content?.trim() || "";

  // Clean JSON if wrapped in code blocks
  let cleanedText = text;
  if (text.startsWith("```")) {
    cleanedText = text.replace(/```json|```/g, "").trim();
  }

  try {
    const result = JSON.parse(cleanedText) as CoachOutputResult;

    // Validate and ensure required fields
    return {
      message: result.message || "I'm here to help you with your fitness journey!",
      plan: result.plan || {},
      insights: Array.isArray(result.insights) ? result.insights : [],
      next_action: result.next_action || "Continue with your current routine",
      track_metric: Array.isArray(result.track_metric) ? result.track_metric : [],
    };
  } catch (error) {
    console.error("Failed to parse coach output:", error);
    console.error("Raw response:", text);

    // Fallback response
    return {
      message: "I understand you're asking about fitness. Based on your question, I'd recommend focusing on consistent training and proper nutrition.",
      plan: {},
      insights: ["Consistency is key to achieving fitness goals"],
      next_action: "Try asking a more specific question for personalized advice",
      track_metric: ["Workout frequency", "Progress photos"],
    };
  }
}

/**
 * Build a text summary of context for the prompt
 */
function buildContextSummary(context: ContextResult): string {
  const parts: string[] = [];

  if (Object.keys(context.profile).length > 0) {
    parts.push(`Profile: ${JSON.stringify(context.profile)}`);
  }

  if (context.goals.length > 0) {
    parts.push(`Goals: ${JSON.stringify(context.goals)}`);
  }

  if (context.training_summary.length > 0) {
    parts.push(`Recent Training: ${JSON.stringify(context.training_summary.slice(0, 5))}`);
  }

  if (context.nutrition_summary.length > 0) {
    parts.push(`Recent Nutrition: ${JSON.stringify(context.nutrition_summary.slice(0, 5))}`);
  }

  if (context.measurements.length > 0) {
    parts.push(`Measurements: ${JSON.stringify(context.measurements.slice(0, 5))}`);
  }

  if (context.insights.length > 0) {
    parts.push(`Relevant Insights: ${context.insights.join("; ")}`);
  }

  return parts.length > 0 ? parts.join("\n") : "No specific context available";
}

