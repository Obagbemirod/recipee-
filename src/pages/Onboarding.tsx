import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { DietaryPreferences } from "@/components/onboarding/DietaryPreferences";
import { AllergiesSection } from "@/components/onboarding/AllergiesSection";
import { motion } from "framer-motion";

const onboardingSchema = z.object({
  dietaryPreference: z.string(),
  cookingLevel: z.string(),
  allergies: z.array(z.string()),
});

const Onboarding = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      dietaryPreference: "omnivore",
      cookingLevel: "beginner",
      allergies: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof onboardingSchema>) => {
    try {
      // Here you would typically make an API call to save the preferences
      console.log("Onboarding values:", values);
      toast({
        title: "Preferences saved!",
        description: "Your profile has been set up successfully.",
      });
      navigate("/home");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl space-y-8 p-8"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold">Let's personalize your experience</h2>
          <p className="text-muted-foreground mt-2">
            Tell us about your preferences to get better recipe recommendations
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DietaryPreferences form={form} />
            <AllergiesSection form={form} />

            <Button type="submit" className="w-full">
              Complete Setup
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
};

export default Onboarding;