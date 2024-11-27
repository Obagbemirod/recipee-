import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Camera, ChevronDown, ChevronUp, Save, Loader2 } from "lucide-react";
import { generateRecipeFromImage } from "@/utils/gemini/generateRecipe";
import { PhotoUploadSection } from "@/components/PhotoUploadSection";
import { CookingGuide } from "@/components/CookingGuide";
import { BrandLogo } from "@/components/BrandLogo";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Recipe {
  name: string;
  ingredients: { item: string; amount: string }[];
  instructions: { step: number; description: string; time: string }[];
  equipment: string[];
  totalTime: string;
  difficulty: string;
  servings: number;
}

interface Ingredient {
  name: string;
  confidence: number;
}

export default function GenerateRecipes() {
  const [isUploading, setIsUploading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showCookingGuide, setShowCookingGuide] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleIngredientsIdentified = (ingredients: Ingredient[]) => {
    // Handle identified ingredients
    console.log('Identified ingredients:', ingredients);
  };

  const handleSaveRecipe = () => {
    if (!recipe) return;
    
    try {
      const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
      savedRecipes.push({
        ...recipe,
        id: Date.now(),
        date: new Date().toISOString(),
        image: imagePreview
      });
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
      toast.success("Recipe saved successfully!");
    } catch (error) {
      toast.error("Failed to save recipe");
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/lovable-uploads/c2c87161-1be4-43d1-a042-e568997de914.png')` 
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <BrandLogo />
        </header>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-secondary text-center">
            Generate Recipes from Photos
          </h1>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6">
            <PhotoUploadSection 
              isUploading={isUploading}
              onIngredientsIdentified={handleIngredientsIdentified}
            />

            {recipe && (
              <div className="mt-6 space-y-4 animate-fade-in">
                <h2 className="text-xl font-semibold text-secondary text-center mb-4">
                  {recipe.name}
                </h2>

                <Collapsible open={showIngredients} className="space-y-2">
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full flex justify-between items-center"
                      onClick={() => setShowIngredients(!showIngredients)}
                    >
                      View Ingredients
                      {showIngredients ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2">
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      <ul className="space-y-2">
                        {recipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex justify-between text-sm">
                            <span>{ingredient.item}</span>
                            <span className="text-muted-foreground">{ingredient.amount}</span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={showCookingGuide} className="space-y-2">
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full flex justify-between items-center"
                      onClick={() => setShowCookingGuide(!showCookingGuide)}
                    >
                      View Cooking Guide
                      {showCookingGuide ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CookingGuide recipe={recipe} />
                  </CollapsibleContent>
                </Collapsible>

                <Button
                  onClick={handleSaveRecipe}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Recipe
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}