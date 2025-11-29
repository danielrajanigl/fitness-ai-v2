import { embed } from "./model";
import { supabaseServer } from "@repo/supabase";
import type { 
  Exercise, 
  Recipe, 
  Food, 
  HealthData, 
  TrainingLog, 
  MealLog, 
  UserProfile, 
  FitnessGoal,
  DataType,
  FitnessEmbedding
} from "./types";

/**
 * Convert data objects to text content for embedding
 */
export function formatDataForEmbedding(
  data: Exercise | Recipe | Food | HealthData | TrainingLog | MealLog | UserProfile | FitnessGoal,
  type: DataType
): string {
  switch (type) {
    case DataType.EXERCISE:
      const exercise = data as Exercise;
      return `Exercise: ${exercise.name}
Description: ${exercise.description}
Muscle Groups: ${exercise.muscle_groups.join(', ')}
Equipment: ${exercise.equipment?.join(', ') || 'Bodyweight'}
Difficulty: ${exercise.difficulty}
Instructions: ${exercise.instructions.join(' ')}
Tips: ${exercise.tips?.join(' ') || ''}
Variations: ${exercise.variations?.join(', ') || ''}`;

    case DataType.RECIPE:
      const recipe = data as Recipe;
      return `Recipe: ${recipe.name}
Description: ${recipe.description}
Ingredients: ${recipe.ingredients.map(i => `${i.amount} ${i.unit || ''} ${i.name}`).join(', ')}
Instructions: ${recipe.instructions.join(' ')}
Nutrition: ${recipe.nutrition ? `Calories: ${recipe.nutrition.calories}, Protein: ${recipe.nutrition.protein}g, Carbs: ${recipe.nutrition.carbs}g, Fats: ${recipe.nutrition.fats}g` : ''}
Prep Time: ${recipe.prep_time || 0} minutes
Cook Time: ${recipe.cook_time || 0} minutes
Servings: ${recipe.servings || 1}
Tags: ${recipe.tags?.join(', ') || ''}`;

    case DataType.FOOD:
      const food = data as Food;
      return `Food: ${food.name}
Description: ${food.description || ''}
Nutrition per 100g: Calories: ${food.nutrition.calories}, Protein: ${food.nutrition.protein}g, Carbs: ${food.nutrition.carbs}g, Fats: ${food.nutrition.fats}g, Fiber: ${food.nutrition.fiber}g
Category: ${food.category || ''}
Tags: ${food.tags?.join(', ') || ''}`;

    case DataType.HEALTH_DATA:
      const health = data as HealthData;
      return `Health Data: ${health.type}
Value: ${health.value || ''} ${health.unit || ''}
Date: ${health.date}
Notes: ${health.notes || ''}`;

    case DataType.TRAINING_LOG:
      const training = data as TrainingLog;
      return `Training Log: ${training.exercise_name}
Sets: ${training.sets}, Reps: ${training.reps}${training.weight ? `, Weight: ${training.weight}kg` : ''}${training.duration ? `, Duration: ${training.duration}min` : ''}
Date: ${training.date}
Notes: ${training.notes || ''}`;

    case DataType.MEAL_LOG:
      const meal = data as MealLog;
      return `Meal Log: ${meal.meal_type}
Foods: ${meal.foods.map(f => `${f.amount} ${f.name}`).join(', ')}
Date: ${meal.date}
Notes: ${meal.notes || ''}`;

    case DataType.USER_PROFILE:
      const profile = data as UserProfile;
      return `User Profile:
Age: ${profile.age || 'N/A'}, Gender: ${profile.gender || 'N/A'}
Height: ${profile.height || 'N/A'}cm, Weight: ${profile.weight || 'N/A'}kg
Activity Level: ${profile.activity_level || 'N/A'}
Goals: ${profile.goals?.join(', ') || 'None'}
Preferences: ${profile.preferences?.join(', ') || 'None'}
Restrictions: ${profile.restrictions?.join(', ') || 'None'}
Medical Conditions: ${profile.medical_conditions?.join(', ') || 'None'}`;

    case DataType.GOAL:
      const goal = data as FitnessGoal;
      return `Fitness Goal: ${goal.type}
Target: ${goal.target || 'N/A'}
Deadline: ${goal.deadline || 'N/A'}
Current Progress: ${goal.current_progress || 'N/A'}
Description: ${goal.description}`;

    default:
      return JSON.stringify(data);
  }
}

