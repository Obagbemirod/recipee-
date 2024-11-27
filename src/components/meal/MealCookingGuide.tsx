import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { CookingStep, Ingredient } from "@/types/meal";

interface MealCookingGuideProps {
  ingredients: Ingredient[];
  steps: CookingStep[];
}

export const MealCookingGuide = ({ ingredients, steps }: MealCookingGuideProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <BookOpen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-4">
          <div>
            <h6 className="font-medium mb-2">Ingredients</h6>
            <ul className="list-disc list-inside text-sm space-y-1">
              {ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.amount} {ingredient.item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="font-medium mb-2">Cooking Instructions</h6>
            <ol className="list-decimal list-inside text-sm space-y-2">
              {steps.map((step) => (
                <li key={step.step} className="pl-2">
                  {step.instruction}
                  {step.time && <span className="text-xs text-gray-500 ml-2">({step.time})</span>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};