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
  gender?: 'male' | 'female' | 'other';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dailyCalorieGoal?: number;
  // Add other macronutrient goals if needed
  dailyProteinGoal?: number;
  dailyCarbsGoal?: number;
  dailyFatGoal?: number;
}

