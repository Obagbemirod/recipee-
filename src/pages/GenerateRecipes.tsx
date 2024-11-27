import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Loader2, ChevronDown, ChevronUp, Save } from "lucide-react";
import { generateRecipeFromImage } from "@/utils/gemini/generateRecipe";
import { PhotoUploadSection } from "@/components/PhotoUploadSection";
import RecognizedIngredients from "@/components/RecognizedIngredients";
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

const GenerateRecipes = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recognizedIngredients, setRecognizedIngredients] = useState<Ingredient[]>([]);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showCookingGuide, setShowCookingGuide] = useState(false);

  const handleIngredientsIdentified = (ingredients: Ingredient[]) => {
    setRecognizedIngredients(ingredients);
    setShowIngredients(true);
    setShowCookingGuide(false);
  };

  const handleSaveRecipe = () => {
    if (!recipe) return;
    
    try {
      const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
      savedRecipes.push({
        ...recipe,
        id: Date.now(),
        date: new Date().toISOString(),
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
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/lovable-uploads/c2c87161-1be4-43d1-a042-e568997de914.png')` 
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <BrandLogo />
        </header>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white text-center">
            Generate Recipes from Photos
          </h1>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6">
            <PhotoUploadSection 
              isUploading={isUploading} 
              onIngredientsIdentified={handleIngredientsIdentified} 
            />

            {recognizedIngredients.length > 0 && (
              <div className="mt-6 space-y-4">
                <Collapsible open={showIngredients}>
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
                  <CollapsibleContent className="mt-4">
                    <RecognizedIngredients
                      ingredients={recognizedIngredients}
                      onRemove={(index) => {
                        setRecognizedIngredients(prev => prev.filter((_, i) => i !== index));
                      }}
                      onConfirm={async () => {
                        setIsGeneratingRecipe(true);
                        try {
                          const ingredientsList = recognizedIngredients.map(ing => ing.name).join(", ");
                          const generatedRecipe = await generateRecipeFromImage(ingredientsList);
                          setRecipe(generatedRecipe as Recipe);
                          setShowCookingGuide(true);
                          toast.success("Recipe generated successfully!");
                        } catch (error) {
                          toast.error("Failed to generate recipe");
                        } finally {
                          setIsGeneratingRecipe(false);
                        }
                      }}
                      isGenerating={isGeneratingRecipe}
                    />
                  </CollapsibleContent>
                </Collapsible>

                {recipe && (
                  <div className="space-y-4">
                    <Collapsible open={showCookingGuide}>
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
                      <CollapsibleContent className="mt-4">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateRecipes;