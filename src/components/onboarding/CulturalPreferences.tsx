import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

interface CulturalPreferencesProps {
  form: UseFormReturn<any>;
}

const AFRICAN_COUNTRIES = [
  { value: "ghana", label: "Ghana" },
  { value: "nigeria", label: "Nigeria" },
  { value: "kenya", label: "Kenya" },
  { value: "senegal", label: "Senegal" },
  { value: "ethiopia", label: "Ethiopia" },
];

const CUISINE_PREFERENCES = [
  { value: "traditional", label: "Strictly Traditional" },
  { value: "modern", label: "Modern Fusion" },
  { value: "mixed", label: "Mix of Both" },
];

export const CulturalPreferences = ({ form }: CulturalPreferencesProps) => {
  const [isLocating, setIsLocating] = useState(false);

  const detectLocation = async () => {
    setIsLocating(true);
    try {
      if ("geolocation" in navigator) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        // For demo purposes, we're just showing a success message
        // In a real app, you'd use these coordinates with a geocoding service
        toast.success("Location detected successfully!");
        
      } else {
        toast.error("Location services not available");
      }
    } catch (error) {
      toast.error("Could not detect location");
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {AFRICAN_COUNTRIES.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={detectLocation}
                  disabled={isLocating}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {isLocating ? "Detecting..." : "Detect"}
                </Button>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cuisineStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Cuisine Style</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};