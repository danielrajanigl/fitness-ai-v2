/**
 * Unit tests for reasoning agent
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { reasoningAgent } from "../../agents/reasoning";
import { runChat } from "../../model";

vi.mock("../../model");

describe("reasoningAgent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should detect workout plan intent", async () => {
    const mockResponse = {
      message: {
        role: "assistant",
        content: JSON.stringify({
          intent: "workout_plan_request",
          requires_context: true,
          context_fields: ["training_logs", "goals"],
          action: "generate_workout_plan",
          notes: "User wants workout plan",
        }),
      },
      done: true,
    };

    vi.mocked(runChat).mockResolvedValue(mockResponse);

    const result = await reasoningAgent("I need a workout plan");

    expect(result.intent).toBe("workout_plan_request");
    expect(result.requires_context).toBe(true);
    expect(result.context_fields).toContain("training_logs");
  });

  it("should detect nutrition intent", async () => {
    const mockResponse = {
      message: {
        role: "assistant",
        content: JSON.stringify({
          intent: "nutrition_question",
          requires_context: true,
          context_fields: ["meal_logs", "profile"],
          action: "answer_nutrition_question",
          notes: "User asking about nutrition",
        }),
      },
      done: true,
    };

    vi.mocked(runChat).mockResolvedValue(mockResponse);

    const result = await reasoningAgent("What should I eat?");

    expect(result.intent).toBe("nutrition_question");
    expect(result.context_fields).toContain("meal_logs");
  });

  it("should fallback to general_chat on invalid intent", async () => {
    const mockResponse = {
      message: {
        role: "assistant",
        content: JSON.stringify({
          intent: "invalid_intent",
          requires_context: false,
          context_fields: [],
          action: "respond",
          notes: "",
        }),
      },
      done: true,
    };

    vi.mocked(runChat).mockResolvedValue(mockResponse);

    const result = await reasoningAgent("Hello");

    expect(result.intent).toBe("general_chat");
  });

  it("should infer intent from keywords when parsing fails", async () => {
    vi.mocked(runChat).mockResolvedValue({
      message: {
        role: "assistant",
        content: "invalid json",
      },
      done: true,
    });

    const result = await reasoningAgent("I want to do some exercises");

    expect(result.intent).toBe("workout_plan_request");
    expect(result.notes).toContain("inferred from keywords");
  });
});

