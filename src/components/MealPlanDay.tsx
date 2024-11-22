import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpDown, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { generateMealPlan } from "@/utils/gemini";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Nutrition {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

interface Ingredient {
  item: string;
  amount: string;
}

interface CookingStep {
  step: number;
  instruction: string;
  time?: string;
}

interface MealDetails {
  name: string;
  image: string;
  nutrition: Nutrition;
  ingredients: Ingredient[];
  steps: CookingStep[];
}

interface Meal {
  breakfast: MealDetails;
  lunch: MealDetails;
  dinner: MealDetails;
}

interface MealPlanDayProps {
  day: string;
  meals: Meal;
  onUpdate: (day: string, meals: Meal) => void;
}

const MealCard = ({ meal, title }: { meal: MealDetails; title: string }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-lg">{title}</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2"
        >
          {showDetails ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      <div className="aspect-video rounded-lg overflow-hidden">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover"
        />
      </div>

      <h5 className="font-medium">{meal.name}</h5>

      <Collapsible open={showDetails}>
        <CollapsibleContent className="space-y-4">
          <div className="bg-accent/50 p-4 rounded-lg">
            <h6 className="font-medium mb-2">Nutritional Information</h6>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Calories: {meal.nutrition.calories}</div>
              <div>Protein: {meal.nutrition.protein}</div>
              <div>Carbs: {meal.nutrition.carbs}</div>
              <div>Fat: {meal.nutrition.fat}</div>
            </div>
          </div>

          <div>
            <h6 className="font-medium mb-2">Ingredients</h6>
            <ul className="list-disc list-inside text-sm space-y-1">
              {meal.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.amount} {ingredient.item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="font-medium mb-2">Cooking Instructions</h6>
            <ol className="list-decimal list-inside text-sm space-y-2">
              {meal.steps.map((step) => (
                <li key={step.step} className="pl-2">
                  {step.instruction}
                  {step.time && <span className="text-xs text-gray-500 ml-2">({step.time})</span>}
                </li>
              ))}
            </ol>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

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
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
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
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <MealCard meal={meals.breakfast} title="Breakfast" />
            <MealCard meal={meals.lunch} title="Lunch" />
            <MealCard meal={meals.dinner} title="Dinner" />
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