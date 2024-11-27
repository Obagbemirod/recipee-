import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { generateMealPlan } from "@/utils/gemini";
import { MealCard } from "./meal/MealCard";
import { Meal, MealDetails } from "@/types/meal";

const defaultNutrition = {
  calories: "N/A",
  protein: "N/A",
  carbs: "N/A",
  fat: "N/A",
};

const defaultMealDetails: MealDetails = {
  name: "Meal not available",
  nutrition: defaultNutrition,
  ingredients: [],
  steps: [],
};

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

  const handleMealUpdate = (mealType: keyof Meal, updatedMeal: MealDetails) => {
    onUpdate(day, {
      ...meals,
      [mealType]: updatedMeal
    });
    toast.success(`${mealType} updated successfully!`);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold capitalize">{day}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <MealCard
              meal={meals?.breakfast || defaultMealDetails}
              title="Breakfast"
              onUpdate={(meal) => handleMealUpdate("breakfast", meal)}
            />
            <MealCard
              meal={meals?.lunch || defaultMealDetails}
              title="Lunch"
              onUpdate={(meal) => handleMealUpdate("lunch", meal)}
            />
            <MealCard
              meal={meals?.dinner || defaultMealDetails}
              title="Dinner"
              onUpdate={(meal) => handleMealUpdate("dinner", meal)}
            />
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
          </div>
        </div>
      )}
    </Card>
  );
};