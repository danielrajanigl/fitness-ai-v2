import { z } from "zod";

/**
 * Legacy response schema (for backward compatibility)
 */
export const CoachResponseSchema = z.object({
  summary: z.string(),
  training_advice: z.string(),
  progression_plan: z.object({
    exercise: z.string(),
    next_load: z.string(),
    sets: z.string(),
    reps: z.string()
  })
});

/**
 * New agent-based response schema
 * Matches the output from LLM Coach Output Agent
 */
export const CoachOutputResponseSchema = z.object({
  message: z.string(),
  plan: z.object({
    exercise: z.string().optional(),
    next_load: z.string().optional(),
    sets: z.string().optional(),
    reps: z.string().optional(),
    duration: z.string().optional(),
    frequency: z.string().optional(),
  }),
  insights: z.array(z.string()),
  next_action: z.string(),
  track_metric: z.array(z.string()),
});

/**
 * Extended response schema that supports both formats
 * More flexible to handle partial responses from LLM
 */
export const ExtendedCoachResponseSchema = z.union([
  CoachResponseSchema,
  CoachOutputResponseSchema.extend({
    // Legacy fields for backward compatibility
    summary: z.string().optional(),
    training_advice: z.string().optional(),
    progression_plan: z.object({
      exercise: z.string(),
      next_load: z.string(),
      sets: z.string(),
      reps: z.string()
    }).optional(),
  }),
  // Fallback: Accept any object with at least message or summary
  z.object({
    message: z.string().optional(),
    summary: z.string().optional(),
    plan: z.any().optional(),
    insights: z.array(z.string()).optional(),
    next_action: z.string().optional(),
    track_metric: z.array(z.string()).optional(),
    training_advice: z.string().optional(),
    progression_plan: z.any().optional(),
  }).refine(
    (data) => data.message || data.summary,
    { message: "Response must contain either 'message' or 'summary'" }
  ),
]);
