import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X, Info } from "lucide-react";
import { MealDetails } from "@/types/meal";
import { CookingGuide } from "../CookingGuide";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface MealCardProps {
  meal: MealDetails;
  title: string;
  onUpdate: (meal: MealDetails) => void;
  readOnly?: boolean;
}

export const MealCard = ({ meal, title, onUpdate, readOnly = false }: MealCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(meal.name);

  const handleSave = () => {
    if (!editedName.trim()) {
      toast.error("Meal name cannot be empty");
      return;
    }
    onUpdate({ ...meal, name: editedName.trim() });
    setIsEditing(false);
    toast.success("Meal updated successfully!");
  };

  const handleCancel = () => {
    setEditedName(meal.name);
    setIsEditing(false);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium capitalize text-secondary">{title}</h3>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="p-4">
                <h4 className="font-medium mb-2">Nutritional Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Calories: {meal.nutrition.calories}</div>
                  <div>Protein: {meal.nutrition.protein}</div>
                  <div>Carbs: {meal.nutrition.carbs}</div>
                  <div>Fat: {meal.nutrition.fat}</div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <CookingGuide recipe={{
            name: meal.name,
            ingredients: meal.ingredients,
            instructions: meal.steps.map(step => ({
              step: step.step,
              description: step.instruction,
              time: step.time || "N/A"
            })),
            equipment: [],
            totalTime: "30-45 mins",
            difficulty: "Medium",
            servings: 2
          }} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!readOnly && isEditing ? (
          <>
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="flex-1"
              placeholder="Enter meal name"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="text-green-600 hover:text-green-700"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-secondary hover:text-secondary/90"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <p className="flex-1 text-sm">{meal.name}</p>
            {!readOnly && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
};