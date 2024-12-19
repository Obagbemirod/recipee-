import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Clock, ChefHat, Utensils, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

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
  file?: File;
}

export const CookingGuide = ({ recipe, file }: CookingGuideProps) => {
  const [openSections, setOpenSections] = useState({
    ingredients: false,
    equipment: false,
    instructions: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSaveRecipe = async () => {
    if (!user) {
      toast.error("Please login to save recipes");
      return;
    }

    console.log("image -- ", file)
    console.log("recipe -- ", recipe)

    setIsSaving(true);
    try {

      const fileName = `${Date.now()}_recipe.jpg`;

      const { data, error } = await supabase.storage
        .from("profile_images")
        .upload(fileName, file);

      if (error) {
        throw new Error("Failed to upload image");
      }
      const { data: publicUrlData } = supabase.storage
        .from("profile_images")
        .getPublicUrl(fileName);

      const { error: saveRecipeError } = await supabase
        .from('saved_recipes')
        .insert({
          user_id: user.id,
          name: recipe.name,
          image_url: "",
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          equipment: recipe.equipment,
          total_time: recipe.totalTime,
          difficulty: recipe.difficulty,
          servings: recipe.servings
        });

      if (saveRecipeError) throw saveRecipeError;

      toast.success("Recipe saved successfully!");
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error("Failed to save recipe");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to decode base64
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
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
            {/* <RecipeHeader
              totalTime={recipe.totalTime}
              difficulty={recipe.difficulty}
              servings={recipe.servings}
            />

            <RecipeSection
              title="Ingredients Needed"
              isOpen={openSections.ingredients}
              onToggle={() => toggleSection('ingredients')}
            >
              <ul className="list-disc list-inside space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-muted-foreground">
                    {ingredient.amount} {ingredient.item}
                  </li>
                ))}
              </ul>
            </RecipeSection> */}

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

        <DialogFooter>
          <Button onClick={handleSaveRecipe} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Recipe'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};