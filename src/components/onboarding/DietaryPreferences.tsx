import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";

interface DietaryPreferencesProps {
  form: UseFormReturn<any>;
}

export const DietaryPreferences = ({ form }: DietaryPreferencesProps) => {
  const dietaryOptions = [
    { value: "omnivore", label: "Omnivore (Everything)" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "pescatarian", label: "Pescatarian" },
    { value: "keto", label: "Keto" },
    { value: "paleo", label: "Paleo" },
    { value: "mediterranean", label: "Mediterranean" },
  ];

  return (
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
              {dietaryOptions.map((option) => (
                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {option.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};