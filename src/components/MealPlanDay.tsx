import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { MealCard } from "./meal/MealCard";
import { Meal } from "@/types/meal";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MealPlanDayProps {
  day: string;
  meals: Meal;
  onUpdate: (day: string, meals: Meal) => void;
  readOnly?: boolean;
}

export const MealPlanDay = ({ day, meals, onUpdate, readOnly = false }: MealPlanDayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shuffleMeals = () => {
    if (readOnly) return;
    
    const mealTypes = Object.keys(meals);
    const mealValues = Object.values(meals);
    
    for (let i = mealValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mealValues[i], mealValues[j]] = [mealValues[j], mealValues[i]];
    }
    
    const shuffledMeals = mealTypes.reduce((acc, type, index) => {
      acc[type] = mealValues[index];
      return acc;
    }, {} as Meal);
    
    onUpdate(day, shuffledMeals);
    toast.success(`Meals shuffled for ${day}!`);
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
            {meals && Object.entries(meals).map(([mealType, meal]) => (
              <div key={mealType} className="space-y-2">
                <h3 className="font-medium capitalize text-secondary">{mealType}</h3>
                <MealCard
                  meal={meal}
                  title={mealType}
                  readOnly={readOnly}
                  onUpdate={(updatedMeal) => {
                    if (!readOnly) {
                      const updatedMeals = { ...meals, [mealType]: updatedMeal };
                      onUpdate(day, updatedMeals);
                    }
                  }}
                />
              </div>
            ))}

            {!readOnly && (
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
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};