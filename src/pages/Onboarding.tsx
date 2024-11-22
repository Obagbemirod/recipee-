import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const onboardingSchema = z.object({
  dietaryPreference: z.string(),
  cookingLevel: z.string(),
  allergies: z.array(z.string()),
});

const allergiesList = [
  { id: "nuts", label: "Nuts" },
  { id: "dairy", label: "Dairy" },
  { id: "shellfish", label: "Shellfish" },
  { id: "gluten", label: "Gluten" },
  { id: "soy", label: "Soy" },
];

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
      navigate("/");
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
      <div className="w-full max-w-2xl space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Let's personalize your experience</h2>
          <p className="text-muted-foreground mt-2">
            Tell us about your preferences to get better recipe recommendations
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="dietaryPreference"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Dietary Preference</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="omnivore" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Omnivore (Everything)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="vegetarian" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Vegetarian
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="vegan" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Vegan
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cookingLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Cooking Experience Level</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="beginner" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Beginner
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="intermediate" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Intermediate
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="advanced" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Advanced
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allergies"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Allergies & Restrictions</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {allergiesList.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="allergies"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Complete Setup
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Onboarding;