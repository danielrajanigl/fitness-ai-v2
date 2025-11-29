import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { askCoach, ExtendedCoachResponseSchema } from "@repo/ai";
import { getServerUser } from "@/lib/auth";
import { createErrorResponse, logError, ValidationError, AuthError } from "@/lib/errors";
import { logger } from "@/lib/logger";

const CoachRequestSchema = z.object({
  question: z.string().min(5).max(1000), // Added max length for security
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // SECURITY: Get user from session instead of request body
    let user;
    try {
      user = await getServerUser();
    } catch (error) {
      logError(error, { endpoint: "/api/coach", action: "getServerUser" });
      return NextResponse.json(
        createErrorResponse(new AuthError("Authentication required")),
        { status: 401 }
      );
    }

    const userId = user.id;

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      logError(error, { endpoint: "/api/coach", action: "parseBody" });
      return NextResponse.json(
        createErrorResponse(new ValidationError("Invalid JSON in request body")),
        { status: 400 }
      );
    }

    let question: string;
    try {
      const parsed = CoachRequestSchema.parse(body);
      question = parsed.question;
    } catch (error) {
      logError(error, { endpoint: "/api/coach", body });
      return NextResponse.json(
        createErrorResponse(
          new ValidationError("Invalid question format. Question must be 5-1000 characters.")
        ),
        { status: 400 }
      );
    }

    // Input sanitization (basic)
    const sanitizedQuestion = question.trim().replace(/[<>]/g, "");

    if (sanitizedQuestion.length < 5) {
      return NextResponse.json(
        createErrorResponse(new ValidationError("Question is too short (minimum 5 characters)")),
        { status: 400 }
      );
    }

    // Call coach with error handling
    let raw;
    const coachStartTime = Date.now();
    try {
      raw = await askCoach(sanitizedQuestion, userId);
      const coachDuration = Date.now() - coachStartTime;
      logger.logPerformance("askCoach", coachDuration, {
        userId,
        questionLength: sanitizedQuestion.length,
      });
    } catch (error) {
      const coachDuration = Date.now() - coachStartTime;
      logger.error("Coach API call failed", error instanceof Error ? error : undefined, {
        endpoint: "/api/coach",
        userId,
        questionLength: sanitizedQuestion.length,
        duration: `${coachDuration}ms`,
      });
      logError(error, { endpoint: "/api/coach", userId, questionLength: sanitizedQuestion.length });
      return NextResponse.json(
        createErrorResponse(error, true),
        { status: 500 }
      );
    }

    // Validate response (supports both legacy and new format)
    const validated = ExtendedCoachResponseSchema.safeParse(raw);

    if (!validated.success) {
      logError(new Error("Invalid coach response"), {
        endpoint: "/api/coach",
        raw,
        validationErrors: validated.error.errors,
      });
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_OUTPUT",
          message: "The AI response format was invalid. Please try again.",
          ...(process.env.NODE_ENV === "development" ? { raw } : {}),
        },
        { status: 200 }
      );
    }

    const totalDuration = Date.now() - startTime;
    logger.logRequest("POST", "/api/coach", userId, totalDuration);

    return NextResponse.json(
      { 
        success: true, 
        data: validated.data,
        // Include format version for frontend
        format: "extended", // Indicates new agent format is available
        // Include performance metrics in development
        ...(process.env.NODE_ENV === "development" ? { _performance: { duration: `${totalDuration}ms` } } : {}),
      },
      { status: 200 }
    );
  } catch (error) {
    // Catch-all for unexpected errors
    const totalDuration = Date.now() - startTime;
    logger.error("Unexpected error in coach API", error instanceof Error ? error : undefined, {
      endpoint: "/api/coach",
      duration: `${totalDuration}ms`,
    });
    logError(error, { endpoint: "/api/coach" });
    return NextResponse.json(
      createErrorResponse(error),
      { status: 500 }
    );
  }
}
