import { supabase } from "@/lib/supabase";
import { addDays, isAfter } from "date-fns";

export const checkMealPlanGenerationLimit = async (userId: string, plan: string | null) => {
  if (plan === 'basic') {
    const { data: lastGeneration } = await supabase
      .from('meal_plan_generations')
      .select('generated_at')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (lastGeneration) {
      const nextAllowedDate = addDays(new Date(lastGeneration.generated_at), 7);
      if (isAfter(nextAllowedDate, new Date())) {
        return {
          allowed: false,
          nextAllowedDate
        };
      }
    }
  }
  
  return { allowed: true };
};

export const recordMealPlanGeneration = async (userId: string) => {
  const { error } = await supabase
    .from('meal_plan_generations')
    .insert({
      user_id: userId,
      plan_id: Date.now().toString()
    });

  if (error) throw error;
};

export const checkFeatureAccess = (plan: string | null, feature: 'mealPlan' | 'recipes' | 'ingredients') => {
  if (!plan) return false;
  
  if (plan === 'basic') {
    return feature === 'ingredients';
  }
  
  return true;
};