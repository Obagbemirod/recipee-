import { Button } from "@/components/ui/button";
import { ChefHat, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateMealPlan } from "@/utils/gemini";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MealPlanForm } from "@/components/meal-plan/MealPlanForm";
import { MealPlanDisplay } from "@/components/meal-plan/MealPlanDisplay";

const formSchema = z.object({
  planName: z.string().min(1, "Plan name is required"),
  preferences: z.string().min(10, "Please provide more details about your preferences"),
});

const GenerateMealPlan = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planName: "",
      preferences: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    try {
      // Get all user preferences from localStorage
      const userPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
      const preferences = [
        values.preferences,
        `Generate ${userPreferences.cuisineStyle || ''} style meals`,
        `Consider dietary preference: ${userPreferences.dietaryPreference || ''}`,
        `Avoid allergens: ${JSON.parse(localStorage.getItem('allergies') || '[]').join(', ')}`,
      ].filter(Boolean);

      const plan = await generateMealPlan(preferences);
      if (plan) {
        setMealPlan({ ...plan, name: values.planName });
        toast.success("Meal plan generated successfully!");
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
      toast.error("Error generating meal plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/lovable-uploads/15a2303a-2274-4f49-996e-d4d0640bdc12.png')` 
      }}
    >
      <div className="absolute top-4 left-4 z-10">
        <img 
          src="/lovable-uploads/d322a3a3-d51a-4bbc-a4ec-aef6e705df9c.png" 
          alt="Recipee Logo" 
          className="h-12 w-auto md:h-16"
        />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-24">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white text-center">
            Generate Your Weekly Meal Plan
          </h1>
          
          <MealPlanForm 
            form={form} 
            onSubmit={onSubmit} 
            isGenerating={isGenerating} 
          />

          {mealPlan && (
            <MealPlanDisplay 
              mealPlan={mealPlan} 
              setMealPlan={setMealPlan} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateMealPlan;