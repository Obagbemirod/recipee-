import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpDown, RefreshCw, Edit2, Save, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { generateMealPlan } from "@/utils/gemini";
import { MealCard } from "./meal/MealCard";
import { Meal, MealDetails } from "@/types/meal";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  return (
    <Card className="p-4">
      <Collapsible open={isExpanded}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between"
          >
            <span className="text-lg font-semibold capitalize">{day}</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <MealCard
                meal={meals?.breakfast || defaultMealDetails}
                title="Breakfast"
                onUpdate={(meal) => onUpdate(day, { ...meals, breakfast: meal })}
              />
              <MealCard
                meal={meals?.lunch || defaultMealDetails}
                title="Lunch"
                onUpdate={(meal) => onUpdate(day, { ...meals, lunch: meal })}
              />
              <MealCard
                meal={meals?.dinner || defaultMealDetails}
                title="Dinner"
                onUpdate={(meal) => onUpdate(day, { ...meals, dinner: meal })}
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={shuffleMeals}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline">Shuffle Meals</span>
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};