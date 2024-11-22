import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { generateMealPlan } from "@/utils/gemini";

interface Meal {
  breakfast: string;
  lunch: string;
  dinner: string;
}

interface MealPlanDayProps {
  day: string;
  meals: Meal;
  onUpdate: (day: string, meals: Meal) => void;
}

export const MealPlanDay = ({ day, meals, onUpdate }: MealPlanDayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const shuffleMeals = () => {
    const mealArray = [meals.breakfast, meals.lunch, meals.dinner];
    for (let i = mealArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mealArray[i], mealArray[j]] = [mealArray[j], mealArray[i]];
    }
    
    const shuffledMeals = {
      breakfast: mealArray[0],
      lunch: mealArray[1],
      dinner: mealArray[2]
    };
    
    onUpdate(day, shuffledMeals);
    toast.success("Meals shuffled successfully!");
  };

  const regenerateDay = async () => {
    setIsRegenerating(true);
    try {
      const newPlan = await generateMealPlan(["Generate meals for one day only"]);
      const newMeals = Object.values(newPlan)[0];
      onUpdate(day, newMeals as Meal);
      toast.success("Day's meals regenerated successfully!");
    } catch (error) {
      toast.error("Failed to regenerate meals");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold capitalize">{day}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Breakfast:</span>
              <span>{meals.breakfast}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Lunch:</span>
              <span>{meals.lunch}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Dinner:</span>
              <span>{meals.dinner}</span>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={shuffleMeals}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              Shuffle Meals
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={regenerateDay}
              disabled={isRegenerating}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              Regenerate Day
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};