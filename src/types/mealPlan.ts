import { MealDetails } from "./meal";

export interface DailyMeals {
  breakfast: MealDetails;
  lunch: MealDetails;
  dinner: MealDetails;
}

export interface WeeklyMealPlan {
  [key: string]: DailyMeals;
}

export interface ParsedMealPlan {
  [day: string]: {
    breakfast?: MealDetails;
    lunch?: MealDetails;
    dinner?: MealDetails;
  };
}