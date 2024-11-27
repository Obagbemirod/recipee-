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
      className="min-h-screen pt-20 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/lovable-uploads/15a2303a-2274-4f49-996e-d4d0640bdc12.png')` 
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white text-center">
            Generate Your Weekly Meal Plan
          </h1>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="planName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Plan Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., My Weekly Healthy Plan" 
                          {...field}
                          className="bg-white"
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
                      <FormLabel>Your Preferences</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your dietary preferences and requirements..."
                          className="min-h-[150px] bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <ChefHat className="animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ChefHat />
                      Generate Plan
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {mealPlan && (
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {mealPlan.name || "Your Weekly Meal Plan"}
                </h2>
                <Button
                  onClick={() => {
                    const savedPlans = JSON.parse(localStorage.getItem('savedMealPlans') || '[]');
                    savedPlans.push({
                      ...mealPlan,
                      id: Date.now(),
                      date: new Date().toISOString(),
                    });
                    localStorage.setItem('savedMealPlans', JSON.stringify(savedPlans));
                    toast.success("Meal plan saved successfully!");
                    navigate("/saved-items");
                  }}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
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
                      onUpdate={(day, meals) => {
                        setMealPlan(prev => ({
                          ...prev,
                          [day]: meals
                        }));
                      }}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateMealPlan;