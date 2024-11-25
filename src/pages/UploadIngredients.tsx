import { useState } from "react";
import { PhotoUploadSection } from "@/components/PhotoUploadSection";
import { VideoUploadSection } from "@/components/VideoUploadSection";
import { AudioRecordingSection } from "@/components/AudioRecordingSection";
import { TextInputSection } from "@/components/TextInputSection";
import RecognizedIngredients from "@/components/RecognizedIngredients";
import IngredientBasedMealPlan from "@/components/IngredientBasedMealPlan";
import { toast } from "sonner";
import { generateMealPlan } from "@/utils/gemini";

interface Ingredient {
  name: string;
  confidence: number;
}

const UploadIngredients = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingMealPlan, setIsGeneratingMealPlan] = useState(false);
  const [recognizedIngredients, setRecognizedIngredients] = useState<Ingredient[]>([]);
  const [mealPlan, setMealPlan] = useState<any>(null);

  const handleIngredientsIdentified = (newIngredients: Ingredient[]) => {
    // Filter out duplicates based on ingredient names
    const existingNames = new Set(recognizedIngredients.map(ing => ing.name.toLowerCase()));
    const uniqueNewIngredients = newIngredients.filter(
      ing => !existingNames.has(ing.name.toLowerCase())
    );

    if (uniqueNewIngredients.length === 0) {
      toast.info("No new ingredients were added to the list");
      return;
    }

    setRecognizedIngredients(prev => [...prev, ...uniqueNewIngredients]);
    toast.success(`Added ${uniqueNewIngredients.length} new ingredient(s) to the list`);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-secondary">Upload Your Ingredients</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PhotoUploadSection 
            isUploading={isUploading} 
            onIngredientsIdentified={handleIngredientsIdentified} 
          />
          <VideoUploadSection 
            isUploading={isUploading} 
            onIngredientsIdentified={handleIngredientsIdentified} 
          />
          <AudioRecordingSection 
            isUploading={isUploading} 
            onIngredientsIdentified={handleIngredientsIdentified} 
          />
          <TextInputSection 
            onIngredientsIdentified={handleIngredientsIdentified} 
          />
        </div>

        <RecognizedIngredients
          ingredients={recognizedIngredients}
          onRemove={(index) => {
            setRecognizedIngredients(prev => prev.filter((_, i) => i !== index));
          }}
          isGenerating={isGeneratingMealPlan}
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

export default UploadIngredients;