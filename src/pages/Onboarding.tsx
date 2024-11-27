import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { DietaryPreferences } from "@/components/onboarding/DietaryPreferences";
import { AllergiesSection } from "@/components/onboarding/AllergiesSection";
import { CulturalPreferences } from "@/components/onboarding/CulturalPreferences";
import { motion } from "framer-motion";

const onboardingSchema = z.object({
  dietaryPreference: z.string(),
  cookingLevel: z.string(),
  allergies: z.array(z.string()),
  country: z.string().min(1, "Please select your country"),
  cuisineStyle: z.string().min(1, "Please select your preferred cuisine style"),
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
      country: "",
      cuisineStyle: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof onboardingSchema>) => {
    try {
      localStorage.setItem("userPreferences", JSON.stringify(values));
      localStorage.setItem("dietaryPreference", values.dietaryPreference);
      
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
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/lovable-uploads/fb8ead65-8a5a-42ae-894d-8f6e65304ad8.png')` 
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <img
          src="/lovable-uploads/d973401f-a38b-4efd-b8e6-800f56f50f88.png"
          alt="Recipee Logo"
          className="h-24 w-auto"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl space-y-8 p-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">Let's personalize your experience</h2>
          <p className="text-muted-foreground mt-2">
            Tell us about your preferences to get better recipe recommendations
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CulturalPreferences form={form} />
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