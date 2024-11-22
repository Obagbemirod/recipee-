import { Button } from "@/components/ui/button";
import { ChefHat, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateMealPlan, identifyIngredients } from "@/utils/gemini";

interface Ingredient {
  name: string;
  quantity?: string;
}

const GenerateMealPlan = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const handleIdentifyIngredients = async (input: string) => {
    try {
      const identified = await identifyIngredients(input);
      setIngredients(identified.map((name: string) => ({ name })));
      toast.success("Ingredients identified successfully!");
    } catch (error) {
      toast.error("Error identifying ingredients");
    }
  };

  const handleEditIngredient = (index: number, newName: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], name: newName };
    setIngredients(newIngredients);
    setIsEditing(null);
  };

  const handleDeleteIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      toast.error("Please add ingredients first");
      return;
    }

    setIsGenerating(true);
    try {
      const plan = await generateMealPlan(ingredients.map(i => i.name));
      setMealPlan(plan);
      toast.success("Meal plan generated successfully!");
    } catch (error) {
      toast.error("Error generating meal plan");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Generate Your Meal Plan</h1>
        
        {/* Ingredients List */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-semibold mb-4">Identified Ingredients</h2>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between">
                {isEditing === index ? (
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) => handleEditIngredient(index, e.target.value)}
                    onBlur={() => setIsEditing(null)}
                    autoFocus
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  <span>{ingredient.name}</span>
                )}
                <div className="space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(index)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteIngredient(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col items-center justify-center gap-6">
            <ChefHat className="h-16 w-16 text-primary" />
            <p className="text-gray-600 text-center">
              Our AI will analyze your ingredients and preferences to create a personalized meal plan.
            </p>
            <Button
              size="lg"
              className="w-full max-w-md"
              onClick={handleGenerate}
              disabled={isGenerating || ingredients.length === 0}
            >
              {isGenerating ? "Generating..." : "Generate Meal Plan"}
            </Button>
          </div>
        </div>

        {/* Meal Plan Display */}
        {mealPlan && (
          <div className="bg-white rounded-lg shadow-md p-8 mt-6">
            <h2 className="text-xl font-semibold mb-4">Your Weekly Meal Plan</h2>
            <div className="space-y-4">
              {Object.entries(mealPlan).map(([day, meals]: [string, any]) => (
                <div key={day} className="border-b pb-4">
                  <h3 className="font-medium mb-2 capitalize">{day}</h3>
                  <div className="space-y-2">
                    {Object.entries(meals).map(([mealType, meal]: [string, any]) => (
                      <div key={mealType}>
                        <span className="font-medium capitalize">{mealType}: </span>
                        <span>{meal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateMealPlan;