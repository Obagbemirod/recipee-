import { useState } from "react";
import { toast } from "sonner";
import { generateRecipeFromImage, generateMealPlan } from "@/utils/gemini";
import { PhotoUploadSection } from "@/components/PhotoUploadSection";
import RecognizedIngredients from "@/components/RecognizedIngredients";
import IngredientBasedMealPlan from "@/components/IngredientBasedMealPlan";

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
  meals: any[]; // Define a more specific type if needed
}

const GenerateRecipes = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingMealPlan, setIsGeneratingMealPlan] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recognizedIngredients, setRecognizedIngredients] = useState<Ingredient[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  const handleIngredientsIdentified = (ingredients: Ingredient[]) => {
    setRecognizedIngredients(ingredients);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const mockDescription = "A homemade burger with lettuce, tomato, and cheese";
      const generatedRecipe = await generateRecipeFromImage(mockDescription);
      setRecipe(generatedRecipe as Recipe);
      toast.success("Recipe generated successfully!");
    } catch (error) {
      toast.error("Failed to generate recipe. Please try again.");
    } finally {
      setIsUploading(false);
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
          onConfirm={async () => {
            if (recognizedIngredients.length === 0) {
              toast.error("Please add some ingredients first");
              return;
            }

            setIsGeneratingMealPlan(true);
            try {
              const ingredientsList = recognizedIngredients.map(ing => ing.name).join(", ");
              const preferences = [`Generate meals using these ingredients where possible: ${ingredientsList}`];
              const plan = await generateMealPlan(preferences);
              setMealPlan({ ...plan, name: "Ingredient-Based Meal Plan" });
              toast.success("Meal plan generated successfully!");
            } catch (error) {
              console.error("Error generating meal plan:", error);
              toast.error("Failed to generate meal plan. Please try again.");
            } finally {
              setIsGeneratingMealPlan(false);
            }
          }}
        />

        {mealPlan && <IngredientBasedMealPlan mealPlan={mealPlan} />}
      </div>
    </div>
  );
};

export default GenerateRecipes;