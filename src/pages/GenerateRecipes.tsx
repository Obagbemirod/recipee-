import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Camera, ChevronDown, ChevronUp, Save } from "lucide-react";
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

  const handleIngredientsIdentified = async (ingredients: Ingredient[]) => {
    try {
      setIsUploading(true);
      const generatedRecipe = await generateRecipeFromImage(ingredients.map(i => i.name).join(", "));
      setRecipe(generatedRecipe);
      setShowIngredients(true);
      toast.success("Recipe generated successfully!");
    } catch (error) {
      toast.error("Failed to generate recipe. Please try again.");
    } finally {
      setIsUploading(false);
    }
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="w-32">
            <BrandLogo />
          </div>
        </header>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-secondary text-center">
            AI Recipe Generator
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Upload a photo of your ingredients or prepared dish, and let our AI create a detailed recipe for you
          </p>

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