import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES_AND_CUISINES } from "@/components/onboarding/CulturalPreferences";

const formSchema = z.object({
  planName: z.string().min(1, "Plan name is required"),
  preferences: z.string().min(10, "Please provide more details about your preferences"),
  cuisine: z.string().min(1, "Cuisine selection is required"),
});

const GenerateMealPlan = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [userCountry, setUserCountry] = useState<string>("");

  useEffect(() => {
    const country = localStorage.getItem('userCountry') || '';
    setUserCountry(country);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planName: "",
      preferences: "",
      cuisine: userCountry ? `${userCountry}_cuisine` : "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    try {
      const userPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
      const preferences = [
        values.preferences,
        `Generate meals specific to ${values.cuisine} cuisine`,
        `Consider dietary preference: ${userPreferences.dietaryPreference || ''}`,
        `Avoid allergens: ${JSON.parse(localStorage.getItem('allergies') || '[]').join(', ')}`,
        `Strictly adhere to ${values.cuisine} cooking methods and ingredients`,
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
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/lovable-uploads/c7fbef5a-f4ab-42f2-b76e-837675074d73.png')` 
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
          
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 md:p-6 mb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="planName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter meal plan name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cuisine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Your Cuisine</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose your preferred cuisine" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {COUNTRIES_AND_CUISINES.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label} - {country.cuisine}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Preferences</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter any additional preferences..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <ChefHat className="mr-2 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <ChefHat className="mr-2" />
                      Generate Plan
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

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