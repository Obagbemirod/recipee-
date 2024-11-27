import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Nutrition } from "@/types/meal";

interface MealNutritionInfoProps {
  nutrition: Nutrition;
}

export const MealNutritionInfo = ({ nutrition }: MealNutritionInfoProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="bg-accent/50 p-4 rounded-lg">
          <h6 className="font-medium mb-2">Nutritional Information</h6>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Calories: {nutrition.calories}</div>
            <div>Protein: {nutrition.protein}</div>
            <div>Carbs: {nutrition.carbs}</div>
            <div>Fat: {nutrition.fat}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};