/**
 * Script to import JSON data into Supabase
 * Usage: 
 *   npx tsx scripts/import-json-to-supabase.ts <path-to-json-file> <dataType> <userId>
 * 
 * Example:
 *   npx tsx scripts/import-json-to-supabase.ts food_category_translated_20251123_162633.json food 69b81e79-0be4-477b-bf77-0e0fb39a02dd
 */

import * as fs from 'fs';
import * as path from 'path';
import { batchSaveDataWithEmbeddings, DataType } from '../packages/ai/src/dataProcessor';
import type { Food, Exercise, Recipe } from '../packages/ai/src/types';

const args = process.argv.slice(2);

if (args.length < 3) {
  console.error('Usage: npx tsx scripts/import-json-to-supabase.ts <json-file> <dataType> <userId>');
  console.error('Example: npx tsx scripts/import-json-to-supabase.ts food_data.json food 69b81e79-0be4-477b-bf77-0e0fb39a02dd');
  process.exit(1);
}

const [jsonFilePath, dataTypeStr, userId] = args;

// Validate data type
const dataType = dataTypeStr as DataType;
if (!Object.values(DataType).includes(dataType)) {
  console.error(`Invalid data type: ${dataTypeStr}`);
  console.error(`Valid types: ${Object.values(DataType).join(', ')}`);
  process.exit(1);
}

// Read JSON file
let jsonData: any[];
try {
  const filePath = path.resolve(jsonFilePath);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  jsonData = JSON.parse(fileContent);
  
  if (!Array.isArray(jsonData)) {
    console.error('JSON file must contain an array');
    process.exit(1);
  }
} catch (error: any) {
  console.error(`Error reading JSON file: ${error.message}`);
  process.exit(1);
}

console.log(`📦 Found ${jsonData.length} items in JSON file`);
console.log(`📝 Data type: ${dataType}`);
console.log(`👤 User ID: ${userId}`);
console.log(`🚀 Starting import...\n`);

// Transform data
function transformItem(item: any, index: number): Food | Exercise | Recipe {
  switch (dataType) {
    case DataType.FOOD:
      return {
        name: item.name || item.Name || item.food_name || `Food ${index}`,
        description: item.description || item.Description || item.desc || '',
        nutrition: {
          calories: parseFloat(item.calories || item.Calories || item.kcal || 0),
          protein: parseFloat(item.protein || item.Protein || item.protein_g || 0),
          carbs: parseFloat(item.carbs || item.Carbs || item.carbohydrates || item.carbohydrate_g || 0),
          fats: parseFloat(item.fats || item.Fats || item.fat || item.fat_g || 0),
          fiber: parseFloat(item.fiber || item.Fiber || item.fiber_g || 0)
        },
        category: item.category || item.Category || item.food_category || '',
        tags: item.tags || item.Tags || (item.category ? [item.category] : [])
      } as Food;

    case DataType.EXERCISE:
      return {
        name: item.name || item.Name || item.exercise_name || `Exercise ${index}`,
        description: item.description || item.Description || item.desc || '',
        muscle_groups: Array.isArray(item.muscle_groups) ? item.muscle_groups : 
                      Array.isArray(item.muscleGroups) ? item.muscleGroups :
                      Array.isArray(item.muscles) ? item.muscles : [],
        equipment: Array.isArray(item.equipment) ? item.equipment : [],
        difficulty: item.difficulty || item.Difficulty || 'beginner',
        instructions: Array.isArray(item.instructions) ? item.instructions : 
                     Array.isArray(item.Instructions) ? item.Instructions :
                     Array.isArray(item.steps) ? item.steps : [],
        tips: Array.isArray(item.tips) ? item.tips : [],
        variations: Array.isArray(item.variations) ? item.variations : []
      } as Exercise;

    case DataType.RECIPE:
      return {
        name: item.name || item.Name || item.recipe_name || `Recipe ${index}`,
        description: item.description || item.Description || item.desc || '',
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
        instructions: Array.isArray(item.instructions) ? item.instructions : 
                     Array.isArray(item.Instructions) ? item.Instructions :
                     Array.isArray(item.steps) ? item.steps : [],
        nutrition: item.nutrition || {
          calories: parseFloat(item.calories || 0),
          protein: parseFloat(item.protein || 0),
          carbs: parseFloat(item.carbs || 0),
          fats: parseFloat(item.fats || 0)
        },
        prep_time: parseInt(item.prep_time || item.prepTime || 0),
        cook_time: parseInt(item.cook_time || item.cookTime || 0),
        servings: parseInt(item.servings || item.Servings || 1),
        tags: Array.isArray(item.tags) ? item.tags : []
      } as Recipe;

    default:
      throw new Error(`Unsupported data type: ${dataType}`);
  }
}

// Prepare items for batch import
const items = jsonData.map((item, index) => ({
  data: transformItem(item, index),
  type: dataType,
  userId: userId,
  sourceId: item.id || `imported-${dataType}-${index}`
}));

// Import
async function importData() {
  try {
    const result = await batchSaveDataWithEmbeddings(items);
    
    console.log(`\n✅ Import complete!`);
    console.log(`   Successfully imported: ${result.success}`);
    console.log(`   Failed: ${result.failed}`);
    
    if (result.errors.length > 0) {
      console.log(`\n❌ Errors:`);
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
  } catch (error: any) {
    console.error(`\n❌ Import failed: ${error.message}`);
    process.exit(1);
  }
}

importData();

