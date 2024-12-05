import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Clock, ChefHat, Utensils, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Recipe {
  name: string;
  origin?: {
    country: string;
    region: string;
    culturalContext: string;
  };
  ingredients: { item: string; amount: string; notes?: string }[];
  instructions: { step: number; description: string; time: string; technique?: string }[];
  equipment: string[];
  totalTime: string;
  difficulty: string;
  servings: number;
  authenticity?: string;
}

interface CookingGuideProps {
  recipe: Recipe;
}

export const CookingGuide = ({ recipe }: CookingGuideProps) => {
  const [openSections, setOpenSections] = useState({
    origin: false,
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

  const handleSaveRecipe = () => {
    try {
      const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
      const isAlreadySaved = savedRecipes.some((saved: Recipe) => saved.name === recipe.name);
      
      if (!isAlreadySaved) {
        savedRecipes.push(recipe);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        toast.success("Recipe saved successfully!");
      } else {
        toast.error("Recipe already saved!");
      }
    } catch (error) {
      toast.error("Failed to save recipe");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Recipe Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{recipe.name}</DialogTitle>
          <DialogDescription>
            Step-by-step guide to prepare this meal
          </DialogDescription>
        </DialogHeader>

        <Card className="mt-4 p-6 bg-white shadow-lg border-2 border-primary">
          <div className="space-y-6">
            <div className="border-b pb-4">
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
                {recipe.origin && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>{recipe.origin.country}</span>
                  </div>
                )}
              </div>
            </div>

            {recipe.origin && (
              <Collapsible>
                <CollapsibleTrigger
                  onClick={() => toggleSection('origin')}
                  className="flex items-center justify-between w-full text-lg font-semibold text-secondary py-2"
                >
                  <span>Cultural Origin & Context</span>
                  {openSections.origin ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>Country:</strong> {recipe.origin.country}</p>
                    {recipe.origin.region && (
                      <p><strong>Region:</strong> {recipe.origin.region}</p>
                    )}
                    <p><strong>Cultural Context:</strong> {recipe.origin.culturalContext}</p>
                    {recipe.authenticity && (
                      <p><strong>Authenticity Note:</strong> {recipe.authenticity}</p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

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
                      {ingredient.notes && (
                        <span className="text-sm italic ml-2">({ingredient.notes})</span>
                      )}
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
                        <div className="text-sm text-muted-foreground mb-1">
                          Time: {instruction.time}
                          {instruction.technique && (
                            <span className="ml-2">Technique: {instruction.technique}</span>
                          )}
                        </div>
                        <p className="text-muted-foreground">{instruction.description}</p>
                      </li>
                    ))}
                  </ol>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </Card>

        <DialogFooter>
          <Button onClick={handleSaveRecipe}>
            Save Recipe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};