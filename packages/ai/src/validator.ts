import { z } from "zod";

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
