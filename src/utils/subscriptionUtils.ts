export type SubscriptionFeatures = {
  uploadIngredients: boolean;
  recipeGeneration: boolean;
  photoRecipes: boolean;
  savedItems: boolean;
  mealPlanning: boolean;
};

export type SubscriptionPlan = 'basic' | 'premium' | '24_hour_trial' | null;

export const checkFeatureAccess = (plan: SubscriptionPlan, feature: keyof SubscriptionFeatures): boolean => {
  if (!plan) return false;

  const featureAccess: Record<SubscriptionPlan, SubscriptionFeatures> = {
    'basic': {
      uploadIngredients: true,
      recipeGeneration: false,
      photoRecipes: false,
      savedItems: true,
      mealPlanning: true
    },
    'premium': {
      uploadIngredients: true,
      recipeGeneration: true,
      photoRecipes: true,
      savedItems: true,
      mealPlanning: true
    },
    '24_hour_trial': {
      uploadIngredients: true,
      recipeGeneration: true,
      photoRecipes: true,
      savedItems: true,
      mealPlanning: true
    },
    'null': {
      uploadIngredients: false,
      recipeGeneration: false,
      photoRecipes: false,
      savedItems: false,
      mealPlanning: false
    }
  };

  return featureAccess[plan]?.[feature] ?? false;
};