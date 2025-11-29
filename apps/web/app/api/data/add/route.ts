import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveDataWithEmbedding, batchSaveDataWithEmbeddings, DataType } from "@repo/ai";
import type { Exercise, Recipe, Food, HealthData, TrainingLog, MealLog, UserProfile, FitnessGoal } from "@repo/ai";
import { getServerUser } from "@/lib/auth";

const AddDataSchema = z.object({
  type: z.nativeEnum(DataType),
  data: z.any(), // Will be validated based on type
  source_id: z.string().optional()
});

const BatchAddDataSchema = z.object({
  items: z.array(z.object({
    type: z.nativeEnum(DataType),
    data: z.any(),
    source_id: z.string().optional()
  }))
});

export async function POST(req: NextRequest) {
  try {
    // SECURITY FIX: Get user from session instead of request body
    const user = await getServerUser();
    const userId = user.id;

    const body = await req.json();
    
    // Check if it's batch or single
    if (body.items && Array.isArray(body.items)) {
      // Batch mode
      const { items } = BatchAddDataSchema.parse(body);
      
      const result = await batchSaveDataWithEmbeddings(
        items.map(item => ({
          data: item.data,
          type: item.type,
          userId: userId, // Use authenticated user ID
          sourceId: item.source_id
        }))
      );

      return NextResponse.json({
        success: true,
        saved: result.success,
        failed: result.failed,
        errors: result.errors
      });
    } else {
      // Single item mode
      const { type, data, source_id } = AddDataSchema.parse(body);
      
      const result = await saveDataWithEmbedding(data, type, userId, source_id); // Use authenticated user ID

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        id: result.id
      });
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "VALIDATION_ERROR", details: error.errors },
        { status: 400 }
      );
    }

    const isDevelopment = process.env.NODE_ENV === "development";
    return NextResponse.json(
      {
        success: false,
        error: "REQUEST_ERROR",
        details: isDevelopment ? error?.message : "An error occurred"
      },
      { status: 400 }
    );
  }
}

