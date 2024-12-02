import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MealPlanDay } from "@/components/MealPlanDay";
import { useState } from "react";
import { recordMealPlanGeneration } from "@/utils/subscriptionChecks";
import { supabase } from "@/lib/supabase";

interface MealPlanProps {
  mealPlan: any;
  readOnly?: boolean;
}

const IngredientBasedMealPlan = ({ mealPlan, readOnly = false }: MealPlanProps) => {
  const navigate = useNavigate();
  const [localMealPlan, setLocalMealPlan] = useState(mealPlan);
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const saveMealPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to save meal plans");
        return;
      }

      await recordMealPlanGeneration(user.id);
      
      const savedPlans = JSON.parse(localStorage.getItem('savedMealPlans') || '[]');
      savedPlans.push({
        ...localMealPlan,
        id: Date.now(),
        date: new Date().toISOString(),
      });
      localStorage.setItem('savedMealPlans', JSON.stringify(savedPlans));
      toast.success("Meal plan saved successfully!");
      navigate("/saved-items?source=mealPlan");
    } catch (error) {
      console.error("Error saving meal plan:", error);
      toast.error("Failed to save meal plan");
    }
  };

  if (!mealPlan) {
    console.error("No meal plan data provided");
    return null;
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 md:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl font-semibold">
          {mealPlan.name || "Your Weekly Meal Plan"}
        </h2>
        {!readOnly && (
          <Button
            onClick={saveMealPlan}
            size="sm"
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {days.map((day) => (
          <MealPlanDay
            key={day}
            day={day}
            meals={localMealPlan[day] || {
              breakfast: { name: "No meal planned", nutrition: {} },
              lunch: { name: "No meal planned", nutrition: {} },
              dinner: { name: "No meal planned", nutrition: {} }
            }}
            readOnly={readOnly}
            onUpdate={(day, meals) => {
              if (!readOnly) {
                setLocalMealPlan(prev => ({
                  ...prev,
                  [day]: meals
                }));
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default IngredientBasedMealPlan;