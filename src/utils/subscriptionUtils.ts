export type SubscriptionPlan = '24_hour_trial' | 'basic' | 'premium' | null;

export interface SubscriptionFeatures {
  imageInputs: boolean;
  videoInputs: boolean;
  textInputs: boolean;
  audioInputs: boolean;
  ingredientUpdatesPerWeek: number;
  mealPlansPerWeek: number;
  recipeGeneration: boolean;
  nutritionalContent: boolean;
  cookingGuide: boolean;
  notifications: {
    frequency: 'once' | 'thrice' | 'none';
    type: 'basic' | 'advanced';
  };
  groceryListManagement: 'basic' | 'expanded' | 'none';
  marketplaceAccess: 'limited' | 'full' | 'none';
  recipeMasterchef: boolean;
  recipeMonetization: boolean;
  offlineAccess: 'limited' | 'extended' | 'none';
}

export const PLAN_FEATURES: Record<SubscriptionPlan, SubscriptionFeatures | null> = {
  '24_hour_trial': {
    imageInputs: true,
    videoInputs: true,
    textInputs: true,
    audioInputs: true,
    ingredientUpdatesPerWeek: 999,
    mealPlansPerWeek: 999,
    recipeGeneration: true,
    nutritionalContent: true,
    cookingGuide: true,
    notifications: {
      frequency: 'thrice',
      type: 'advanced'
    },
    groceryListManagement: 'expanded',
    marketplaceAccess: 'full',
    recipeMasterchef: true,
    recipeMonetization: true,
    offlineAccess: 'extended'
  },
  'basic': {
    imageInputs: true,
    videoInputs: true,
    textInputs: true,
    audioInputs: false,
    ingredientUpdatesPerWeek: 1,
    mealPlansPerWeek: 7,
    recipeGeneration: true,
    nutritionalContent: true,
    cookingGuide: true,
    notifications: {
      frequency: 'once',
      type: 'basic'
    },
    groceryListManagement: 'basic',
    marketplaceAccess: 'limited',
    recipeMasterchef: false,
    recipeMonetization: false,
    offlineAccess: 'limited'
  },
  'premium': {
    imageInputs: true,
    videoInputs: true,
    textInputs: true,
    audioInputs: true,
    ingredientUpdatesPerWeek: 999,
    mealPlansPerWeek: 999,
    recipeGeneration: true,
    nutritionalContent: true,
    cookingGuide: true,
    notifications: {
      frequency: 'thrice',
      type: 'advanced'
    },
    groceryListManagement: 'expanded',
    marketplaceAccess: 'full',
    recipeMasterchef: true,
    recipeMonetization: true,
    offlineAccess: 'extended'
  },
  'null': null
};

export const checkFeatureAccess = (userPlan: SubscriptionPlan, feature: keyof SubscriptionFeatures): boolean => {
  if (!userPlan || !PLAN_FEATURES[userPlan]) return false;
  return !!PLAN_FEATURES[userPlan]![feature];
};

export const getPlanLimits = (userPlan: SubscriptionPlan): Partial<SubscriptionFeatures> | null => {
  return PLAN_FEATURES[userPlan];
};