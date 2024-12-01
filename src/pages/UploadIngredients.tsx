import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera, Video, Mic, Type } from "lucide-react";
import { generateMealPlan } from "@/utils/gemini";
import { PhotoUploadSection } from "@/components/PhotoUploadSection";
import { VideoUploadSection } from "@/components/VideoUploadSection";
import { AudioRecordingSection } from "@/components/AudioRecordingSection";
import { TextInputSection } from "@/components/TextInputSection";
import RecognizedIngredients from "@/components/RecognizedIngredients";
import IngredientBasedMealPlan from "@/components/IngredientBasedMealPlan";
import { BrandLogo } from "@/components/BrandLogo";
import { normalizeIngredient } from "@/utils/ingredientMapping";
import { CuisineSelector } from "@/components/meal-plan/CuisineSelector";
import { useForm, FormProvider } from "react-hook-form";

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
  const [mealPlanName, setMealPlanName] = useState("");
  
  const methods = useForm({
    defaultValues: {
      cuisine: localStorage.getItem('userCountry') || 'nigeria'
    }
  });

  const inputOptions = [
    { id: 'photo', icon: Camera, label: 'Photo', component: PhotoUploadSection },
    { id: 'video', icon: Video, label: 'Video', component: VideoUploadSection },
    { id: 'audio', icon: Mic, label: 'Audio', component: AudioRecordingSection },
    { id: 'text', icon: Type, label: 'Text', component: TextInputSection }
  ];

  const handleConfirm = async () => {
    if (!mealPlanName.trim()) {
      toast.error("Please enter a meal plan name");
      return;
    }

    if (recognizedIngredients.length === 0) {
      toast.error("Please add some ingredients first");
      return;
    }

    setIsGeneratingMealPlan(true);
    try {
      const selectedCuisine = methods.getValues('cuisine');
      const userDiet = localStorage.getItem('dietaryPreference') || 'none';
      
      const ingredientsList = recognizedIngredients.map(ing => normalizeIngredient(ing.name));
      const preferences = [
        `ONLY generate traditional ${selectedCuisine} dishes and local delicacies.`,
        `Consider dietary preference: ${userDiet}.`,
        'Include only dishes that are commonly prepared in this region.'
      ];
      
      const plan = await generateMealPlan(preferences, ingredientsList);
      if (plan) {
        setMealPlan({ ...plan, name: mealPlanName });
        toast.success("Meal plan generated successfully!");
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
      toast.error("Failed to generate meal plan. Please try again.");
    } finally {
      setIsGeneratingMealPlan(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed overflow-x-hidden fixed-mobile"
      style={{ 
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/lovable-uploads/c05c3efb-64a7-4baf-a077-fc614979596d.png')` 
      }}
    >
      <FormProvider {...methods}>
        <div className="container mx-auto px-4 py-8 max-w-screen-lg">
          <header className="flex justify-between items-center mb-8">
            <div className="w-32">
              <BrandLogo />
            </div>
          </header>

          <h1 className="text-2xl font-bold mb-4 text-center text-secondary">
            Upload Your Ingredients
          </h1>

          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <Input
              type="text"
              placeholder="Enter your meal plan name"
              value={mealPlanName}
              onChange={(e) => setMealPlanName(e.target.value)}
              className="mb-4"
            />
            <div className="mb-4">
              <CuisineSelector form={methods} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {inputOptions.map(({ id, icon: Icon, label, component: Component }) => (
              <Dialog key={id} open={activeInput === id} onOpenChange={(open) => setActiveInput(open ? id : null)}>
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2 border-2 border-primary/20 hover:border-primary transition-colors"
                  onClick={() => setActiveInput(id)}
                >
                  <Icon className="h-8 w-8 text-primary" />
                  <span>{label}</span>
                </Button>
                <DialogContent className="dialog-content">
                  {activeInput === id && (
                    <div className="p-4">
                      <Component
                        isUploading={isUploading}
                        onIngredientsIdentified={(ingredients: Ingredient[]) => {
                          setRecognizedIngredients(prev => [...prev, ...ingredients]);
                          setActiveInput(null);
                        }}
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
            onConfirm={handleConfirm}
          />

          {mealPlan && <IngredientBasedMealPlan mealPlan={mealPlan} />}
        </div>
      </FormProvider>
    </div>
  );
};

export default UploadIngredients;
