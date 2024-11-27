import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ChefHat } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface MealPlanFormProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => Promise<void>;
  isGenerating: boolean;
}

export const MealPlanForm = ({ form, onSubmit, isGenerating }: MealPlanFormProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 md:p-6 mb-6">
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
                <FormLabel>Additional Preferences</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any specific preferences for this meal plan..."
                    className="min-h-[100px] bg-white"
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
  );
};