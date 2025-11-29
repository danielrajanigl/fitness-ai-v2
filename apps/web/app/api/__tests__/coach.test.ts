/**
 * Integration tests for coach API route
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../coach/route";
import { NextRequest } from "next/server";
import { getServerUser } from "@/lib/auth";
import { askCoach } from "@repo/ai";

// Mock dependencies
vi.mock("@/lib/auth");
vi.mock("@repo/ai");

describe("POST /api/coach", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return coach response for valid request", async () => {
    const mockUser = { id: "user-123", email: "test@example.com" };
    const mockCoachResponse = {
      summary: "Test summary",
      training_advice: "Test advice",
      progression_plan: {
        exercise: "Squats",
        next_load: "100kg",
        sets: "3",
        reps: "10",
      },
    };

    vi.mocked(getServerUser).mockResolvedValue(mockUser as any);
    vi.mocked(askCoach).mockResolvedValue(mockCoachResponse);

    const request = new NextRequest("http://localhost:3000/api/coach", {
      method: "POST",
      body: JSON.stringify({ question: "What workout should I do?" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockCoachResponse);
    expect(askCoach).toHaveBeenCalledWith("What workout should I do?", "user-123");
  });

  it("should return 401 for unauthenticated request", async () => {
    vi.mocked(getServerUser).mockRejectedValue(new Error("Unauthorized"));

    const request = new NextRequest("http://localhost:3000/api/coach", {
      method: "POST",
      body: JSON.stringify({ question: "Test question" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("AUTH_ERROR");
  });

  it("should return 400 for invalid question", async () => {
    const mockUser = { id: "user-123", email: "test@example.com" };
    vi.mocked(getServerUser).mockResolvedValue(mockUser as any);

    const request = new NextRequest("http://localhost:3000/api/coach", {
      method: "POST",
      body: JSON.stringify({ question: "Hi" }), // Too short
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("VALIDATION_ERROR");
  });

  it("should handle coach errors gracefully", async () => {
    const mockUser = { id: "user-123", email: "test@example.com" };
    vi.mocked(getServerUser).mockResolvedValue(mockUser as any);
    vi.mocked(askCoach).mockRejectedValue(new Error("Ollama connection failed"));

    const request = new NextRequest("http://localhost:3000/api/coach", {
      method: "POST",
      body: JSON.stringify({ question: "What should I do?" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
  });
});

