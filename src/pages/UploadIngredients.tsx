import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Video, Mic, Type, Plus } from "lucide-react";
import { PhotoUploadSection } from "@/components/PhotoUploadSection";
import { VideoUploadSection } from "@/components/VideoUploadSection";
import { AudioRecordingSection } from "@/components/AudioRecordingSection";
import { TextInputSection } from "@/components/TextInputSection";
import RecognizedIngredients from "@/components/RecognizedIngredients";
import IngredientBasedMealPlan from "@/components/IngredientBasedMealPlan";
import { BrandLogo } from "@/components/BrandLogo";
import { toast } from "sonner";
import { generateMealPlan } from "@/utils/gemini";
import { normalizeIngredient } from "@/utils/ingredientMapping";

interface Ingredient {
  name: string;
  confidence: number;
}

const UploadIngredients = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingMealPlan, setIsGeneratingMealPlan] = useState(false);
  const [recognizedIngredients, setRecognizedIngredients] = useState<Ingredient[]>([]);
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const handleIngredientsIdentified = (newIngredients: Ingredient[]) => {
    const userCountry = localStorage.getItem('userCountry') || 'nigeria';
    const existingNames = new Set(recognizedIngredients.map(ing => ing.name.toLowerCase()));
    
    const normalizedIngredients = newIngredients.map(ing => ({
      ...ing,
      name: normalizeIngredient(ing.name, userCountry)
    }));

    const uniqueNewIngredients = normalizedIngredients.filter(
      ing => !existingNames.has(ing.name.toLowerCase())
    );

    if (uniqueNewIngredients.length === 0) {
      toast.info("No new ingredients were added to the list");
      return;
    }

    setRecognizedIngredients(prev => [...prev, ...uniqueNewIngredients]);
    toast.success(`Added ${uniqueNewIngredients.length} new ingredient(s) to the list`);
    setActiveInput(null);
  };

  const inputOptions = [
    { id: 'photo', icon: Camera, label: 'Photo', component: PhotoUploadSection },
    { id: 'video', icon: Video, label: 'Video', component: VideoUploadSection },
    { id: 'audio', icon: Mic, label: 'Audio', component: AudioRecordingSection },
    { id: 'text', icon: Type, label: 'Text', component: TextInputSection }
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ 
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/lovable-uploads/c05c3efb-64a7-4baf-a077-fc614979596d.png')` 
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="w-32">
            <BrandLogo />
          </div>
        </header>

        <h1 className="text-2xl font-bold mb-4 text-center text-secondary">
          Upload Your Ingredients
        </h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {inputOptions.map(({ id, icon: Icon, label, component: Component }) => (
            <Dialog key={id} open={activeInput === id} onOpenChange={(open) => setActiveInput(open ? id : null)}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2 border-2 border-primary/20 hover:border-primary transition-colors"
                >
                  <Icon className="h-8 w-8 text-primary" />
                  <span>{label}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                {activeInput === id && (
                  <div className="p-4">
                    <Component
                      isUploading={isUploading}
                      onIngredientsIdentified={handleIngredientsIdentified}
                    />
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ))}
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
              const userCountry = localStorage.getItem('userCountry') || 'nigeria';
              const userDiet = localStorage.getItem('dietaryPreference') || 'none';
              
              const ingredientsList = recognizedIngredients.map(ing => ing.name).join(", ");
              const preferences = [
                `Generate meals using these ingredients: ${ingredientsList}.`,
                `ONLY generate traditional ${userCountry} dishes and local delicacies.`,
                `Consider dietary preference: ${userDiet}.`,
                'Include only dishes that are commonly prepared in this region.'
              ];
              
              const plan = await generateMealPlan(preferences);
              setMealPlan({ ...plan, name: "Local Cuisine Meal Plan" });
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
