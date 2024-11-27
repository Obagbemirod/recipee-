export interface Nutrition {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Ingredient {
  item: string;
  amount: string;
}

export interface CookingStep {
  step: number;
  instruction: string;
  time?: string;
}

export interface MealDetails {
  name: string;
  image?: string;
  nutrition: Nutrition;
  ingredients: Ingredient[];
  steps: CookingStep[];
}

export interface Meal {
  breakfast: MealDetails;
  lunch: MealDetails;
  dinner: MealDetails;
}