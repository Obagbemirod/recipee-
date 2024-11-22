import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateRecipeFromImage } from "@/utils/gemini";

interface Recipe {
  name: string;
  ingredients: { item: string; amount: string }[];
  instructions: { step: number; description: string; time: string }[];
  equipment: string[];
  totalTime: string;
  difficulty: string;
  servings: number;
}

const GenerateRecipes = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const mockDescription = "A homemade burger with lettuce, tomato, and cheese";
      const generatedRecipe = await generateRecipeFromImage(mockDescription);
      setRecipe(generatedRecipe);
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
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow-md p-8 border-2 border-primary hover:border-primary/80 transition-colors">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/50 rounded-lg cursor-pointer hover:bg-accent/50 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Image className="h-12 w-12 text-primary mb-4" />
                <p className="mb-2 text-sm text-secondary">
                  <span className="font-semibold">Upload a photo of your dish</span>
                </p>
                <p className="text-xs text-secondary/70">PNG, JPG or HEIC (MAX. 10MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </div>

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
    </div>
  );
};

export default GenerateRecipes;