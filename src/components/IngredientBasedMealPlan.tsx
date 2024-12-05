import { MealPlanDisplay } from "./meal-plan/MealPlanDisplay";

interface IngredientBasedMealPlanProps {
  mealPlan: any;
}

const IngredientBasedMealPlan = ({ mealPlan }: IngredientBasedMealPlanProps) => {
  if (!mealPlan) return null;

  // Ensure the meal plan has the correct structure
  const formattedMealPlan = {
    name: mealPlan.name,
    monday: mealPlan.monday || {},
    tuesday: mealPlan.tuesday || {},
    wednesday: mealPlan.wednesday || {},
    thursday: mealPlan.thursday || {},
    friday: mealPlan.friday || {},
    saturday: mealPlan.saturday || {},
    sunday: mealPlan.sunday || {}
  };

  return (
    <div className="mt-8">
      <MealPlanDisplay 
        mealPlan={formattedMealPlan} 
        setMealPlan={() => {}} // Read-only display
      />
    </div>
  );
};

export default IngredientBasedMealPlan;