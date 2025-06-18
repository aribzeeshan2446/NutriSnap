export interface MacroNutrients {
  protein: number; // in grams
  carbohydrates: number; // in grams
  fat: number; // in grams
}

export interface LogEntry extends MacroNutrients {
  id: string; // Unique ID, e.g., timestamp or UUID
  date: string; // ISO string representation of the date
  foodDescription: string; // Name or description of the food item
  calories: number;
  imageUrl?: string; // Optional URL of the food image if uploaded
  estimatedBy: 'ai' | 'user'; // To distinguish AI estimates from manual entries
}

export interface UserSettings {
  name?: string; // User's display name
  age?: number;
  weight?: number; // in kg
  height?: number; // in cm
  gender?: 'male' | 'female';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dailyCalorieGoal?: number;
  // Add other macronutrient goals if needed
  dailyProteinGoal?: number;
  dailyCarbsGoal?: number;
  dailyFatGoal?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meal {
  id: string;
  userId: string;
  foodItems: FoodItem[];
  totalCalories: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionalGoals {
  userId: string;
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

