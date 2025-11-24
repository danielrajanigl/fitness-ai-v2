import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveDataWithEmbedding, batchSaveDataWithEmbeddings, DataType } from "@repo/ai";
import type { Exercise, Recipe, Food, HealthData, TrainingLog, MealLog, UserProfile, FitnessGoal } from "@repo/ai";

const AddDataSchema = z.object({
  type: z.nativeEnum(DataType),
  data: z.any(), // Will be validated based on type
  user_id: z.string().uuid(),
  source_id: z.string().optional()
});

const BatchAddDataSchema = z.object({
  items: z.array(z.object({
    type: z.nativeEnum(DataType),
    data: z.any(),
    user_id: z.string().uuid(),
    source_id: z.string().optional()
  }))
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Check if it's batch or single
    if (body.items && Array.isArray(body.items)) {
      // Batch mode
      const { items } = BatchAddDataSchema.parse(body);
      
      const result = await batchSaveDataWithEmbeddings(
        items.map(item => ({
          data: item.data,
          type: item.type,
          userId: item.user_id,
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
      const { type, data, user_id, source_id } = AddDataSchema.parse(body);
      
      const result = await saveDataWithEmbedding(data, type, user_id, source_id);

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

    return NextResponse.json(
      {
        success: false,
        error: "REQUEST_ERROR",
        details: error?.message || "unknown"
      },
      { status: 400 }
    );
  }
}

