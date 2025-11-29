/**
 * Unit tests for coach pipeline
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { askCoach } from "../pipeline";
import { reasoningAgent } from "../agents/reasoning";
import { contextAgent } from "../agents/context";
import { coachOutputAgent } from "../agents/output";

// Mock dependencies
vi.mock("../agents/reasoning");
vi.mock("../agents/context");
vi.mock("../agents/output");
vi.mock("../model", () => ({
  embed: vi.fn(),
  runChat: vi.fn(),
}));

describe("askCoach", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return coach response when all agents succeed", async () => {
    const mockReasoning = {
      intent: "workout_plan_request" as const,
      requires_context: true,
      context_fields: ["training_logs", "goals"],
      action: "generate_workout_plan",
      notes: "User wants workout plan",
    };

    const mockContext = {
      context_available: true,
      requested_context: ["training_logs", "goals"],
      profile: {},
      goals: [],
      training_summary: [],
      measurements: [],
      nutrition_summary: [],
      readiness: {},
      embedding_notes: "",
      insights: [],
    };

    const mockOutput = {
      message: "Here's your workout plan",
      plan: {
        exercise: "Squats",
        next_load: "100kg",
        sets: "3",
        reps: "10",
      },
      insights: ["Focus on form", "Progressive overload"],
      next_action: "Start with warm-up",
      track_metric: ["Weight", "Reps"],
    };

    vi.mocked(reasoningAgent).mockResolvedValue(mockReasoning);
    vi.mocked(contextAgent).mockResolvedValue(mockContext);
    vi.mocked(coachOutputAgent).mockResolvedValue(mockOutput);

    const result = await askCoach("I want a workout plan", "user-123");

    expect(result).toHaveProperty("summary");
    expect(result).toHaveProperty("training_advice");
    expect(result).toHaveProperty("progression_plan");
    expect(reasoningAgent).toHaveBeenCalledWith("I want a workout plan");
    expect(contextAgent).toHaveBeenCalledWith(mockReasoning, "user-123");
    expect(coachOutputAgent).toHaveBeenCalledWith(
      "I want a workout plan",
      mockReasoning,
      mockContext
    );
  });

  it("should handle errors gracefully", async () => {
    vi.mocked(reasoningAgent).mockRejectedValue(new Error("Reasoning failed"));

    const result = await askCoach("test question", "user-123");

    expect(result).toHaveProperty("error");
    expect((result as any).error).toBe("REQUEST_ERROR");
  });
});

