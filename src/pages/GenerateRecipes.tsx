import { useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Loader2 } from "lucide-react";
import { generateRecipeFromImage, generateMealPlan, generateRecipe } from "@/utils/gemini";
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
          }}
        />

{/*         {mealPlan && <IngredientBasedMealPlan mealPlan={mealPlan} />} */}
         {isUploading ? (
            <div className="bg-white rounded-lg shadow-md p-8 flex items-center justify-center border-2 border-primary">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-secondary">Generating recipe...</span>
            </div>
          ) : recipe ? (
            <ScrollArea className="bg-white rounded-lg shadow-md p-8 h-[500px] border-2 border-primary hover:border-primary/80 transition-colors">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-secondary">{recipe.name}</h2>
                  <div className="flex gap-4 text-sm text-secondary/70">
                    <span>🕒 {recipe.totalTime}</span>
                    <span>📊 {recipe.difficulty}</span>
                    <span>👥 Serves {recipe.servings}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-secondary">Ingredients</h3>
                  <ul className="list-disc list-inside space-y-1 text-secondary/80">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {ingredient.amount} {ingredient.item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-secondary">Equipment Needed</h3>
                  <ul className="list-disc list-inside space-y-1 text-secondary/80">
                    {recipe.equipment.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-secondary">Instructions</h3>
                  <ol className="list-decimal list-inside space-y-3 text-secondary/80">
                    {recipe.instructions.map((instruction) => (
                      <li key={instruction.step} className="pl-2">
                        <span className="font-medium">({instruction.time})</span>
                        <br />
                        {instruction.description}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </ScrollArea>
          ) : null}
      </div>
    </div>
  );
};

export default GenerateRecipes;
