import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MealPlanDay } from "@/components/MealPlanDay";
import { useState } from "react";
import { recordMealPlanGeneration } from "@/utils/subscriptionChecks";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface MealPlanProps {
  mealPlan: any;
  readOnly?: boolean;
}

const IngredientBasedMealPlan = ({ mealPlan, readOnly = false }: MealPlanProps) => {
  const navigate = useNavigate();
  const [localMealPlan, setLocalMealPlan] = useState(mealPlan);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const saveMealPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to save meal plans");
        return;
      }

      await recordMealPlanGeneration(user.id);
      
      const savedPlans = JSON.parse(localStorage.getItem('savedMealPlans') || '[]');
      const newPlan = {
        ...localMealPlan,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      };
      savedPlans.push(newPlan);
      localStorage.setItem('savedMealPlans', JSON.stringify(savedPlans));
      toast.success("Meal plan saved successfully!");
      navigate("/saved-items?source=mealPlan");
    } catch (error) {
      toast.error("Failed to save meal plan");
    }
  };

  if (!mealPlan) return null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              {mealPlan.name || "Your Weekly Meal Plan"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Generated on {format(new Date(), "PPpp")}
            </p>
          </div>
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

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setExpandedPlanId(expandedPlanId ? null : mealPlan.id || 'current')}
        >
          {expandedPlanId ? "Hide Details" : "View Details"}
        </Button>

        {expandedPlanId && (
          <div className="border-t mt-4 pt-4">
            <div className="space-y-4">
              {Object.entries(localMealPlan)
                .filter(([key]) => !['name', 'id', 'date'].includes(key))
                .map(([day, meals]: [string, any]) => (
                  <MealPlanDay
                    key={day}
                    day={day}
                    meals={meals}
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
        )}
      </div>
    </Card>
  );
};

export default IngredientBasedMealPlan;