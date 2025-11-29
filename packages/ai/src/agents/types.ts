/**
 * Types for LLM Agent Architecture
 * Based on agent specifications in .cursor/agents/
 */

// Reasoning Agent Types
export type IntentType =
  | "workout_plan_request"
  | "nutrition_question"
  | "progress_review"
  | "log_workout"
  | "motivation_support"
  | "general_chat";

export interface ReasoningResult {
  intent: IntentType;
  requires_context: boolean;
  context_fields: string[];
  action: string;
  notes: string;
}

// Context Agent Types
export interface ContextResult {
  context_available: boolean;
  requested_context: string[];
  profile: {
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
    activity_level?: string;
    goals?: string[];
    preferences?: string[];
    restrictions?: string[];
    medical_conditions?: string[];
  };
  goals: {
    type?: string;
    target?: string;
    deadline?: string;
    current_progress?: string;
    description?: string;
  }[];
  training_summary: Array<{
    exercise_name: string;
    sets: number;
    reps: number;
    weight?: number;
    date: string;
  }>;
  measurements: Array<{
    type: string;
    value: string;
    unit?: string;
    date: string;
  }>;
  nutrition_summary: Array<{
    meal_type: string;
    foods: Array<{ name: string; amount: string }>;
    date: string;
  }>;
  readiness: {
    energy_level?: string;
    motivation?: string;
    recovery_status?: string;
  };
  embedding_notes: string;
  insights: string[];
}

// Coach Output Agent Types
export interface CoachOutputResult {
  message: string;
  plan: {
    exercise?: string;
    next_load?: string;
    sets?: string;
    reps?: string;
    duration?: string;
    frequency?: string;
  };
  insights: string[];
  next_action: string;
  track_metric: string[];
}

