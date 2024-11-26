import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Clock, ChefHat, Utensils } from "lucide-react";

interface Recipe {
  name: string;
  ingredients: { item: string; amount: string }[];
  instructions: { step: number; description: string; time: string }[];
  equipment: string[];
  totalTime: string;
  difficulty: string;
  servings: number;
}

interface CookingGuideProps {
  recipe: Recipe;
}

export const CookingGuide = ({ recipe }: CookingGuideProps) => {
  return (
    <Card className="mt-8 p-6 bg-white shadow-lg border-2 border-primary animate-fade-in">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-secondary mb-2">{recipe.name}</h2>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.totalTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              <span>{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-1">
              <Utensils className="w-4 h-4" />
              <span>Serves {recipe.servings}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-secondary">Ingredients Needed</h3>
          <ul className="list-disc list-inside space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-muted-foreground">
                {ingredient.amount} {ingredient.item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-secondary">Equipment Required</h3>
          <ul className="list-disc list-inside space-y-2">
            {recipe.equipment.map((item, index) => (
              <li key={index} className="text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-secondary">Step-by-Step Instructions</h3>
          <ScrollArea className="h-[300px] pr-4">
            <ol className="space-y-4">
              {recipe.instructions.map((instruction) => (
                <li key={instruction.step} className="border-l-2 border-primary pl-4 ml-4">
                  <div className="font-medium text-secondary">Step {instruction.step}</div>
                  <div className="text-sm text-muted-foreground mb-1">Time: {instruction.time}</div>
                  <p className="text-muted-foreground">{instruction.description}</p>
                </li>
              ))}
            </ol>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
};