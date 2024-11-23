import { Button } from "@/components/ui/button";
import { Camera, Video, Mic, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { identifyIngredients } from "@/utils/gemini";
import { generateMealPlan } from "@/utils/gemini";
import RecognizedIngredients from "@/components/RecognizedIngredients";
import IngredientBasedMealPlan from "@/components/IngredientBasedMealPlan";

interface Ingredient {
  name: string;
  confidence: number;
}

const UploadIngredients = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingMealPlan, setIsGeneratingMealPlan] = useState(false);
  const [recognizedIngredients, setRecognizedIngredients] = useState<Ingredient[]>([]);
  const [mealPlan, setMealPlan] = useState<any>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Convert image to base64 for API
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const ingredients = await identifyIngredients(base64String);
        setRecognizedIngredients(ingredients.map(name => ({ name, confidence: 0.9 })));
        toast.success(`${type} processed successfully!`);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error(`Failed to process ${type.toLowerCase()}. Please try again.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAudioRecording = async () => {
    setIsUploading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Here you would implement audio recording and conversion
      // For now, we'll just simulate it
      setTimeout(() => {
        setRecognizedIngredients([
          { name: "tomatoes", confidence: 0.95 },
          { name: "onions", confidence: 0.92 },
          { name: "garlic", confidence: 0.88 }
        ]);
        toast.success("Audio processed successfully!");
      }, 2000);
    } catch (error) {
      toast.error("Failed to access microphone. Please check permissions.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const text = (form.elements.namedItem('ingredients') as HTMLTextAreaElement).value;
    
    if (!text.trim()) {
      toast.error("Please enter your ingredients");
      return;
    }

    setIsUploading(true);
    try {
      const ingredients = await identifyIngredients(text);
      setRecognizedIngredients(ingredients.map(name => ({ name, confidence: 1 })));
      toast.success("Ingredients processed successfully!");
    } catch (error) {
      toast.error("Failed to process ingredients. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeIngredient = (index: number) => {
    setRecognizedIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const generateMealPlanFromIngredients = async () => {
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
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-secondary">Upload Your Ingredients</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo Upload */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-primary hover:border-2 transition-all duration-300">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Camera className="h-12 w-12 text-primary mb-4" />
                <p className="mb-2 text-sm text-secondary">
                  <span className="font-semibold">Upload a photo</span>
                </p>
                <p className="text-xs text-secondary/70">PNG, JPG or HEIC (MAX. 10MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'Photo')}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Video Upload */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-primary hover:border-2 transition-all duration-300">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Video className="h-12 w-12 text-primary mb-4" />
                <p className="mb-2 text-sm text-secondary">
                  <span className="font-semibold">Upload a video</span>
                </p>
                <p className="text-xs text-secondary/70">MP4, MOV or AVI (MAX. 100MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={(e) => handleFileUpload(e, 'Video')}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Audio Recording */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-primary hover:border-2 transition-all duration-300">
            <div className="flex flex-col items-center justify-center h-64">
              <Button
                size="lg"
                className={`rounded-full p-8 ${isUploading ? 'bg-primary/80' : 'bg-primary'} hover:bg-primary/90 transition-colors`}
                onClick={handleAudioRecording}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-12 w-12 animate-spin" />
                ) : (
                  <Mic className="h-12 w-12" />
                )}
              </Button>
              <p className="mt-4 text-secondary">
                {isUploading ? 'Processing...' : 'Click to start recording'}
              </p>
            </div>
          </div>

          {/* Text Input */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-primary hover:border-2 transition-all duration-300">
            <form onSubmit={handleTextSubmit}>
              <div className="flex flex-col items-center justify-center h-64">
                <FileText className="h-12 w-12 text-primary mb-4" />
                <textarea
                  name="ingredients"
                  placeholder="Enter your ingredients, one per line..."
                  className="w-full h-32 p-2 border rounded-md mb-4 border-primary/20 focus:border-primary hover:border-primary transition-colors resize-none"
                  disabled={isUploading}
                />
                <Button 
                  type="submit" 
                  disabled={isUploading}
                  className="bg-primary hover:bg-primary/90 text-white transition-colors"
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    "Submit Ingredients"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <RecognizedIngredients
          ingredients={recognizedIngredients}
          onRemove={removeIngredient}
          onConfirm={generateMealPlanFromIngredients}
        />

        <IngredientBasedMealPlan mealPlan={mealPlan} />
      </div>
    </div>
  );
};

export default UploadIngredients;