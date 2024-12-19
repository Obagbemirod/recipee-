export interface SavedRecipe {
  id: string;
  user_id: string;
  name: string;
  image_url: string | null;
  ingredients: { item: string; amount: string }[];
  instructions: { step: number; description: string; time: string }[];
  equipment: string[];
  total_time: string;
  difficulty: string;
  servings: number;
  created_at: string;
}

export interface Recipe {
  name: string;
  ingredients: { item: string; amount: string }[];
  instructions: { step: number; description: string; time: string }[];
  equipment: string[];
  totalTime: string;
  difficulty: string;
  servings: number;
}