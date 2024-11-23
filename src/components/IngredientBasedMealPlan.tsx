import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MealPlanDay } from "@/components/MealPlanDay";

interface MealPlanProps {
  mealPlan: any;
}

const IngredientBasedMealPlan = ({ mealPlan }: MealPlanProps) => {
  const navigate = useNavigate();

  const saveMealPlan = () => {
    try {
      const savedPlans = JSON.parse(localStorage.getItem('savedMealPlans') || '[]');
      savedPlans.push({
        ...mealPlan,
        id: Date.now(),
        date: new Date().toISOString(),
      });
      localStorage.setItem('savedMealPlans', JSON.stringify(savedPlans));
      toast.success("Meal plan saved successfully!");
      navigate("/saved-items");
    } catch (error) {
      toast.error("Failed to save meal plan");
    }
  };

  if (!mealPlan) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mt-6 border border-primary hover:border-2 transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-secondary">
          Your Weekly Meal Plan
        </h2>
        <Button
          onClick={saveMealPlan}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Plan
        </Button>
      </div>

      <div className="space-y-4">
        {Object.entries(mealPlan)
          .filter(([key]) => key !== 'name')
          .map(([day, meals]: [string, any]) => (
            <MealPlanDay
              key={day}
              day={day}
              meals={meals}
              onUpdate={(day, meals) => {
                // This is handled internally by MealPlanDay
                console.log('Meal updated:', day, meals);
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default IngredientBasedMealPlan;