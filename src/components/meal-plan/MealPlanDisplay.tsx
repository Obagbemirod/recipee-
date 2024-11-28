import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MealPlanDay } from "@/components/MealPlanDay";

interface MealPlanDisplayProps {
  mealPlan: any;
  setMealPlan: (plan: any) => void;
}

export const MealPlanDisplay = ({ mealPlan, setMealPlan }: MealPlanDisplayProps) => {
  const navigate = useNavigate();

  const handleSave = () => {
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

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 md:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl font-semibold">
          {mealPlan.name || "Your Weekly Meal Plan"}
        </h2>
        <Button
          onClick={handleSave}
          size="sm"
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save
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
                setMealPlan(prev => ({
                  ...prev,
                  [day]: meals
                }));
              }}
            />
          ))}
      </div>
    </div>
  );
};