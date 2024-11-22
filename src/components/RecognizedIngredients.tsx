import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface Ingredient {
  name: string;
  confidence: number;
}

interface RecognizedIngredientsProps {
  ingredients: Ingredient[];
  onRemove: (index: number) => void;
  onConfirm: () => void;
}

const RecognizedIngredients = ({ ingredients, onRemove, onConfirm }: RecognizedIngredientsProps) => {
  if (!ingredients.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 border border-primary">
      <h3 className="text-xl font-semibold mb-4 text-secondary">Recognized Ingredients</h3>
      <ScrollArea className="h-[200px] mb-4">
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 bg-accent/10 rounded-md"
            >
              <span className="text-secondary">
                {ingredient.name}
                <span className="text-xs text-secondary/60 ml-2">
                  {Math.round(ingredient.confidence * 100)}% confidence
                </span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="text-destructive hover:text-destructive/90"
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <Button
        onClick={onConfirm}
        className="w-full bg-primary hover:bg-primary/90 text-white"
      >
        Continue to Meal Planning
      </Button>
    </div>
  );
};

export default RecognizedIngredients;