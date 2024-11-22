import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
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
      const plan = await generateMealPlan([values.preferences]);
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
                        placeholder="Tell us about your dietary preferences and requirements. For example:
- Preferred cuisines (Italian, Asian, Mediterranean, etc.)
- Dietary restrictions (vegetarian, gluten-free, dairy-free)
- Caloric requirements
- Meal timing preferences for breakfast, lunch, and dinner
- Any ingredients you want to avoid
- Cooking skill level and time availability"
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
            <h2 className="text-xl font-semibold mb-4 text-secondary">Your Weekly Meal Plan</h2>
            <div className="space-y-4">
              {Object.entries(mealPlan).map(([day, meals]: [string, any]) => (
                <div key={day} className="border-b border-primary/20 pb-4">
                  <h3 className="font-medium mb-2 capitalize text-secondary">{day}</h3>
                  <div className="space-y-2">
                    {Object.entries(meals).map(([mealType, meal]: [string, any]) => (
                      <div key={mealType}>
                        <span className="font-medium capitalize text-primary">{mealType}: </span>
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