import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const GenerateMealPlan = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    toast.success("Meal plan generated successfully!");
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Generate Your Meal Plan</h1>
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
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Meal Plan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateMealPlan;