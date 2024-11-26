import { useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Loader2 } from "lucide-react";
import { generateRecipeFromImage, generateMealPlan } from "@/utils/gemini";
import { PhotoUploadSection } from "@/components/PhotoUploadSection";
import RecognizedIngredients from "@/components/RecognizedIngredients";
import IngredientBasedMealPlan from "@/components/IngredientBasedMealPlan";
import { CookingGuide } from "@/components/CookingGuide";

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

interface MealPlan {
  name: string;
  meals: any[];
}

const GenerateRecipes = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingMealPlan, setIsGeneratingMealPlan] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recognizedIngredients, setRecognizedIngredients] = useState<Ingredient[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [showCookingGuide, setShowCookingGuide] = useState(false);

  const handleIngredientsIdentified = (ingredients: Ingredient[]) => {
    setRecognizedIngredients(ingredients);
    setShowCookingGuide(false);
  };

  const handleContinueToMealPlanning = async () => {
    setIsGeneratingMealPlan(true);
    try {
      const mockDescription = recognizedIngredients.map(ing => ing.name).join(", ");
      const generatedRecipe = await generateRecipeFromImage(mockDescription);
      setRecipe(generatedRecipe as Recipe);
      setShowCookingGuide(true);
      toast.success("Cooking guide generated successfully!");
    } catch (error) {
      toast.error("Failed to generate cooking guide. Please try again.");
    } finally {
      setIsGeneratingMealPlan(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-secondary">Generate Recipes from Photos</h1>

        <PhotoUploadSection 
          isUploading={isUploading} 
          onIngredientsIdentified={handleIngredientsIdentified} 
        />

        <RecognizedIngredients
          ingredients={recognizedIngredients}
          onRemove={(index) => {
            setRecognizedIngredients(prev => prev.filter((_, i) => i !== index));
          }}
          onConfirm={handleContinueToMealPlanning}
          isGenerating={isGeneratingMealPlan}
        />

        {showCookingGuide && recipe && (
          <CookingGuide recipe={recipe} />
        )}
      </div>
    </div>
  );
};

export default GenerateRecipes;
