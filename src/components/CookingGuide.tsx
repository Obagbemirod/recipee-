import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Clock, ChefHat, Utensils, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const [openSections, setOpenSections] = useState({
    ingredients: false,
    equipment: false,
    instructions: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Card className="mt-8 p-6 bg-white shadow-lg border-2 border-primary animate-fade-in">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-secondary mb-2">{recipe.name}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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

        <Collapsible>
          <CollapsibleTrigger
            onClick={() => toggleSection('ingredients')}
            className="flex items-center justify-between w-full text-lg font-semibold text-secondary py-2"
          >
            <span>Ingredients Needed</span>
            {openSections.ingredients ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <ul className="list-disc list-inside space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-muted-foreground">
                  {ingredient.amount} {ingredient.item}
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger
            onClick={() => toggleSection('equipment')}
            className="flex items-center justify-between w-full text-lg font-semibold text-secondary py-2"
          >
            <span>Equipment Required</span>
            {openSections.equipment ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <ul className="list-disc list-inside space-y-2">
              {recipe.equipment.map((item, index) => (
                <li key={index} className="text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger
            onClick={() => toggleSection('instructions')}
            className="flex items-center justify-between w-full text-lg font-semibold text-secondary py-2"
          >
            <span>Step-by-Step Instructions</span>
            {openSections.instructions ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
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
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
};