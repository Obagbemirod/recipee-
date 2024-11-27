import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

interface CulturalPreferencesProps {
  form: UseFormReturn<any>;
}

const CUISINE_PREFERENCES = [
  { value: "traditional", label: "Strictly Traditional" },
  { value: "modern", label: "Modern Fusion" },
  { value: "mixed", label: "Mix of Both" },
];

const COUNTRIES_AND_CUISINES = [
  { value: "nigeria", label: "Nigeria", cuisine: "Nigerian Cuisine" },
  { value: "italy", label: "Italy", cuisine: "Italian Cuisine" },
  { value: "ghana", label: "Ghana", cuisine: "Ghanaian Cuisine" },
  { value: "usa", label: "United States", cuisine: "American Cuisine" },
  { value: "ethiopia", label: "Ethiopia", cuisine: "Ethiopian Cuisine" },
  { value: "kenya", label: "Kenya", cuisine: "Kenyan Cuisine" },
  { value: "senegal", label: "Senegal", cuisine: "Senegalese Cuisine" },
];

export const CulturalPreferences = ({ form }: CulturalPreferencesProps) => {
  const handleCountrySelect = (value: string) => {
    form.setValue("country", value);
    localStorage.setItem("userCountry", value);
    const cuisine = COUNTRIES_AND_CUISINES.find(c => c.value === value)?.cuisine || "";
    localStorage.setItem("userCuisine", cuisine);
  };

  const handleCuisineStyleSelect = (value: string) => {
    form.setValue("cuisineStyle", value);
    localStorage.setItem("cuisineStyle", value);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <Select onValueChange={handleCountrySelect} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES_AND_CUISINES.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label} - {country.cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cuisineStyle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Cuisine Style</FormLabel>
            <Select onValueChange={handleCuisineStyleSelect} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select your preferred style" />
              </SelectTrigger>
              <SelectContent>
                {CUISINE_PREFERENCES.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
};