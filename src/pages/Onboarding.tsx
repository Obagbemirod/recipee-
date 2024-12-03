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
      const preferences = {
        ...values,
        lastUpdated: new Date().toISOString(),
        source: 'onboarding'
      };
      
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
      localStorage.setItem("dietaryPreference", values.dietaryPreference);
      localStorage.setItem("userCountry", values.country);
      localStorage.setItem("cuisineStyle", values.cuisineStyle);
      localStorage.setItem("allergies", JSON.stringify(values.allergies));
      
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
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/lovable-uploads/37baf138-5ca8-425f-b899-2c04d062dd01.png')` 
      }}
    >
      <div className="absolute top-4 left-4 z-10">
        <img
          src="/lovable-uploads/d973401f-a38b-4efd-b8e6-800f56f50f88.png"
          alt="Recipee Logo"
          className="h-16 w-auto md:h-20"
        />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl mx-auto space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Let's personalize your experience</h2>
            <p className="text-white/80">
              Tell us about your preferences to get better recipe recommendations
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-4 md:p-8 fixed-mobile">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                <CulturalPreferences form={form} />
                <DietaryPreferences form={form} />
                <AllergiesSection form={form} />

                <Button type="submit" className="w-full">
                  Complete Setup
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;