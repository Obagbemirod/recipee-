import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { COUNTRIES_AND_CUISINES, CUISINE_PREFERENCES } from "@/data/countriesAndCuisines";

interface CulturalPreferencesProps {
  form: UseFormReturn<any>;
}

const detectUserLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code.toLowerCase();
  } catch (error) {
    throw new Error('Failed to detect location');
  }
};

export const CulturalPreferences = ({ form }: CulturalPreferencesProps) => {
  const { data: detectedCountry, isLoading } = useQuery({
    queryKey: ['userLocation'],
    queryFn: detectUserLocation,
    retry: 1,
  });

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

  const handleAutoDetect = () => {
    if (detectedCountry) {
      handleCountrySelect(detectedCountry);
      toast.success("Location detected successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              Country
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoDetect}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                {isLoading ? "Detecting..." : "Auto-detect"}
              </Button>
            </FormLabel>
            <Select onValueChange={handleCountrySelect} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
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
              <SelectContent className="bg-white">
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