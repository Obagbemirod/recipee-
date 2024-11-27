import { Button } from "@/components/ui/button";
import { ChefHat, X } from "lucide-react";
import { toast } from "sonner";

interface Ingredient {
  name: string;
  confidence: number;
}

interface RecognizedIngredientsProps {
  ingredients: Ingredient[];
  onRemove: (index: number) => void;
  onConfirm: () => void;
  isGenerating?: boolean;
}

const RecognizedIngredients = ({ ingredients, onRemove, onConfirm, isGenerating = false }: RecognizedIngredientsProps) => {
  if (!ingredients.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 border border-primary">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-secondary">Recognized Ingredients</h3>
      </div>
      <div className="h-[200px] mb-4 overflow-y-auto pr-4" style={{ scrollbarWidth: 'thin' }}>
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 bg-accent/10 rounded-md animate-fade-in"
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
                onClick={() => {
                  onRemove(index);
                  toast.success("Ingredient removed!");
                }}
                className="text-destructive hover:text-destructive/90"
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <Button
        onClick={onConfirm}
        className="w-full bg-primary hover:bg-primary/90 text-white"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <ChefHat className="animate-spin mr-2" />
            Generating Meal Plan...
          </>
        ) : (
          <>
            <ChefHat className="mr-2" />
            Continue to Meal Planning
          </>
        )}
      </Button>
    </div>
  );
};

export default RecognizedIngredients;