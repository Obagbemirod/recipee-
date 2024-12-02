export type SubscriptionFeatures = {
  uploadIngredients: boolean;
  recipeGeneration: boolean;
  photoRecipes: boolean;
  savedItems: boolean;
  mealPlanning: boolean;
  quickLinks: boolean;
  imageInputs: boolean;
  textInputs: boolean;
};

export type SubscriptionPlan = 'basic' | 'premium' | '24_hour_trial' | null;

export const checkFeatureAccess = (plan: SubscriptionPlan, feature: keyof SubscriptionFeatures): boolean => {
  if (!plan) return false;

  const featureAccess: Record<string, SubscriptionFeatures> = {
    'basic': {
      uploadIngredients: true,
      recipeGeneration: false,
      photoRecipes: false,
      savedItems: true,
      mealPlanning: true,
      quickLinks: true,
      imageInputs: true,
      textInputs: true
    },
    'premium': {
      uploadIngredients: true,
      recipeGeneration: true,
      photoRecipes: true,
      savedItems: true,
      mealPlanning: true,
      quickLinks: true,
      imageInputs: true,
      textInputs: true
    },
    '24_hour_trial': {
      uploadIngredients: true,
      recipeGeneration: true,
      photoRecipes: true,
      savedItems: true,
      mealPlanning: true,
      quickLinks: true,
      imageInputs: true,
      textInputs: true
    }
  };

  return featureAccess[plan]?.[feature] ?? false;
};