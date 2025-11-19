import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { askCoach, CoachResponseSchema } from "@repo/ai";

const CoachRequestSchema = z.object({
  question: z.string().min(5),
  user_id: z.string().uuid()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, user_id } = CoachRequestSchema.parse(body);

    const raw = await askCoach(question, user_id);
    const validated = CoachResponseSchema.safeParse(raw);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "INVALID_OUTPUT", raw },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, data: validated.data },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: "REQUEST_ERROR",
        details: err?.message || "unknown"
      },
      { status: 400 }
    );
  }
}
