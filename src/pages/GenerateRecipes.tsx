import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save } from "lucide-react";
import { generateRecipeFromImage } from "@/utils/gemini/generateRecipe";
import { PhotoUploadSection } from "@/components/PhotoUploadSection";
import { CookingGuide } from "@/components/CookingGuide";
import { BrandLogo } from "@/components/BrandLogo";

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleIngredientsIdentified = async (ingredients: Ingredient[]) => {
    try {
      setIsUploading(true);
      const generatedRecipe = await generateRecipeFromImage(ingredients.map(i => i.name).join(", "));
      setRecipe(generatedRecipe);
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
      navigate("/saved-items?source=recipe");
    } catch (error) {
      toast.error("Failed to save recipe");
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/lovable-uploads/cd78387e-c9c1-45e1-9599-f505c716215c.png')` 
      }}
    >
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
            Upload photos of your favourite dishes, and let our AI create a detailed recipe and step-by-step cooking guide for you
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

                <CookingGuide recipe={recipe} />

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