/**
 * Generate embedding and save to database
 */
export async function saveDataWithEmbedding(
  data: Exercise | Recipe | Food | HealthData | TrainingLog | MealLog | UserProfile | FitnessGoal,
  type: DataType,
  userId: string,
  sourceId?: string
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    // Format data as text
    const content = formatDataForEmbedding(data, type);

    // Generate embedding
    const embedding = await embed(content);
    if (!embedding) {
      return { success: false, error: "Failed to generate embedding" };
    }

    // Save to database
    // PostgreSQL vector format: array of numbers, Supabase will convert to vector type
    const { data: result, error } = await supabaseServer
      .from('fitness_embeddings')
      .insert({
        user_id: userId,
        content: content,
        embedding: embedding, // Supabase handles vector conversion
        metadata: {
          type: type,
          source_id: sourceId,
          category: type,
          tags: getTagsFromData(data, type)
        }
      })
      .select('id')
      .single();

    if (error) {
      console.error("Error saving embedding:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: result?.id };
  } catch (error: any) {
    console.error("Error in saveDataWithEmbedding:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

/**
 * Batch save multiple data items with embeddings
 * Optimized with batching and parallel processing
 */
export async function batchSaveDataWithEmbeddings(
  items: Array<{
    data: Exercise | Recipe | Food | HealthData | TrainingLog | MealLog | UserProfile | FitnessGoal;
    type: DataType;
    userId: string;
    sourceId?: string;
  }>,
  batchSize: number = 10,
  parallelLimit: number = 3
): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  // Process in batches to avoid overwhelming the system
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    // Process batch with limited parallelism
    const batchPromises: Promise<void>[] = [];
    let activePromises = 0;

    for (const item of batch) {
      // Wait if we've reached the parallel limit
      if (activePromises >= parallelLimit) {
        await Promise.race(batchPromises);
        batchPromises.splice(
          batchPromises.findIndex((p) => p === batchPromises[0]),
          1
        );
        activePromises--;
      }

      const promise = (async () => {
        try {
          const result = await saveDataWithEmbedding(item.data, item.type, item.userId, item.sourceId);
          if (result.success) {
            success++;
          } else {
            failed++;
            errors.push(`${item.type}: ${result.error}`);
          }
        } catch (error) {
          failed++;
          errors.push(`${item.type}: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      })();

      batchPromises.push(promise);
      activePromises++;
    }

    // Wait for remaining promises in batch
    await Promise.all(batchPromises);
  }

  return { success, failed, errors };
}

/**
 * Extract tags from data based on type
 */
function getTagsFromData(
  data: Exercise | Recipe | Food | HealthData | TrainingLog | MealLog | UserProfile | FitnessGoal,
  type: DataType
): string[] {
  const tags: string[] = [];

  switch (type) {
    case DataType.EXERCISE:
      const exercise = data as Exercise;
      tags.push(...exercise.muscle_groups);
      if (exercise.equipment) tags.push(...exercise.equipment);
      tags.push(exercise.difficulty);
      break;

    case DataType.RECIPE:
      const recipe = data as Recipe;
      if (recipe.tags) tags.push(...recipe.tags);
      break;

    case DataType.FOOD:
      const food = data as Food;
      if (food.category) tags.push(food.category);
      if (food.tags) tags.push(...food.tags);
      break;
  }

  return tags;
}

