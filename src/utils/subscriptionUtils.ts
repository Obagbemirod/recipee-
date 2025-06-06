export type SubscriptionPlan = '24_hour_trial' | 'basic' | 'premium' | null;

export interface SubscriptionFeatures {
  imageInputs: boolean;
  videoInputs: boolean;
  textInputs: boolean;
  audioInputs: boolean;
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
  savedItems: boolean;
  uploadIngredients: boolean;
}

const TRIAL_FEATURES: SubscriptionFeatures = {
  imageInputs: true,
  videoInputs: true,
  textInputs: true,
  audioInputs: true,
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
  offlineAccess: 'extended',
  savedItems: true,
  uploadIngredients: true
};

const BASIC_FEATURES: SubscriptionFeatures = {
  imageInputs: true,
  videoInputs: true,
  textInputs: true,
  audioInputs: true,
  mealPlansPerWeek: 0,
  recipeGeneration: false,
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
  offlineAccess: 'limited',
  savedItems: true,
  uploadIngredients: true
};

const PREMIUM_FEATURES: SubscriptionFeatures = {
  imageInputs: true,
  videoInputs: true,
  textInputs: true,
  audioInputs: true,
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
  offlineAccess: 'extended',
  savedItems: true,
  uploadIngredients: true
};

export const PLAN_FEATURES: Record<Exclude<SubscriptionPlan, null>, SubscriptionFeatures> = {
  '24_hour_trial': TRIAL_FEATURES,
  'basic': BASIC_FEATURES,
  'premium': PREMIUM_FEATURES
};

export const checkFeatureAccess = (userPlan: SubscriptionPlan, feature: keyof SubscriptionFeatures): boolean => {
  if (!userPlan) return false;
  return !!PLAN_FEATURES[userPlan]![feature];
};

export const getPlanLimits = (userPlan: SubscriptionPlan): Partial<SubscriptionFeatures> | null => {
  if (!userPlan) return null;
  return PLAN_FEATURES[userPlan] || null;
};