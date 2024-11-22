import { Button } from "@/components/ui/button";
import { ChefHat, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateMealPlan } from "@/utils/gemini";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MealPlanDay } from "@/components/MealPlanDay";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  planName: z.string().min(1, "Plan name is required"),
  preferences: z.string().min(10, "Please provide more details about your preferences"),
});

const GenerateMealPlan = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState<any>(null);
  const navigate = useNavigate();

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
      const plan = await generateMealPlan([values.preferences]);
      if (plan) {
        setMealPlan({ ...plan, name: values.planName });
        toast.success("Meal plan generated successfully!");
      } else {
        toast.error("Failed to generate meal plan");
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
      toast.error("Error generating meal plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateDayMeals = (day: string, meals: any) => {
    setMealPlan((prev: any) => ({
      ...prev,
      [day]: meals,
    }));
  };

  const saveMealPlan = () => {
    try {
      const savedPlans = JSON.parse(localStorage.getItem('savedMealPlans') || '[]');
      savedPlans.push({
        ...mealPlan,
        id: Date.now(),
        date: new Date().toISOString(),
      });
      localStorage.setItem('savedMealPlans', JSON.stringify(savedPlans));
      toast.success("Meal plan saved successfully!");
      navigate("/saved-items");
    } catch (error) {
      toast.error("Failed to save meal plan");
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-secondary">Generate Your Meal Plan</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-primary hover:border-2 transition-all duration-300">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="planName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary">Meal Plan Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., My Weekly Healthy Plan" 
                        {...field}
                        className="border-primary/20 focus:border-primary hover:border-primary transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary">Your Preferences</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about your dietary preferences and requirements..."
                        className="min-h-[200px] border-primary/20 focus:border-primary hover:border-primary transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white transition-colors"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <ChefHat className="animate-spin" />
                    Generating your meal plan...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ChefHat />
                    Generate Meal Plan
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {mealPlan && (
          <div className="bg-white rounded-lg shadow-md p-8 border border-primary hover:border-2 transition-all duration-300 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary">
                {mealPlan.name || "Your Weekly Meal Plan"}
              </h2>
              <Button
                onClick={saveMealPlan}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Plan
              </Button>
            </div>

            <div className="space-y-4">
              {Object.entries(mealPlan)
                .filter(([key]) => key !== 'name')
                .map(([day, meals]: [string, any]) => (
                  <MealPlanDay
                    key={day}
                    day={day}
                    meals={meals}
                    onUpdate={updateDayMeals}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateMealPlan;