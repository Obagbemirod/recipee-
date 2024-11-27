import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Edit2, Save } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MealNutritionInfo } from "./MealNutritionInfo";
import { MealCookingGuide } from "./MealCookingGuide";
import { MealDetails } from "@/types/meal";

interface MealCardProps {
  meal: MealDetails;
  title: string;
  onUpdate: (updatedMeal: MealDetails) => void;
}

export const MealCard = ({ meal, title, onUpdate }: MealCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(meal.name);

  const handleSave = () => {
    onUpdate({ ...meal, name: editedName });
    setIsEditing(false);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-lg">{title}</h4>
        <div className="flex items-center gap-2">
          <MealNutritionInfo nutrition={meal.nutrition} />
          <MealCookingGuide ingredients={meal.ingredients} steps={meal.steps} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        {isEditing ? (
          <>
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="shrink-0"
            >
              <Save className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <h5 className="font-medium">{meal.name}</h5>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="shrink-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};