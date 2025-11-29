// Data types for fitness AI system

export interface FitnessEmbedding {
  id?: string;
  user_id: string;
  content: string;
  embedding?: number[];
  metadata?: {
    type: DataType;
    source_id?: string;
    category?: string;
    tags?: string[];
  };
  created_at?: string;
}

export enum DataType {
  EXERCISE = 'exercise',
  RECIPE = 'recipe',
  FOOD = 'food',
  HEALTH_DATA = 'health_data',
  USER_PROFILE = 'user_profile',
  TRAINING_LOG = 'training_log',
  MEAL_LOG = 'meal_log',
  GOAL = 'goal',
  TIP = 'tip',
  ARTICLE = 'article'
}

export interface Exercise {
  id?: string;
  name: string;
  description: string;
  muscle_groups: string[];
  equipment?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips?: string[];
  variations?: string[];
}

export interface Recipe {
  id?: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition?: NutritionInfo;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  tags?: string[];
}

export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
}

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  fiber?: number;
}

export interface Food {
  id?: string;
  name: string;
  description?: string;
  nutrition: NutritionInfo;
  category?: string;
  tags?: string[];
}

export interface HealthData {
  id?: string;
  user_id: string;
  type: 'measurement' | 'symptom' | 'medication' | 'allergy' | 'condition';
  value?: string;
  unit?: string;
  date: string;
  notes?: string;
}

export interface TrainingLog {
  id?: string;
  user_id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  date: string;
  notes?: string;
}

export interface MealLog {
  id?: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Array<{
    name: string;
    amount: string;
  }>;
  date: string;
  notes?: string;
}

export interface UserProfile {
  user_id: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals?: string[];
  preferences?: string[];
  restrictions?: string[];
  medical_conditions?: string[];
}

export interface FitnessGoal {
  id?: string;
  user_id: string;
  type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'strength' | 'general';
  target?: string;
  deadline?: string;
  current_progress?: string;
  description: string;
}

// AI Pipeline Types
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaChatResponse {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export interface OllamaEmbeddingResponse {
  embedding?: number[];
  embeddings?: number[][];
}

export interface CoachRequest {
  question: string;
  user_id: string;
}

export interface CoachResponse {
  summary: string;
  training_advice: string;
  progression_plan: {
    exercise: string;
    next_load: string;
    sets: string;
    reps: string;
  };
}

export interface CoachErrorResponse {
  error: 'EMBED_FAIL' | 'INVALID_JSON' | 'REQUEST_ERROR';
  details?: string;
  raw?: string;
}

export type CoachResult = CoachResponse | CoachErrorResponse;

