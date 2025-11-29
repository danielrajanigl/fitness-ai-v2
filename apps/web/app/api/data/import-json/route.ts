import { NextRequest, NextResponse } from "next/server";
import { batchSaveDataWithEmbeddings, DataType } from "@repo/ai";
import type { Food, Exercise, Recipe } from "@repo/ai";
import { getServerUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // SECURITY FIX: Get user from session instead of request body
    const user = await getServerUser();
    const userId = user.id;

    const body = await req.json();
    const { 
      jsonData, 
      dataType, 
      mapping 
    } = body;

    if (!jsonData || !Array.isArray(jsonData)) {
      return NextResponse.json(
        { success: false, error: "jsonData must be an array" },
        { status: 400 }
      );
    }

    // Determine data type from parameter or try to infer
    let type: DataType;
    if (dataType) {
      type = dataType as DataType;
    } else {
      // Try to infer from data structure
      const firstItem = jsonData[0];
      if (firstItem.name && firstItem.muscle_groups) {
        type = DataType.EXERCISE;
      } else if (firstItem.name && firstItem.ingredients) {
        type = DataType.RECIPE;
      } else if (firstItem.name && firstItem.nutrition) {
        type = DataType.FOOD;
      } else {
        return NextResponse.json(
          { success: false, error: "Could not determine data type. Please specify 'dataType' parameter." },
          { status: 400 }
        );
      }
    }

    // Transform JSON data to our format
    const transformedItems = jsonData.map((item: any, index: number) => {
      let transformed: Food | Exercise | Recipe;

      if (mapping) {
        // Use custom mapping if provided
        transformed = mapWithCustomMapping(item, mapping, type);
      } else {
        // Use default mapping based on type
        transformed = mapDefault(item, type);
      }

      return {
        data: transformed,
        type: type,
        userId: userId, // Use authenticated user ID
        sourceId: item.id || `imported-${type}-${index}`
      };
    });

    console.log(`Importing ${transformedItems.length} items of type ${type}...`);

    // Batch save with embeddings
    const result = await batchSaveDataWithEmbeddings(transformedItems);

    return NextResponse.json({
      success: true,
      imported: result.success,
      failed: result.failed,
      total: transformedItems.length,
      errors: result.errors,
      dataType: type
    });

  } catch (error: any) {
    console.error("Import error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Map JSON item with custom mapping
 */
function mapWithCustomMapping(item: any, mapping: any, type: DataType): Food | Exercise | Recipe {
  const mapped: any = {};

  // Apply field mappings
  for (const [targetField, sourceField] of Object.entries(mapping)) {
    if (sourceField && item[sourceField as string] !== undefined) {
      mapped[targetField] = item[sourceField as string];
    }
  }

  return mapped as Food | Exercise | Recipe;
}

/**
 * Map JSON item with default mapping based on type
 */
function mapDefault(item: any, type: DataType): Food | Exercise | Recipe {
  switch (type) {
    case DataType.FOOD:
      return {
        name: item.name || item.Name || item.food_name || '',
        description: item.description || item.Description || item.desc || '',
        nutrition: {
          calories: item.calories || item.Calories || item.kcal || 0,
          protein: item.protein || item.Protein || item.protein_g || 0,
          carbs: item.carbs || item.Carbs || item.carbohydrates || item.carbohydrate_g || 0,
          fats: item.fats || item.Fats || item.fat || item.fat_g || 0,
          fiber: item.fiber || item.Fiber || item.fiber_g || 0
        },
        category: item.category || item.Category || item.food_category || '',
        tags: item.tags || item.Tags || (item.category ? [item.category] : [])
      } as Food;

    case DataType.EXERCISE:
      return {
        name: item.name || item.Name || item.exercise_name || '',
        description: item.description || item.Description || item.desc || '',
        muscle_groups: item.muscle_groups || item.muscleGroups || item.muscles || [],
        equipment: item.equipment || item.Equipment || [],
        difficulty: item.difficulty || item.Difficulty || 'beginner',
        instructions: item.instructions || item.Instructions || item.steps || [],
        tips: item.tips || item.Tips || [],
        variations: item.variations || item.Variations || []
      } as Exercise;

    case DataType.RECIPE:
      return {
        name: item.name || item.Name || item.recipe_name || '',
        description: item.description || item.Description || item.desc || '',
        ingredients: item.ingredients || item.Ingredients || [],
        instructions: item.instructions || item.Instructions || item.steps || [],
        nutrition: item.nutrition || {
          calories: item.calories || 0,
          protein: item.protein || 0,
          carbs: item.carbs || 0,
          fats: item.fats || 0
        },
        prep_time: item.prep_time || item.prepTime || 0,
        cook_time: item.cook_time || item.cookTime || 0,
        servings: item.servings || item.Servings || 1,
        tags: item.tags || item.Tags || []
      } as Recipe;

    default:
      throw new Error(`Unsupported data type: ${type}`);
  }
}

